import React from 'react'
import { DataContext } from '../contexts/mainContext'
// import { MUSIC_TOGGLE_PLAY } from '../actions/music_action'


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"

// components
import ControlledAccordions from '../components/sidebar'
import { Breadcrumbs, Typography } from '@material-ui/core'

// data
import menu from '../data/sidebarList'

// routers
import Music from '../router/music'


export default function Body () {
  const [{music_playing, music_info}] = React.useContext(DataContext)


  const [breadcrumb, setBreadCrumb] = React.useState([0, 0])    // stores index
  const [active, setActive] = React.useState(1)                 // stores ID
  const [expanded, setExpanded] = React.useState(1)             // stores ID

  const onClickMenu = (level, id) => {
    if (id === active) return
    setBreadCrumb(level)
    setActive(id)
  }

  const handleExpend = (id) => {
    if (id === expanded) return
    setExpanded(id)
  }

  const handleClick = () => {
    // console.log(breadcrumb)
    const storedID = menu[breadcrumb[0]].id
    if (expanded === storedID) return
    setExpanded(storedID)
  }

  // experiment
  const openQQ = () => {
    console.log('openQQ')
    window.ipcRenderer.send('openWin', 'http://y.qq.com')
  }

  // manually handle clicking music spinning icon
  const handleClickIcon = () => {
    if (active !== 30) onClickMenu([4, 0], 30)
    const storedID = menu[4].id
    if (expanded === storedID) return
    setExpanded(storedID)
  }


  return (
    <Router>
      <main>
        <aside>
          <ControlledAccordions menu={menu} onClickMenu={onClickMenu} active={active} handleExpend={handleExpend} expanded={expanded}/>
        </aside>
        <section>
          <nav className="navigation">
            <Breadcrumbs aria-label="breadcrumb">
              <div color="inherit" href="#" onClick={handleClick}>
                {menu[breadcrumb[0]].title}
              </div>
              <Typography color="textPrimary">{menu[breadcrumb[0]].list[breadcrumb[1]].title}</Typography>
            </Breadcrumbs>
            <div className="music-top-banner">
              <div className="music-top-info">{music_info?`${music_info.name} - ${music_info.singer}`:''}</div>
              <Link to="/music/order" className={`${music_playing?'play':''} ${music_info?'mounted':''} music-icon`} onClick={handleClickIcon}/>
            </div>
          </nav>
          <div className="main-content">
            <Switch>
              <Route exact path="/">
                <>
                  <div onClick={openQQ}>homepage</div>
                  <img src="/assets/logo.svg" className="App-logo" alt="logo"/>
                  <img src="/assets/logo.svg" className="App-logo" alt="logo"/>
                  <img src="/assets/logo.svg" className="App-logo" alt="logo"/>
                  <img src="/assets/logo.svg" className="App-logo" alt="logo"/>
                  <img src="/assets/logo.svg" className="App-logo" alt="logo"/>
                  <img src="/assets/logo.svg" className="App-logo" alt="logo"/>
                  <img src="/assets/logo.svg" className="App-logo" alt="logo"/>

                </>
              </Route>
              <Route path="/about">
                <div>about</div>
              </Route>
              <Route path="/dashboard">
                <div>dashboard</div>
              </Route>

              <Route path="/music/:route"><Music /></Route>
            </Switch>
          </div>
        </section>
      </main>
    </Router>
  )
}