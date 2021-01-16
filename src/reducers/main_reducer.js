import {
  LOGIN, 
  LOGOUT,
  SET_USER,
} from '../actions/main_action'

import {
  SET_MUSIC_PLAYER,
  DEL_MUSIC_PLAYER,

  MUSIC_SET_PLAY,
  MUSIC_SET_STOP,
  MUSIC_TOGGLE_PLAY,
  MUSIC_MOUNT,
  MUSIC_UNMOUNT,

  SET_MUSIC_SEARCH_RESULTS,
  SET_MUSIC_SEARCH_PLAYMID
} from '../actions/music_action'


 
const reducer = (state, action) => {
  switch (action.type) {
    // authentication
    case LOGIN:
      return {...state, authorized: true, user: action.payload}
    case LOGOUT:
      return {...state, authorized: false, user: null}
    case SET_USER:
      return {...state, user: action.payload}

    // music player
    case SET_MUSIC_PLAYER: 
      return {...state, music_player: action.payload}
    case DEL_MUSIC_PLAYER:
      return {...state, music_player: null, music_playing: false}
    // music state
    case MUSIC_SET_PLAY:
      if (!state.music_info) return state;
      return {...state, music_playing: true}
    case MUSIC_SET_STOP:
      return {...state, music_playing: false}
    case MUSIC_TOGGLE_PLAY:
      if (!state.music_info) return state;
      return {...state, music_playing: !state.music_playing}

    case SET_MUSIC_SEARCH_RESULTS:
      console.log('SET_MUSIC_SEARCH_RESULTS')
      return {...state, music_search_results: action.payload}
    case SET_MUSIC_SEARCH_PLAYMID:
      console.log('SET_MUSIC_SEARCH_PLAYMID', action.payload)
      return {...state, music_search_results_play_songmid: action.payload}

    case MUSIC_MOUNT: 
      console.log('MUSIC_MOUNT', action.payload)
      return {...state, music_info: action.payload}
    case MUSIC_UNMOUNT: 
      if (state.music_player) state.music_player.unload()
      return {...state, music_info: null, music_playing: false}

    // default case
    default: 
      return state
  }
}

export default reducer