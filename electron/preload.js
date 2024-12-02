const { contextBridge, ipcRenderer, nativeTheme } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    send: (channel, ...args) => ipcRenderer.send(channel, ...args),
    on: (channel, listener) => ipcRenderer.on(channel, listener),
  },
  require: (module) => {
    if (['electron', 'fs', 'path'].includes(module)) {
      return require(module);
    }
    throw new Error(`Module ${module} is not allowed.`);
  },
  theme: {
    initialTheme: ipcRenderer.sendSync('get-initial-theme'),
    onThemeChange: (callback) => {
      ipcRenderer.on('theme-changed', (event, theme) => callback(theme));
    }
  }
});
