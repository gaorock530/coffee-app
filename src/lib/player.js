const EventEmitter = require('./event')
const cuid = require('cuid')

/**
 * -------------------------------------------------------
 * @class Player
 * @author Magic
 * @version 1.0.0
 * @description music player that manages single song play 
 * and handle playlists.
 * -------------------------------------------------------
 * @property {
 *  STATIC:
 * 
 *    timeFormat (timeInSeconds)
 * 
 *  GETTER:
 * 
 *    ready
 *    duration
 *    volume
 * 
 *  SETTER:
 * 
 *    loop
 *    volume
 *  
 *  METHODS: 
 * 
 *    load (url)
 *    unload ()
 *    
 *    play ()
 *    pause ()
 *    toggle ()
 *    seek (position, percent = true)
 *
 *    on (event, fn)
 *    once (event, fn)
 *    off (event, n)
 *     
 *    clear()
 *    destory ()
 * 
 *  EVENTS:
 *     
 *    'loaded'
 *    'musicready'
 *    'unload'
 *    'volumechange'
 *      
 *    'play'
 *    'update'
 *    'pause'
 *    'ended'
 *    
 * } 
 * 
 */

const DEGUB_INFO = 'Player debug:'

const DEFAULT_CONFIG = {
  autoplay: true,
  debug: true,
  defaultVolume: 80,  //percent
  /**
   * @property mode
   * [0] - repeat playlist      loop=false
   * [1] - repeat one song      loop=true
   * [2] - play playlist once   loop=false
   */
  mode: 0,       
  playlist: []
}

class Player {
  constructor({userConfig}) {
    this.audioContext = null
    this.audioElement = null
    this.events = new EventEmitter()
    this.loaded = false
    this.config = {...DEFAULT_CONFIG, ...userConfig}
    this.currentSongIndex = 0
    // this._eventRecorder = []
  }

  _log () {
    if (this.config.debug) {
      const arg = [DEGUB_INFO, ...arguments]
      console.log.apply(this, arg)
    }
  }

  load (url) {
    this._log({url})

    if (!url) {
      this.unload()
      console.warn('Player initial invalid URL.')
      throw Error('Player initial invalid URL')
    }

    if (this.audioElement) this._reload (url)
    else this._init(url)
 
  }

  unload () {
    if (!this.ready) return
    this.audioElement.currentTime = 0
    this.audioElement.src = ''
    this.loaded = false
    this.events.excute('unload', {
      event: 'unload'
    })
  }

  _init (url) {
    this.audioElement = new Audio(url)

    this.audioElement.autoplay = this.config.autoplay
    this.audioElement.loop = this.config.mode === 1
    this.volume = this.config.defaultVolume
    
    this._canplaythrogh = this._canplaythrogh.bind(this)
    this._playmusic = this._playmusic.bind(this)
    this._timeupdate = this._timeupdate.bind(this)
    this._pause = this._pause.bind(this)
    this._end = this._end.bind(this)
    this._loaded = this._loaded.bind(this)
    this._seeked = this._seeked.bind(this)
    this._seeking = this._seeking.bind(this)
    this._volumechange = this._volumechange.bind(this)
    
    this.audioElement.addEventListener('loadedmetadata', this._loaded)
    this.audioElement.addEventListener('canplaythrough', this._canplaythrogh)
    this.audioElement.addEventListener('timeupdate', this._timeupdate)
    this.audioElement.addEventListener('pause', this._pause)
    this.audioElement.addEventListener('ended', this._end)
    this.audioElement.addEventListener('seeked', this._seeked)
    this.audioElement.addEventListener('seeking', this._seeking)
    this.audioElement.addEventListener('volumechange', this._volumechange)
  }

  _reload (url) {
    this.loaded = false
    this.audioElement.src = url
  }

  get ready () {
    return this.audioElement && this.loaded
  }
  
  get duration () {
    if (this.audioElement) return this.audioElement.duration
    return 0
  }

  get volume () {
    // percentage
    return this.audioElement?this.audioElement.volume * 100:0
  }

  set volume (percent) {
    if (this.audioElement) {
      this._log('volume changed to', percent, '%')
      // exponential volume curve
      const x = percent / 100
      const y = x * x
      const vol = Math.min(1, Math.max(0, y))

      this.audioElement.volume = vol
    }
  }

  // get playlist () {
  //   return this.config.playlist
  // }

  // set playlist (list) {
  //   this.config.playlist = list
  //   this.event.excute('playlistupdated', {
  //     event: 'playlistupdated',
  //     list: list,
  //     length: list.length
  //   })
  // }

  set loop (value) {
    if (this.audioElement) this.audioElement.loop = value
  }

  static timeFormat (timeInSeconds) {
    if (!timeInSeconds) return '00:00'

    const min = Math.floor(timeInSeconds / 60)
    const sec = Math.floor(timeInSeconds - min * 60)

    const sMin = String(min)
    const sSec = String(sec)

    return `${sMin.length === 1?'0':''}${sMin}:${sSec.length === 1?'0':''}${sSec}`
  }

  

  
  // playnext () {
  //   this._playnext()
  // }

  // playlast () {
  //   if (this.playlist.length === 0) return

  //   const index = --this.currentSongIndex

  //   if (index < 0) this.currentSongIndex = this.playlist.length - 1

  //   this.events.excute('last', {
  //     event: 'last',
  //     value: this.currentSongIndex
  //   })
  // }
  play () {
    if (!this.ready) return
    this._playmusic()
  }


  pause () {
    if (!this.ready) return
    this._pause()
  }

  toggle () {
    if (!this.ready) return
    if (this.audioElement.paused) this._playmusic()
    else this._pause()
  }

  /**
   * @param {time/percent} position 
   */
  seek (position, percent = true) {
    if (!this.ready) return
    const newPosition = percent?this.audioElement.duration * position:position
    this.audioElement.currentTime = newPosition
  }

  _loaded () {
    this._log('music loaded.')
    this.loaded = true
    this.events.excute('loaded', {
      event: 'loaded'
    })
  }

  _canplaythrogh () {
    this.events.excute('musicready', {
      event: 'musicready'
    })
    if (this.config.autoplay) this._playmusic()
  }


  _playmusic () {
    if (!this.ready) return

    this._log('music playing.')
    this.audioElement.play()
    this.events.excute('play', {
      event: 'play'
    })
  }

  _timeupdate () {
    // this._log('music time update -', this.audioElement.currentTime)
    this.events.excute('update', {
      event: 'update',
      state: 'native',
      value: this.audioElement.currentTime
    })
  }

  _seeked () {
    this._log('music seeked...')
    this.events.excute('update', {
      event: 'update',
      state: 'seeked',
      value: this.audioElement.currentTime
    })
  }

  _seeking () {
    this._log('music seeking...')
    this.events.excute('update', {
      event: 'update',
      state: 'seeking',
      value: this.audioElement.currentTime
    })
  }

  _volumechange () {
    this._log('music volume changed')
    this.events.excute('volumechange', {
      event: 'volumechange',
      value: this.volume
    })
  }

  _pause () {
    if (this.ready && this.audioElement.paused) return
    this._log('music paused.')
    this.audioElement.pause()
    this.events.excute('pause', {
      event: 'pause'
    })
  }

  _end () {
    this._log('music ended.')
    this.events.excute('ended', {
      event: 'ended'
    })

    // if mode is not 1(repeat) then excute next song
    // if (this.config.mode !== 1) this._playnext()
  }

  // _playnext () {
  //   if (this.playlist.length === 0) return
  
  //   const index = ++this.currentSongIndex
  //   // if mode is 2, NO play next when playlist play finished
  //   if (this.config.mode === 2 && index >= this.playlist.lengt) return this.currentSongIndex = 0

  //   if (index >= this.playlist.length) this.currentSongIndex = 0

  //   this.events.excute('next', {
  //     event: 'next',
  //     value: this.currentSongIndex
  //   })
  // }

  destory () {

    if (this.audioElement) {
      this.audioElement.pause()
      this.audioElement.removeEventListener('canplaythrough', this._playmusic)
      this.audioElement.removeEventListener('timeupdate', this._timeupdate)
      this.audioElement.removeEventListener('pause', this._pause)
      this.audioElement.removeEventListener('ended', this._end)
      this.audioElement.removeEventListener('loadedmetadata', this._loaded)
    }
    this.events.destory()
    this.audioElement = null
    this.audioContext = null
    this.url = null

    this._log('player destoryed.')
  }

  on (event, fn) {
    return this.events.add(event, fn)
  }

  once(event, fn) {
    return this.events.add(event, fn, true)
  }

  off (event, no) {
    return this.events.del(event, no)
  }

  clear () {
    this._log('player event destoryed.')
    this.events.destory()
  }

  

}

module.exports = Player


/**
 * @class Playlist
 * @author Magic
 * @version 1.0.0
 * @description a subclass of MusicPlayer, which manages playlist.
 */

class Playlist {
  constructor () {
    this.currentlist = new Map()
    this.idList = []
    this.currentPlayingSongID = null
  } 

  get length () {
    return this.currentlist.length
  }

  get currentID () {
    return this.currentPlayingSongID
  }

  loadlist (songlist) {
    if (typeof songlist === 'object' && songlist instanceof Array) {

      for(let song of songlist) {
        this.append(song)
      }

      return this.length

    } else {
      console.warn('Playlist:', '[loadlist] {songlist} is not a Array')
      return false
    }
  }

  append (song) {
    if (typeof song === 'object') {
      // build structure
      if (!song.id) song.id = cuid.slug()
      song.vip = true  // indicates the song is appended by a VIP user **experimental
      
      this.currentlist.push(song)
      return song.id

    } else {
      console.warn('Playlist:', '[append] {song} is not a Object')
      return false
    }
  }

  remove (songid) {
    if (typeof songid === 'string') {

      if (this.currentPlayingSongID === songid) console.warn('Playlist:', '[remove] {songid} is current playing song.')

      this.currentlist = this.currentlist.filter(song => song.id !== songid)
      return songid

    } else {
      console.warn('Playlist:', '[remove] {songid} is not a String')
      return false
    }

  }

  clear () {
    this.currentlist = []
  }


 
}


class LinkedList {
  constructor () {
    this.head = null
    this.list = new Map()
  }

  // append node to the last position
  append (id, data) {
    const nodeReference = new Node(id)

    if (this.head === null) {
      this.head = nodeReference
    } else {
      let previous = this.head, current
      while (previous.next) {
        current = previous
      }
      current.next = nodeReference
    }

    this.list.set(id, data)
  }

  // insert node

  // remove node

  // get node

  // get all node
  showlist () {
    const result = []
    if (this.head === null) return result 

    let previous = this.head, current

    while (previous.next) {
      current = previous
    }

  }
}


class Node {
  constructor (data, prev = null, next = null) {
    this.data = data
    this.prev = prev
    this.next = next
  }

  addNode (node) {
    this.next = node
  }




}