import React from 'react'
import {Close, IndeterminateCheckBoxOutlined, Fullscreen} from '@material-ui/icons'

export default function Control ({max, mini, quit}) {
  return (
    <div className="win-control">
      <li><Fullscreen onClick={max}/></li>
      <li><IndeterminateCheckBoxOutlined fontSize="small" onClick={mini}/></li>
      <li><Close onClick={quit}/></li>
    </div>
  )
}