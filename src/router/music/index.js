import React from 'react'
import {
  useParams
} from "react-router-dom";

import Player from '../../components/Player'

import Order from './Music_order'
import Setup from './Music_setup'
import Authorize from './Music_authorize'
import Local from './Music_local'
import Recommend from './Music_recommend'
import Playlists from './Music_playlists'



export default function Music () {

  return (
    <div className="music-section">
      <Forks/>
      <Player />
    </div>
  )

}

function Forks () {
  const { route } = useParams()
  
  switch (route) {
    case 'order':
      return <Order/>
    case 'setup':
      return <Setup />
    case 'authorize':
      return <Authorize/>
    case 'local':
      return <Local/>
    case 'recommend':
      return <Recommend/>
    case 'playlists':
      return <Playlists/>
    default: 
      return <Recommend/>
  }
}
