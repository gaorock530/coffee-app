const path = require("path");
const isDev = require("electron-is-dev");
const { BrowserWindow, ipcMain } = require('electron')

const WIDTH = 1200
const HEIGHT = 800

function createWindow() {

  let win
  // Create the browser window.
  // windows setup
  if (process.platform !== "darwin") {
    win = new BrowserWindow({
      width: WIDTH,
      height: HEIGHT,
      frame: false,
      // titleBarStyle: 'hidden',
      // titleBarStyle: 'customButtonsOnHover',
      titleBarStyle: 'hidden',
      minWidth: WIDTH,
      minHeight: HEIGHT,
      webPreferences: {
        nodeIntegration: false,
        preload: path.join(__dirname, '../electron/preload.js')
      }
    });
    // MAC OSX setup
  } else {
    win = new BrowserWindow({
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
        preload: path.join(__dirname, '../electron/preload.js')
      }
    });
  }

  win.on('close', () => {
    console.log('close event recived!')
    win.destroy()
  })
  

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }

  
  // handle window maximize event as double click user bar
  ipcMain.on('winMax', (e, arg) => {
    console.log('max event targered', arg, typeof arg, win.isMaximized())

    if (win.isMaximized()) {
      console.log('to unmaximize')
      win.unmaximize()
      e.reply('winMin', true)
    } else {
      console.log('to maximize')
      win.maximize()
      e.reply('winMax', true)
    }
    
  })

  // minify
  ipcMain.on('winHide', (e, arg) => {
    console.log('win hide event targered', arg, typeof arg, win.isMaximized())
    win.minimize()
  })


  // quit app
  ipcMain.on('winQuit', (e, arg) => {
    console.log('win quit event targered', arg, typeof arg, win.isMaximized())
    win.close()
    // win.destroy()
  })

}

module.exports = createWindow