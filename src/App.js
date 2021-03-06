import React, { useContext } from 'react'
import { DataContext } from './contexts/mainContext'

import isElectron from './components/isElectron'
import {isMac} from './components/isWindows'
import Control from './components/control'

import Login from './pages/login'
import Body from './pages/body'




function App() {
  const [{authorized}] = useContext(DataContext)

  const winMax = React.useRef(false)
  
  

  React.useEffect(() => {
    console.log('initial App', {isMac})
    if (!isElectron()) return
    window.ipcRenderer.on('winMax', (event, arg) => {
      console.log('ipcRenderer recevied \'max\':', arg)
      winMax.current = true
    })
    window.ipcRenderer.on('winMin', (event, arg) => {
      console.log('ipcRenderer recevied \'min\':', arg)
      winMax.current = false
    }) 
  }, [])

  const handleMaxWindow = () => {
    if (isElectron()) {
      console.log('sending \'max\' event:', winMax.current)
      window.ipcRenderer.send('winMax', winMax.current)
    }
  }

  const handleMinWindow = () => {
    if (isElectron()) {
      console.log('sending \'mini\' event:')
      window.ipcRenderer.send('winHide', true)
    }
  }

  const handleQuitApp = () => {
    if (isElectron()) {
      console.log('sending \'quit\' event:')
      window.ipcRenderer.send('winQuit', true)
    }
  }


  return (
    
    <div className="App">
      <header>
        <div className="header-drag" onDoubleClick={handleMaxWindow}></div>
        <div className="info">
          Coffee Relax
        </div>
        {!isMac && isElectron() && <Control max={handleMaxWindow} mini={handleMinWindow} quit={handleQuitApp}/>}
      </header>
      {authorized?<Body/>:<Login/>}
    </div>
    
  );
}

export default App;
