const LinkedList = require('./TwoWayLinekedList')

const cuid = require('cuid')

/**
 * @class Playlist
 * @author Magic
 * @version 1.0.0
 * @description a subclass of MusicPlayer, which manages playlist.
 */

module.exports = class Playlist {
  constructor () {
    this.currentlist = new LinkedList()
    this.currentPlayingSongID = null
  } 

  get size () {
    return this.currentlist.size
  }

  get currentID () {
    return this.currentPlayingSongID
  }

  add (songdata) {
    const data = {
      id: '',
      songname: '',
      songmid: '',
      duration: '',
      artists: [],
      albumname: '',
      albummid: '',
      albumpic: '',
      priority: ''
    }

    this.currentlist.append()
  }
 
}

