const initialState = {
  // basic info
  agent: null,

  // authentication 
  authorized: false,
  user: null,
  loginStamp: null,

  // music player state
  music_player: null,                                 // store MusicPlayer instance (master)
  music_playing: false,                               // current music playing state
  music_info: null,                                   // current music infomation ['songname', 'songmid', 'url', ...]
  music_search_results: [],                           // store search results
  music_search_results_play_songmid: null             // store songmid as ID identifier if a song is playing from search results
}


export default initialState