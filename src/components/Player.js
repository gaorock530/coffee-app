import React from 'react'
import { DataContext } from '../contexts/mainContext'
import { SET_MUSIC_PLAYER, DEL_MUSIC_PLAYER, MUSIC_SET_PLAY, MUSIC_SET_STOP, MUSIC_UNMOUNT } from '../actions/music_action'
import {PlayArrow, Pause, SkipNext, SkipPrevious, VolumeDown, VolumeUp, GraphicEq, VolumeOff} from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { Slider } from '@material-ui/core';

import MusicPlayer from '../lib/player'


const contorlStyle = makeStyles({
  root: {
    position: 'relative',
    zIndex: 1
  }
})



export default function Player () {
  const controlClass = contorlStyle()
  const [volume, setVolume] = React.useState(50);
  const muteVolume = React.useRef(volume)
  const [{music_playing, music_info, music_player}, dispatch] = React.useContext(DataContext)
  const [currentTime, setCurrentTime] = React.useState(0)


  React.useEffect(() => {
    if (!music_info) return
    console.log(music_info)
    let musicPlayer

    try {
      musicPlayer = new MusicPlayer(music_info.url)
      dispatch({type: SET_MUSIC_PLAYER, payload: musicPlayer})
  
      musicPlayer.on('play', e => {
        console.log('playing')
        dispatch({type: MUSIC_SET_PLAY})
      })
  
      musicPlayer.on('pause', e => {
        console.log('pause')
        dispatch({type: MUSIC_SET_STOP})
      })
  
      musicPlayer.on('update', e => {
        // console.log(e.event, e.value)
        setCurrentTime(e.value)
      })

      musicPlayer.on('ended', e => {
        setCurrentTime(0)
        dispatch({type: MUSIC_SET_STOP})
      })

    } catch(e) {
      console.log(e)
      if (musicPlayer) musicPlayer.destory()
      setCurrentTime(0)
      dispatch({type: DEL_MUSIC_PLAYER})
    }

    return function clearup () {
      if (musicPlayer) musicPlayer.destory()
      setCurrentTime(0)
      dispatch({type: DEL_MUSIC_PLAYER})
    }

  },[dispatch, music_info])

  const handleVolumeChange = (e, newValue) => {
    setVolume(newValue);
    muteVolume.current = volume
  };

  const setMute = () => {
    if (volume > 0) setVolume(0)
    else setVolume(muteVolume.current< 10? 20: muteVolume.current)
  }

  const handleMusicPlay = () => {
    if (!music_player) return
    music_player.toggle()
    // dispatch({type: MUSIC_TOGGLE_PLAY})
  }

  const volumeIcon = (vol) => {
    switch (true) {
      case vol>50:
        return <VolumeUp/>
      case vol>=1:
        return <VolumeDown/>
      case vol === 0:
        return <VolumeOff />
      default:
        return <VolumeDown/>
    }
  }


  // const getPrograss = () => {
  //   console.log('getPrograss', currentTime)
  //   if (!music_player) return 0
  //   return currentTime / music_player.duration * 100
  // }

  // const cover = "https://y.gtimg.cn/music/photo_new/T002R300x300M000001K65vv1SgkSk.jpg?param=50y50"
                                                                  
  //`https://y.gtimg.cn/music/photo_new/T002R300x300M000${music_info.mid}.jpg`


  return (
    <div className="music-player-banner">
      <div className="music-info">
        <div className="music-info-cover-wrapper">
          <div className="music-info-cover" style={{ backgroundImage: `url(${music_info?
            `https://y.gtimg.cn/music/photo_new/T002R300x300M000${music_info.detail.track_info.album.mid}.jpg`:'/assets/logo.svg'})`}}></div>
          <div className="music-info-cover-effect"></div>
        </div>
        <div className="music-info-text">
          <h5>{music_info?music_info.name:''}</h5>
          <p>{music_info?music_info.singer:''}</p>
        </div>
      </div>
      <div className="music-control">
        <div className="music-control-button">
          <li><SkipPrevious/></li>
          <li className="music-control-button-play" onClick={handleMusicPlay}>{!music_playing?<PlayArrow className={controlClass.root} fontSize="large"/>:<Pause className={controlClass.root} fontSize="large"/>}</li>
          <li onClick={() => dispatch({type: MUSIC_UNMOUNT})}><SkipNext /></li>
        </div>
        <div className="music-prograss">
          <span>{MusicPlayer.timeFormat(currentTime)}</span>
          <div className="music-prograss-control">
            <div className="music-prograss-control-base"></div>
            <div className="music-prograss-control-bar" style={{ width: `${music_player?(currentTime / music_player.duration * 100):0}%`}}>
              <div className="music-prograss-control-point"></div>
            </div>
          </div>
          <span>{MusicPlayer.timeFormat(music_player?music_player.duration:0)}</span>
        </div>
      </div>
      <div className="music-utils">
        <div><GraphicEq style={{fontSize: '1.7rem'}}/></div>
        <div className="music-utils-volume">
          <div onClick={setMute}>{volumeIcon(volume)}</div>
          {/* <VolumeDown style={{fontSize: '2rem'}}/> */}
          <Slider
            value={volume}
            min={0}
            step={1}
            max={100}
            color="secondary"
            onChange={handleVolumeChange}
            valueLabelDisplay="off"
            aria-labelledby="non-linear-slider"
          />
        </div>
        
      </div>
    </div>
  )
}

