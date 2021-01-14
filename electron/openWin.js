const path = require("path");
const { BrowserWindow, ipcMain } = require('electron')


/**
 * @description Login with QQ webpage, get Cookie
 */

module.exports = function openWin () {
  const WIDTH = 1200
  const HEIGHT = 800
  const waitTime = 1500

  this.window = null        // store new window
  this.cookieTimer = null   // store timer debuncer
  this.cookieIns = null     // store cookies

  this.temp = null          // stroe temp cookies



  ipcMain.on('openWin', (e, arg) => {
    if (this.window) return
    console.log('openWin event targered', arg, typeof arg)
    if (process.platform !== "darwin") {
      this.window = new BrowserWindow({
        width: WIDTH,
        height: HEIGHT,
        frame: false,
        // titleBarStyle: 'hidden',
        // titleBarStyle: 'customButtonsOnHover',
        minWidth: WIDTH,
        minHeight: HEIGHT,
        webPreferences: {
          nodeIntegration: false,
          preload: path.join(__dirname, './preload.js')
        }
      });
      // MAC OSX setup
    } else {
      this.window = new BrowserWindow({
        width: WIDTH,
        height: HEIGHT,
        // frame: false,
        // titleBarStyle: 'hidden',
        // titleBarStyle: 'customButtonsOnHover',
        titleBarStyle: 'hiddenInset',
        minWidth: WIDTH,
        minHeight: HEIGHT,
        webPreferences: {
          // contextIsolation: true,
          nodeIntegration: false,
          preload: path.join(__dirname, './preload.js')
        }
      });
    }
  
    this.window.loadURL(arg)

    this.window.once('close', e => {
      console.log('new window closed')
      clearTimeout(this.cookieTimer)
      this.window = null
      this.cookieTimer = null
      this.cookieIns = null
      this.temp = null
    })

    
    // if open URL is y.qq.com, get
  
    if (arg.match(/qq\.com/)) {
      console.log('qq.com')
      this.cookieIns = this.window.webContents.session.cookies
      this.cookieIns.on('changed', (e, cause, cookie, remove) => {
        clearTimeout(this.cookieTimer)
        // console.log('--------------------------cookie changed--------------------------')
        // console.log({e, cause, cookie, remove})
        this.cookieTimer = setTimeout(this.getCookie, waitTime)
      })
    }

    this.getCookie = async () => {
      const cookies = await this.cookieIns.get({ domain: 'qq.com', session: false })
      const tarCookie = cookies.find(v => v.name === "psrf_qqopenid")
      if (tarCookie) {
        console.log('-------------------------- target cookie:', tarCookie, '--------------------------')
        // console.log(cookies)
        const cookieString = cookies.reduce((a, c) => `${a}${c.name}=${c.value};`, '')
        console.log(cookieString)
        console.log('LOGIN IN with QQ ! Success!')
        this.window.close()
      } else {
        const weixinCookie = await this.cookieIns.get({ domain: 'qq.com', session: true })
        const tarWeixinCookie = weixinCookie.find(v => (v.name === "wxopenid" || v.name === "wxrefresh_token"))
        if (tarWeixinCookie) {
          const allCookie = weixinCookie.map(v => v.name)
          if (this.temp) {
            const difference = allCookie.filter(v => !this.temp.includes(v))
            console.log('---------------------- Weixin Cookie Difference ----------------------')
            console.log(difference)
            const cookieString = weixinCookie.reduce((a, c) => `${a}${c.name}=${c.value};`, '')
            console.log(cookieString)
            console.log('LOGIN IN with WEIXIN ! Success!')
            this.window.close()
          }

        } else {
          this.temp = weixinCookie.map(v => v.name)
          console.log(this.temp)
        }
        
      }
    }
  })
}

