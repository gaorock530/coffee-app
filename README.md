### Coffee App with React and Electron

#### Configration:

##### Referance: [Electron Apps Made Easy with Create React App and Electron Forge](https://dev.to/mandiwise/electron-apps-made-easy-with-create-react-app-and-electron-forge-560e)
##### [Create an app with Electron and React](https://flaviocopes.com/react-electron/#install-foreman-to-allow-executing-the-app-from-command-line)

1. ```npx create-react-app cra-electron-forge-demo --use-npm```
2. ```cd cra-electron-forge-demo```
3. ```npm i -D electron```
4. ```npm i electron-is-dev```
5. ```touch public/electron.js```
###### ___electron.js___
```
const path = require("path");

const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

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
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
```

6. ```package.json```

```
{
  "name": "cra-electron-forge-demo",
  "version": "0.1.0",
  "main": "public/electron.js", // NEW!
  // ...
}
```

7. ```npm i -D concurrently@5.2.0 wait-on@5.1.0```
8. ```package.json```
```
{
  // ...
  "scripts": {
    "dev": "concurrently -k \"BROWSER=none npm start\" \"npm:electron\"",
    "electron": "wait-on tcp:3000 && electron .",
    // ...
  }
  // ...
}
```

- Passing the BROWSER=none option before npm start will prevent a regular browser tab from launching once our React app starts up. If we run npm run dev now, then we'll be able to see our React app running with Electron instead of in a browser window.
- ___On Windows you might need to have a .env file with BROWSER=none in it as environemnt variables do not work like in Linux/macOS___

9. ```npx @electron-forge/cli import```
10. ```package.json```
```
{
  // ...
  "scripts": {
    // ...
    "start": "electron-forge start",
    // ...
  }
  // ...
}
```