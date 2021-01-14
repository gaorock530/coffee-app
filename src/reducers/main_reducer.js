import {
  LOGIN, 
  LOGOUT,
  SET_USER,
} from '../actions/main_action'

import {
  MUSIC_SET_PLAY,
  MUSIC_SET_STOP,
  MUSIC_TOGGLE_PLAY,
  MUSIC_MOUNT,
  MUSIC_UNMOUNT
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

    // music state
    case MUSIC_SET_PLAY:
      if (!state.music_info) return state;
      return {...state, music_playing: true}
    case MUSIC_SET_STOP:
      return {...state, music_playing: false}
    case MUSIC_TOGGLE_PLAY:
      if (!state.music_info) return state;
      return {...state, music_playing: !state.music_playing}

    case MUSIC_MOUNT: 
      return {...state, music_info: 'Magic'}
    case MUSIC_UNMOUNT: 
      return {...state, music_info: null, music_playing: false}

    // default case
    default: 
      return state
  }
}

export default reducer