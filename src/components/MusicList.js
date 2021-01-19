import React from 'react'
import { DataContext } from '../contexts/mainContext'
import { MUSIC_MOUNT, SET_MUSIC_SEARCH_PLAYMID } from '../actions/music_action'
import {Favorite, FavoriteBorder, PlaylistAdd, Forward, PlayCircleFilled} from '@material-ui/icons'
import MusicPlayer from '../lib/player'

export default function MusicList ({results = [1, 2, 3, 4]}) {

  return (
    <ul className="playlist-container">
      {results.map(song => <Item key={song.songid} {...song}/>)}
    </ul>
  )
}

function Item ({like, songname = 'name', artists = 'artists', albumname = 'album', duration = '00:00', songmid, vip}) {
  const [{music_player, music_search_results_play_songmid}, dispatch] = React.useContext(DataContext)

  const onPlayClick = async () => {
    
    const url = `http://localhost:3300/song/urls?id=${songmid}` // 003cI52o4daJJL

    try {
      // const getCookie = await fetch('http://localhost:3300/user/cookie')
      // const cookieJson = await getCookie.json()
      // console.log(cookieJson)

      // fetch song detail info for getting album cover image
      const getSongInfo = await fetch(`http://localhost:3300/song?songmid=${songmid}`)
      const songJson = await getSongInfo.json()
      // console.log(songJson)

      // fetch for song play url, data: {'mid': url}
      const response = await fetch(url)
      const result = await response.json()
      // console.log(result)

      if (result.result !== 100) return console.warn('can not get song url.')
      dispatch({type: MUSIC_MOUNT, payload: {
        name: songname, 
        singer: artists.reduce((a, c, i) => a + c.name + (i === artists.length - 1?'':' / '), ''),
        url: result.data[songmid], 
        detail: songJson.data
      }})

      music_player.load(result.data[songmid])
      dispatch({type: SET_MUSIC_SEARCH_PLAYMID, payload: songmid})
    } catch (e) {
      console.log('Can not get song URL!', e)
      dispatch({type: SET_MUSIC_SEARCH_PLAYMID, payload: null})
    }
  }



  const parseArtists = (tag) => tag.map((artist, index) => <b key={artist.mid}>{artist.name}{index === tag.length - 1?'':' / '}</b>)

  return (
    <li className={`${music_search_results_play_songmid === songmid?'active ':''}playlist-item${vip?'':' vip'}`}>
      <span className="playlist-item-name">
        {like?<Favorite titleAccess="喜欢"/>:<FavoriteBorder titleAccess="喜欢"/>}
        <b title={songname}>{songname}</b>
        <p><PlayCircleFilled onClick={onPlayClick} titleAccess="播放"/><PlaylistAdd titleAccess="播放列表"/><Forward titleAccess="加入列队"/></p>
      </span>
      <span className="playlist-item-artist" title={artists.reduce((a, c, i) => a + c.name + (i === artists.length - 1?'':' / '), '')}>{parseArtists(artists)}</span>
      <span className="playlist-item-album" title={albumname}>{albumname}</span>
      <span className="playlist-item-time">{MusicPlayer.timeFormat(duration)}</span>
    </li>
  )
}

