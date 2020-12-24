import React from 'react'
import isElectron from './components/isElectron'

function App() {
  const winMax = React.useRef(false)


  React.useEffect(() => {
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

  return (
    <div className="App">
      <header onDoubleClick={handleMaxWindow}>
        <div className="info">
          Coffee Relax
        </div>
      </header>
      <main>
          <img src="/assets/logo.svg" className="App-logo" alt="logo"/>
      </main>
    </div>
  );
}

export default App;
