const EventEmitter = require('./event')

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
    else this.init(url)
 
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

  init (url) {
    this.audioElement = new Audio(url)

    this.audioElement.autoplay = this.config.autoplay
    this.audioElement.loop = this.config.mode === 1
    this.volume = this.config.defaultVolume
    
    this._playmusic = this._playmusic.bind(this)
    this._timeupdate = this._timeupdate.bind(this)
    this._pause = this._pause.bind(this)
    this._end = this._end.bind(this)
    this._loaded = this._loaded.bind(this)
    this._seeked = this._seeked.bind(this)
    this._seeking = this._seeking.bind(this)
    this._volumechange = this._volumechange.bind(this)
    
    this.audioElement.addEventListener('canplaythrough', this._playmusic)
    this.audioElement.addEventListener('timeupdate', this._timeupdate)
    this.audioElement.addEventListener('pause', this._pause)
    this.audioElement.addEventListener('ended', this._end)
    this.audioElement.addEventListener('loadedmetadata', this._loaded)
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

  get playlist () {
    return this.config.playlist
  }

  set playlist (list) {
    this.config.playlist = list
    this.event.excute('playlistupdated', {
      event: 'playlistupdated',
      list: list,
      length: list.length
    })
  }

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

  

  play () {
    if (!this.ready) return
    this._playmusic()
  }

  playnext () {
    this._playnext()
  }

  playlast () {
    if (this.playlist.length === 0) return

    const index = --this.currentSongIndex

    if (index < 0) this.currentSongIndex = this.playlist.length - 1

    this.events.excute('last', {
      event: 'last',
      value: this.currentSongIndex
    })
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
    // console.log(newPosition)
    this.audioElement.currentTime = newPosition
    // this.audioElement.fastSeek()
  }

  _loaded () {
    this._log('music loaded.')
    this.loaded = true
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
      value: this.audioElement.currentTime
    })
  }

  _seeked () {
    this._log('music seeked...')
    this.events.excute('update', {
      event: 'update - seeked',
      value: this.audioElement.currentTime
    })
  }

  _seeking () {
    this._log('music seeking...')
    this.events.excute('update', {
      event: 'update - seeking'
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
    if (this.config.mode !== 1) this._playnext()
  }

  _playnext () {
    if (this.playlist.length === 0) return
  
    const index = ++this.currentSongIndex
    // if mode is 2, NO play next when playlist play finished
    if (this.config.mode === 2 && index >= this.playlist.lengt) return this.currentSongIndex = 0

    if (index >= this.playlist.length) this.currentSongIndex = 0

    this.events.excute('next', {
      event: 'next',
      value: this.currentSongIndex
    })
  }

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
    const no = this.events.add(event, fn)
    return no
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