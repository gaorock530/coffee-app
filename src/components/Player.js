import React from 'react'
import { DataContext } from '../contexts/mainContext'
import { MUSIC_TOGGLE_PLAY, MUSIC_MOUNT, MUSIC_UNMOUNT } from '../actions/music_action'
import {PlayArrow, Pause, SkipNext, SkipPrevious, VolumeDown, VolumeUp, GraphicEq, VolumeOff} from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { Slider } from '@material-ui/core';


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
  const [{music_playing, music_info}, dispatch] = React.useContext(DataContext)

  const handleVolumeChange = (e, newValue) => {
    setVolume(newValue);
    muteVolume.current = volume
  };

  const setMute = () => {
    if (volume > 0) setVolume(0)
    else setVolume(muteVolume.current< 10? 20: muteVolume.current)
  }

  const handleMusicPlay = () => {
    dispatch({type: MUSIC_TOGGLE_PLAY})
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


  return (
    <div className="music-player-banner">
      <div className="music-info">
        <div className="music-info-cover-wrapper">
          <div className="music-info-cover" style={{ backgroundImage: `url(${'/assets/logo.svg'})`}}></div>
          <div className="music-info-cover-effect"></div>
        </div>
        <div className="music-info-text">
          <p>title</p>
          <p>description</p>
        </div>
      </div>
      <div className="music-control">
        <div className="music-control-button">
          <li onClick={() => dispatch({type: MUSIC_MOUNT})}><SkipPrevious/></li>
          <li className="music-control-button-play" onClick={handleMusicPlay}>{!music_playing?<PlayArrow className={controlClass.root} fontSize="large"/>:<Pause className={controlClass.root} fontSize="large"/>}</li>
          <li onClick={() => dispatch({type: MUSIC_UNMOUNT})}><SkipNext /></li>
        </div>
        <div className="music-prograss">
          <span>00:00</span>
          <div className="music-prograss-control">
            <div className="music-prograss-control-base"></div>
            <div className="music-prograss-control-bar">
                <div className="music-prograss-control-point"></div>
              </div>
          </div>
          <span>04:00</span>
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