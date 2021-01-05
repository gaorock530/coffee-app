// fix ipcRenderer causing bug
window.ipcRenderer = require('electron').ipcRenderer;