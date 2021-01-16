const initialState = {
  // basic info
  agent: null,

  // authentication 
  authorized: false,
  user: null,
  loginStamp: null,

  // music player state
  music_player: null,
  music_playing: false,
  music_info: null,
  music_search_results: [],
  music_search_results_play_songmid: null
}


export default initialState