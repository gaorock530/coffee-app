const path = require("path");
const { BrowserWindow, ipcMain } = require('electron')



module.exports = function openWin () {
  const WIDTH = 1200
  const HEIGHT = 800

  this.window = null        // store new window
  this.cookieTimer = null   // store timer debuncer
  this.cookieIns = null     // store cookies

  ipcMain.on('openWin', (e, arg) => {
    if (this.window) return
    console.log('openWin event targered', arg, typeof arg)
    this.window = new BrowserWindow({
      width: WIDTH,
      height: HEIGHT,
      frame: false,
      titleBarStyle: 'hidden',
      minWidth: WIDTH,
      minHeight: HEIGHT,
      webPreferences: {
        nodeIntegration: false,
        preload: path.join(__dirname, './preload.js')
      }
    });
  
    this.window.loadURL(arg)

    this.getCookie = async () => {
      const cookies = await this.cookieIns.get({ domain: 'qq.com', session: false })
      const tarCookie = cookies.find(v => v.name === "uin")
      if (tarCookie) {
        console.log('-------------------------- target cookie:', tarCookie, '--------------------------')
        console.log(cookies)
      }
    }

    this.window.once('close', e => {
      console.log('new window closed')
      clearTimeout(this.cookieTimer)
      this.window = null
      this.cookieTimer = null
      this.cookieIns = null
    })

    if (arg.match(/qq\.com/)) {
      console.log('qq.com')
      this.cookieIns = this.window.webContents.session.cookies
      this.cookieIns.on('changed', (e, cause, cookie, remove) => {
        clearTimeout(this.cookieTimer)
        console.log('--------------------------cookie changed--------------------------')
        console.log({e, cause, cookie, remove})
        this.cookieTimer = setTimeout(this.getCookie, 1000)
      })
    }
  })
}

