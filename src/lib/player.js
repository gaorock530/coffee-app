const EventEmitter = require('./event')

class Player {

  constructor(url) {
    this.url = url
    this.audioContext = null
    this.audioElement = null
    this.events = new EventEmitter()

    this.init()
  }

  init () {
    

    if (!this.url) {
      console.warn('Player initial invalid URL.')
      throw Error('Player initial invalid URL')
    }
    console.log(this.url)

    this.audioElement = new Audio(this.url)
    // console.log(this.audioElement)

    this._playmusic = this._playmusic.bind(this)
    this._timeupdate = this._timeupdate.bind(this)
    this._pause = this._pause.bind(this)
    this._end = this._end.bind(this)
    
    this.audioElement.addEventListener('canplaythrough', this._playmusic)
    this.audioElement.addEventListener('timeupdate', this._timeupdate)
    this.audioElement.addEventListener('pause', this._pause)
    this.audioElement.addEventListener('ended', this._end)
  }
  
  get duration () {
    if (this.audioElement) return this.audioElement.duration
    return 0
  }

  static timeFormat (timeInSeconds) {
    const min = Math.floor(timeInSeconds / 60)
    const sec = Math.floor(timeInSeconds - min * 60)

    const sMin = String(min)
    const sSec = String(sec)

    return `${sMin.length === 1?'0':''}${sMin}:${sSec.length === 1?'0':''}${sSec}`
  }

  play () {
    this._playmusic()
  }

  pause () {
    this._pause()
  }

  toggle () {
    if (this.audioElement.paused) this._playmusic()
    else this._pause()
  }


  _playmusic () {
    // console.log('play event')
    if (!this.audioElement.paused) return
    this.audioElement.play()
    this.events.excute('play', {
      event: 'play'
    })
  }

  _timeupdate () {
    // console.log('time update event')
    this.events.excute('update', {
      event: 'update',
      value: this.audioElement.currentTime
    })
    // console.log(this.audioElement.currentTime)
  }

  _pause () {
    if (this.audioElement.paused) return
    this.audioElement.pause()
    this.events.excute('pause', {
      event: 'pause'
    })
  }

  _end () {
    this.events.excute('ended', {
      event: 'ended'
    })
  }

  destory () {
    if (this.audioElement) {
      this.audioElement.pause()
      this.audioElement.removeEventListener('canplaythrough', this._playmusic)
      this.audioElement.removeEventListener('timeupdate', this._timeupdate)
      this.audioElement.removeEventListener('pause', this._pause)
    }
    this.events.destory()
    this.audioElement = null
    this.audioContext = null
    this.url = null
  }

  on (event, fn) {
    const no = this.events.add(event, fn)
    return no
  }

  off (event, no) {
    return this.events.del(event, no)
  }
}

module.exports = Player