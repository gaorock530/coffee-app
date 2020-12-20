![](https://res.cloudinary.com/practicaldev/image/fetch/s--1TYSGdRE--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/i/xso6o2pjmvzb0gjpnir1.png)
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
10. change ```package.json```
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
back to:
```
{
  // ...
  "scripts": {
    // ...
    "start": "react-scripts start",
    // ...
  }
  // ...
}
```
also add:
```
{
  // ...
  "scripts": {
    // ...
    "package": "react-scripts build && electron-forge package",
    "make": "react-scripts build && electron-forge make"
  }
  // ...
}
```
and modify:
```
{
  // ...
  "scripts": {
    // ...
    "electron": "wait-on tcp:3000 && electron-forge start",
    // ...
  }
  // ...
}
```

11. ```public/electron.js```
```
const path = require("path");

const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require("electron-squirrel-startup")) {
  app.quit();
} // NEW!

// ...
```

### Add Support for React Developer Tools

1. ```npm i -D electron-devtools-installer```
2. ```public/electron.js```
```
const path = require("path");

const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");

// Conditionally include the dev tools installer to load React Dev Tools
let installExtension, REACT_DEVELOPER_TOOLS; // NEW!

if (isDev) {
  const devTools = require("electron-devtools-installer");
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
} // NEW!

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require("electron-squirrel-startup")) {
  app.quit();
} // NEW!

// ...
```
Lastly, we'll need to call the installExtension function when the app is ready, so we must update the existing app.whenReady().then(createWindow); lines as follows:
```
// ...

app.whenReady().then(() => {
  createWindow();

  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(error => console.log(`An error occurred: , ${error}`));
  }
}); // UPDATED!

// ...
```

### Building for Distribution
    
1. ```package.json```
```
{
  "name": "cra-electron-forge-demo",
  "version": "0.1.0",
  "main": "public/electron.js",
  "homepage": "./",
  // ...
}
```
#### As a nice touch, we can also create a custom app icon to appear in the user's dock using the electron-icon-maker package. To do this, we'll need to supply it an absolute path to a PNG file that's at least 1024px by 1024px. We'll run this script from the root directory of our project to generate the icon files:
```npx electron-icon-maker --input=/absolute/path/to/cra-electron-forge-demo/src/app-icon.png --output=src```

#### Next, we can add the correct icon file and customize the name our app (as it will appear in the top menu or when hovering over the dock icon) under the ```config``` key in our ```package.json``` file:

```
{
  // ...
  "config": {
    "forge": {
      "packagerConfig": {
        "icon": "src/icons/mac/icon.icns",
        "name": "React + Electron App"
      },
      // ...
    }
  }
}
```

2. Note that if you wish to change the name that appears at the top of the window, you'll need to update that in the title element in the public/index.html file before building the app:
![](https://res.cloudinary.com/practicaldev/image/fetch/s--1jPhWa5i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/rvuo9wb7kflp04fwx9lf.png)
Now we can run a single command to package up our app for distribution:
```npm run make```

3. Finally, if you plan on version controlling this project with Git, then be sure to add the out directory to the .gitignore file before making your next commit:
```
# ...

# production
/build
/out # NEW!

# ...
```