import React from 'react'
import {CircularProgress, Backdrop} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles'
// import {Computer} from '@material-ui/icons';
import QRCode from '../components/qrcode'
import Form from '../components/loginForm'

const prograssStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    zIndex: '1',
    backgroundColor: "rgba(0,0,0,0.8)"
  }
})


export default function Login ({login}) {
  const [logging, setLogging] = React.useState(false)
  const prograssClass = prograssStyles()

  const onSubmit = v => {
    setLogging(true)
    setTimeout(() => {
      setLogging(false)
      login()
    }, 5000)
    console.log('submit', v)
  }
  
  return (
    <div className="login">
      <Backdrop open={!logging} className={prograssClass.root}>
        <div style={{fontSize: '1.5rem', color: '#fff', margin: '10px 0'}}>登陆中</div>
        <CircularProgress color="secondary"/>
      </Backdrop>
      <LoginForm onSubmit={onSubmit}/>
    </div>
  )
}

/**
 * @implements Login Form
 */

const formWrapperStyles = makeStyles({
  root: {
    position: 'relative',
    width: '500px',
    zIndex: '0'
  }
})

const formTabStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderBottom: '1px solid #eee'
  }
})

const tabStyles = makeStyles({
  root: {
    flex: '1'
  }
})


function LoginForm ({onSubmit}) {
  const formClass = formWrapperStyles()
  const formTabClass = formTabStyles()
  const tabClass = tabStyles()
  

  const [value, setValue] = React.useState(1);


  return (
    <Paper square className={formClass.root}>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        aria-label="Login"
        className={formTabClass.root}
      >
        <Tab label="手机登陆" className={tabClass.root}/>
        <Tab label="二维码登陆" className={tabClass.root}/>
      </Tabs>
      <div className="login-alter" onClick={() => setValue(Number(!value))}>
        {!value?<svg style={{width:"50px", height:"50px"}} viewBox="0 0 24 24">
            <path fill="currentColor" d="M3,11H5V13H3V11M11,5H13V9H11V5M9,11H13V15H11V13H9V11M15,11H17V13H19V11H21V13H19V15H21V19H19V21H17V19H13V21H11V17H15V15H17V13H15V11M19,19V15H17V19H19M15,3H21V9H15V3M17,5V7H19V5H17M3,3H9V9H3V3M5,5V7H7V5H5M3,15H9V21H3V15M5,17V19H7V17H5Z" />
        </svg>:<svg style={{width:"50px", height:"50px"}} viewBox="0 0 24 24">
            <path fill="currentColor" d="M6,2C4.89,2 4,2.89 4,4V12C4,13.11 4.89,14 6,14H18C19.11,14 20,13.11 20,12V4C20,2.89 19.11,2 18,2H6M6,4H18V12H6V4M4,15C2.89,15 2,15.89 2,17V20C2,21.11 2.89,22 4,22H20C21.11,22 22,21.11 22,20V17C22,15.89 21.11,15 20,15H4M8,17H20V20H8V17M9,17.75V19.25H13V17.75H9M15,17.75V19.25H19V17.75H15Z" />
        </svg>}
      </div>
      <div className="login-wrapper">
        {!value?<Form onSubmit={onSubmit}/>:<QRCode/>}
      </div>
    </Paper>
  );
}

/**
 * <svg style="width:24px;height:24px" viewBox="0 0 24 24">
    <path fill="currentColor" d="M6,2C4.89,2 4,2.89 4,4V12C4,13.11 4.89,14 6,14H18C19.11,14 20,13.11 20,12V4C20,2.89 19.11,2 18,2H6M6,4H18V12H6V4M4,15C2.89,15 2,15.89 2,17V20C2,21.11 2.89,22 4,22H20C21.11,22 22,21.11 22,20V17C22,15.89 21.11,15 20,15H4M8,17H20V20H8V17M9,17.75V19.25H13V17.75H9M15,17.75V19.25H19V17.75H15Z" />
</svg>
 * <svg style={{width:"50px", height:"5 0px"}} viewBox="-3 0 24 24">
            <path fill="currentColor" d="M4,6H20V16H4M20,18A2,2 0 0,0 22,16V6C22,4.89 21.1,4 20,4H4C2.89,4 2,4.89 2,6V16A2,2 0 0,0 4,18H0V20H24V18H20Z" />
        </svg>
 */