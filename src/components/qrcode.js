import React from 'react'
import { QRCode } from "react-qr-svg";


export default function QRcode () {
  const [expired, setExpired] = React.useState(false)
  const [code, setCode] = React.useState('123')

  // React.useEffect(() => {
  //   setTimeout(() => {
  //     setExpired(true)
  //   }, 3000)
  // })

  const setRefresh = () => {
    const newCode = Math.floor(Math.random() * 1000)
    setCode(newCode)
    setExpired(false)
  }


  return (
    <div className="qrcode">
      {expired && <div className="qr-refresh" onClick={setRefresh}>
        <svg style={{width:"50px", height:"50px"}} viewBox="0 0 24 24">
            <path fill="currentColor" d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
        </svg>
      </div>}
      <QRCode
        bgColor="#FFFFFF"
        fgColor="#000000"
        level="M"
        style={{ width: 350 }}
        value={`https://no23reason.github.io/react-qr-svg/#/demo${code}`}
      />
    </div>
  )
}