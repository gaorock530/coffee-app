import React from 'react'
import { DataContext } from '../contexts/mainContext'
// import MusicData from '../hooks/useLocalMusicState'
import { SET_MUSIC_PLAYER, MUSIC_SET_PLAY, MUSIC_SET_STOP, MUSIC_UNMOUNT} from '../actions/music_action'
import {PlayArrow, Pause, SkipNext, SkipPrevious, VolumeDown, VolumeUp, GraphicEq, VolumeOff, PlaylistPlay, Repeat, RepeatOne} from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { Slider } from '@material-ui/core';

import MusicPlayer from '../lib/player'


const contorlStyle = makeStyles({
  root: {
    position: 'relative',
    zIndex: 1
  }
})

const DEFAULT_VOLUME = 70


export default function Player () {
  const controlClass = contorlStyle()

  const [{music_playing, music_info, music_player}, dispatch] = React.useContext(DataContext)
  const restoredVolume = music_player? music_player.volume:DEFAULT_VOLUME
  
  const [volume, setVolume] = React.useState(restoredVolume);
  const [currentTime, setCurrentTime] = React.useState(0)
  const [playmode, setPlaymode] = React.useState(0) 
  const [textWidth, setTextWidth] = React.useState(190)

  const muteVolume = React.useRef(volume)
  const musicPlayer = React.useRef(null)
  
  const controlBase = React.useRef(null)
  const infoContainer = React.useRef(null)

  const changeTextWidth = () => {
    const {width} = infoContainer.current.getBoundingClientRect()
    const availableTextWidth = width - 90
    setTextWidth(availableTextWidth)
  }

 

  // fix music info text too long, adjusting text container width accordingly
  React.useEffect(() => {
    
    changeTextWidth()
    window.addEventListener('resize', changeTextWidth)

    return function clearup () {
      window.removeEventListener('resize', changeTextWidth)
    }
  }, [])


  React.useEffect(() => {
    const keyPressControl = e => {
      if (e.keyCode === 32 && e.target.tagName !== 'INPUT') {
        e.preventDefault()
        music_player.toggle()
      }
    }
    window.addEventListener('keypress', keyPressControl)

    return function clearup () {
      window.removeEventListener('keypress', keyPressControl)
    }
  }, [music_player])



  React.useEffect(() => {

    if (!music_player) {
      musicPlayer.current = new MusicPlayer({defaultVolume: DEFAULT_VOLUME}) // always start at this Volume level
      dispatch({type: SET_MUSIC_PLAYER, payload: musicPlayer.current})

    } else {
      musicPlayer.current = music_player
    }

    try {
      musicPlayer.current.on('play', e => {
        console.log('playing')
        dispatch({type: MUSIC_SET_PLAY})
      })
  
      musicPlayer.current.on('pause', e => {
        console.log('pause')
        dispatch({type: MUSIC_SET_STOP})
      })
  
      musicPlayer.current.on('update', e => {
        // console.log(e.event, e.value)
        setCurrentTime(e.value)
      })

      musicPlayer.current.on('ended', e => {
        setCurrentTime(0)
        dispatch({type: MUSIC_SET_STOP})
      })

      musicPlayer.current.on('unload', e => {
        console.log(e.event)
        setCurrentTime(0)
        dispatch({type: MUSIC_SET_STOP})
      })


    } catch(e) {
      console.log(e)
      setCurrentTime(0)
    }

    return function clearup () {
      if (musicPlayer.current) {
        musicPlayer.current.clear()
      } 
    }

  },[dispatch, music_player])

  const handleVolumeChange = (e, newValue) => {
    setVolume(newValue);
    muteVolume.current = newValue
    musicPlayer.current.volume = newValue
  };

  const setMute = () => {
    let newVolume 
    if (volume > 0) newVolume = 0
    else newVolume = (muteVolume.current< 10? 20: muteVolume.current)
    setVolume(newVolume)
    musicPlayer.current.volume = newVolume
  }

  const handleMusicPlay = () => {
    if (!music_player) return
    music_player.toggle()
  }

  

  const onSeek = e => {
    const base = controlBase.current.getBoundingClientRect()
    // mouse click X poistion - base X position
    const offsetX = e.pageX - base.x
    const percent = offsetX / base.width
    musicPlayer.current.seek(percent)
  }

  const handlePlayMode = () => {
    console.log('change mode')

    let order = playmode + 1
    if (order > 2) order = 0
    setPlaymode(order)

    if (musicPlayer.current) musicPlayer.current.loop = order === 1
  }




  // const cover = "https://y.gtimg.cn/music/photo_new/T002R300x300M000001K65vv1SgkSk.jpg?param=50y50"
                                                                  
  //`https://y.gtimg.cn/music/photo_new/T002R300x300M000${music_info.mid}.jpg`


  return (
    <div className="music-player-banner">
      <div className="music-info" ref={infoContainer}>
        <div className="music-info-cover-wrapper">
          <div className="music-info-cover" style={{ backgroundImage: `url(${music_info?
            `https://y.gtimg.cn/music/photo_new/T002R300x300M000${music_info.detail.track_info.album.mid}.jpg`:'/assets/logo.svg'})`}}></div>
          <div className="music-info-cover-effect"></div>
        </div>
        <div className="music-info-text">
          <h5>{music_info?music_info.name:''}</h5>
          <p style={{ width: `${textWidth}px`}}>{music_info?music_info.singer:''}</p>
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
          <div className="music-prograss-control" onClick={onSeek} ref={controlBase}>
            <div className="music-prograss-control-base"></div>
            <div className="music-prograss-control-bar" style={{ width: `${(music_player && music_player.duration)?(currentTime / music_player.duration * 100):0}%`}}>
              <div className="music-prograss-control-point"></div>
            </div>
          </div>
          <span>{MusicPlayer.timeFormat(music_player?music_player.duration:0)}</span>
        </div>
      </div>
      <div className="music-utils">
        <div onClick={handlePlayMode}><Mode order={playmode}/></div>
        <div><GraphicEq /></div>
        <div className="music-utils-volume">
          <div onClick={setMute}><VolumeIcon vol={volume}/></div>
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

function VolumeIcon ({vol}) {
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

function Mode ({order}) {
  switch (order) {
    case 0:
      return <Repeat/>
    case 1:
      return <RepeatOne />
    case 2:
      return <PlaylistPlay />
    default:
      return <Repeat />
  }
}

