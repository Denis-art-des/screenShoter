const { contextBridge, ipcRenderer } = require('electron')

// В этом файле мы инициализируем связь "renderer.js" и "main.js".
// теперь в "renderer.js"
contextBridge.exposeInMainWorld('electronAPI', {
    sendScreenshot:(/*тут*/) => ipcRenderer.send('sendScreenshot' , /*тут*/)
})