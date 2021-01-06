import React from 'react'
import {Close, IndeterminateCheckBoxOutlined, OpenInNewOutlined} from '@material-ui/icons'

export default function Control ({max}) {
  return (
    <div className="win-control">
      <li><OpenInNewOutlined fontSize="small" onClick={max}/></li>
      <li><IndeterminateCheckBoxOutlined fontSize="small"/></li>
      <li><Close fontSize="small"/></li>
    </div>
  )
}