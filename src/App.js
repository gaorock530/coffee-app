import React from 'react'
import isElectron from './components/isElectron'
import {isMac} from './components/isWindows'

import Login from './pages/login'
import Body from './pages/body'


function App() {
  const winMax = React.useRef(false)
  const [login, setLogin] = React.useState(false)
  
  console.log(isMac)

  React.useEffect(() => {
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

  const onLogin = () => {
    setLogin(true)
  }


  return (
    <div className="App">
      <header onDoubleClick={handleMaxWindow}>
        <div className="info">
          Coffee Relax
        </div>
      </header>
      {login?<Body/>:<Login onLogin={onLogin}/>}
    </div>
  );
}

export default App;
