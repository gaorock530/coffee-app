import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import ControlledAccordions from '../components/sidebar'
import { Breadcrumbs, Typography } from '@material-ui/core'


const menu = [
  {
    title: '员工管理',
    icon: 'AccountCircle',
    id: 1,
    list: [
      {title: '员工配置', link: '/', active: false, id: 1},
      {title: '2', link: '/about', active: false, id: 2},
      {title: '3', link: '/dashboard', active: false, id: 3},
      {title: '4', link: '', active: false, id: 4}
    ]
  },
  {
    title: '会员管理',
    icon: 'Pets',
    id: 2,
    list: [
      {title: '会员统计', link: '', active: false, id: 5},
      {title: '加入会员', link: '', active: false, id:6},
      {title: '3', link: '', active: false, id: 7},
      {title: '4', link: '', active: false, id: 8}
    ]
  },
  {
    title: '商品管理',
    icon: 'Rowing',
    id: 3,
    list: [
      {title: '商品配置', link: '', active: false, id: 9},
      {title: '活动配置', link: '', active: false, id: 10},
      {title: '3', link: '', active: false, id: 11},
      {title: '4', link: '', active: false, id: 12}
    ]
  },
  {
    title: '娱乐系统',
    icon: 'ShutterSpeed',
    id: 4,
    list: [
      {title: '游戏统计', link: '', active: false, id: 13},
      {title: '2', link: '', active: false, id: 14},
      {title: '3', link: '', active: false, id: 15},
      {title: '4', link: '', active: false, id: 16}
    ]
  },
  {
    title: '收入分析',
    icon: 'SportsKabaddi',
    id: 5,
    list: [
      {title: '1', link: '', active: false, id: 17},
      {title: '2', link: '', active: false, id: 18},
      {title: '3', link: '', active: false, id: 19},
      {title: '4', link: '', active: false, id: 20}
    ]
  },
  {
    title: '分享管理',
    icon: 'NightsStay',
    id: 6,
    list: [
      {title: '1', link: '', active: false, id: 21},
      {title: '2', link: '', active: false, id: 22},
      {title: '3', link: '', active: false, id: 23},
      {title: '4', link: '', active: false, id: 24}
    ]
  }
]


export default function Body () {

  const [breadcrumb, setBreadCrumb] = React.useState([0, 0])
  const [active, setActive] = React.useState(1)
  const [expanded, setExpanded] = React.useState(1)

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
    console.log(breadcrumb)
    if (expanded === breadcrumb[0]+1) return
    setExpanded(breadcrumb[0]+1)
  }


  return (
    <Router>
      <main>
        <aside>
          <ControlledAccordions menu={menu} onClickMenu={onClickMenu} active={active} handleExpend={handleExpend} expanded={expanded}/>
        </aside>
        <section>
          <nav>
            <Breadcrumbs aria-label="breadcrumb">
              <div color="inherit" href="#" onClick={handleClick}>
                {menu[breadcrumb[0]].title}
              </div>

              <Typography color="textPrimary">{menu[breadcrumb[0]].list[breadcrumb[1]].title}</Typography>
            </Breadcrumbs>
          </nav>
          <Switch>
            <Route exact path="/">
              <div className="main-content">
                <div>homepage</div>
                <img src="/assets/logo.svg" className="App-logo" alt="logo"/>
                <img src="/assets/logo.svg" className="App-logo" alt="logo"/>
                <img src="/assets/logo.svg" className="App-logo" alt="logo"/>
                <img src="/assets/logo.svg" className="App-logo" alt="logo"/>
                <img src="/assets/logo.svg" className="App-logo" alt="logo"/>
                <img src="/assets/logo.svg" className="App-logo" alt="logo"/>
                <img src="/assets/logo.svg" className="App-logo" alt="logo"/>
              </div>
            </Route>
            <Route path="/about">
              <div>about</div>
            </Route>
            <Route path="/dashboard">
              <div>dashboard</div>
            </Route>
          </Switch>
          
        </section>
      </main>
    </Router>
  )
}