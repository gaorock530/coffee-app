module.exports = class TwoWayLinkedLIst {
  constructor () {
    this.head = new Node ('head')
    this.tail = new Node ('tail')
    this.data = new Map()

    this.head.next = this.tail
    this.tail.prev = this.head
  }

  get size () {
    return this.data.size
  }


  clear () {
    this.head.next = this.tail
    this.tail.prev = this.head

    this.data.clear()
  }

  // append at last
  append (value, data) {
    if (this.data.has(value)) return false

    const newNode = new Node(value, this.tail.prev, this.tail)

    this.tail.prev.next = newNode
    this.tail.prev = newNode

    // the 'value' is key
    this.data.set(value, data)

    return value
  }

  // append at first
  preappend (value, data) {
    if (this.data.has(value)) return false

    const newNode = new Node(value, this.head, this.head.next)

    this.head.next.prev = newNode
    this.head.next = newNode
    // the 'value' is key
    this.data.set(value, data)

    return value
  }


  // traverse all the data
  toArray ({data = false, back = false}) {
    const results = []

    let current = back?this.tail.prev:this.head.next

    let condition = current && current.value !== (back?'head':'tail')
    console.log(this.data)

    while (condition) {
      results.push(data?this.data.get(current.value):current.value)
      current = back?current.prev:current.next
      condition = current && current.value !== (back?'head':'tail')
    }

    return results
  }

  // append after a node by index
  appendAfter (value, index, data = null) {
    if (this.data.has(value)) return false

    const current = this.findByIndex(index)
    if (!current) return false

    const newNode = new Node(value, current, current.next)
    current.next.prev = newNode
    current.next = newNode
    // the 'value' is key
    this.data.set(value, data)
  }
  // append before a node by index
  appendBefore(value, index, data = null) {

    if (this.data.has(value)) return false

    const current = this.findByIndex(index)
    if (!current) return false

    const newNode = new Node(value, current.prev, current)
    current.prev.next = newNode
    current.prev = newNode
    // the 'value' is key
    this.data.set(value, data)
  }


  insertAfter (value, targetValue, data = null) {
    if (this.data.has(value)) return false

    const current = this.findByValue(targetValue)
    if (!current) return false

    const newNode = new Node(value, current, current.next)
    current.next.prev = newNode
    current.next = newNode
    // the 'value' is key
    this.data.set(value, data)
  }

  insertBefore(value, targetValue, data = null) {
    if (this.data.has(value)) return false
    const current = this.findByValue(targetValue)
    if (!current) return false

    const newNode = new Node(value, current.prev, current)
    current.prev.next = newNode
    current.prev = newNode
    // the 'value' is key
    this.data.set(value, data)

    return value
  }


  swap (valueA, valueB) {
    if (valueA === valueB) return false
    
    const targetA = this.findByValue(valueA)
    const targetB = this.findByValue(valueB)

    if (!targetA || !targetB) return false

    const tempValue = targetA.value

    console.log('------------------swaping--------------------')
    targetA.value = targetB.value
    targetB.value = tempValue


    return true
  }


  removeByIndex (index) {
    const current = this.findByIndex(index)
    if (!current) return false

    const prev = current.prev
    const next = current.next

    prev.next = next
    next.prev = prev
  
    this.data.delete(current.value)
    return index
  }

  removeByValue (value) {
    const current = this.findByValue(value)
    if (!current) return false

    const prev = current.prev
    const next = current.next

    prev.next = next
    next.prev = prev

    this.data.delete(current.value)

    return value
  }

  findByIndex (index) {
    let current = this.head
    
    if (index < 0 || index > this.data.size) return false

    for (let idx=0;idx<index + 1;idx++) {
      current = current.next
    }
    return current
  }


  findByValue (value) {
    let current = this.head

    if (!this.data.has(value)) return false

    while (current.value !== value) {
      current = current.next
    }

    return current
  }

  getDataByValue (value) {
    return this.data.get(value)
  }

  getDataByIndex (index) {
    const target = this.findByIndex(index)
    if (!target) return null
    return this.data.get(target.value)
  }

}



class Node {
  constructor (value = null, prev = null, next = null) {
    if (value instanceof Node) {
      this.value = value.value
      this.prev = value.prev
      this.next = value.next
    } else {
      this.value = value
      this.prev = prev
      this.next = next
    }
  }
}