import React from 'react'

export default function useLocalMusicState () {
  const [data, setData] = React.useState({
    DEFAULT_VOLUME: 50
  })


  React.useEffect(() => {
    const musicLocal = localStorage.getItem('MUSIC_INFO')
    if (musicLocal) setData(JSON.parse(musicLocal))
    
  }, [])

  return data
}
