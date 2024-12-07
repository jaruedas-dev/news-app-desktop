const { app, BrowserWindow, ipcMain, Menu, Notification, dialog, nativeTheme } = require("electron");
const isMac = process.platform === "darwin";
const path = require('path');
const os = require('os');
const fs = require('fs');
"use strict";

async function createMainWindow(){
  const Store = (await import('electron-store')).default;
  const store = new Store({});

  let appWin = new BrowserWindow({
    width: 1024,
    height: 600,
    title: "NewsApp",
    resizable: true,
    show: false,
    autoHideMenuBar: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    }
  });

  appWin.loadURL(`file://${__dirname}/../dist/newspaper-app/browser/index.html`);

  appWin.on("closed", () => {
    appWin = null;
  });
  //appWin.webContents.openDevTools();
  appWin.show();

  ipcMain.handle('store-get', (event, key) => {
    return store.get(key);
  });

  ipcMain.handle('store-delete', (event) => {
    store.clear();
  });

  ipcMain.handle('store-set', (event, key, value) => {
    store.set(key, value);
  });

  ipcMain.handle('show-confirm-dialog', async (event, options) => {
    let cancelButton = (options.cancel) ? options.cancel : 'Cancel';
    let actionButton = (options.action) ? options.action : 'Yes';
    const result = await dialog.showMessageBox(appWin, {
      type: 'question',
      buttons: [ cancelButton, actionButton],
      defaultId: 1,
      cancelId: 0,
      title: options.title,
      message: options.message,
    });
    return result.response === 1; // Return true if 'Yes' was clicked
  });

  // Set initial theme
  const initialTheme = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
  appWin.webContents.on('did-finish-load', () => {
    appWin.webContents.send('theme-changed', initialTheme);
  });

  // Listen for theme changes
  nativeTheme.on('updated', () => {
    appWin.webContents.send('theme-changed', nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
  });


}
async function createSplashScreen (){
  let splash = new BrowserWindow({
    width: 600,
    height: 400,
    transparent: true,
    frame: false,
    center: true,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true
    }
  });
  splash.on("closed", () => {
    splash = null;
  })
  splash.center();
  splash.loadURL(`file://${__dirname}/splash/index.html`);
  splash.show()
  setTimeout(function () {
    splash.hide();
    createMainWindow();
  }, 6000);
}

async function createAbout(){
  let about = new BrowserWindow({
    width: 350,
    height: 250,
    title: "About",
    frame: true,
    resizable: false,
    fullscreenable: false,
    autoHideMenuBar: true
  });
  about.on("closed", () => {
    about = null;
  })

  about.loadURL(`file://${__dirname}/splash/about.html`);
  about.show();
}

ipcMain.handle('show-notification', (event, body) => {
  const notification = new Notification({
    title: body.title || 'Title missing',
    body: body.message || 'Body missing',
    silent: true,
  })
  notification.on('click', () => {
    event.sender.send('notification-clicked')
  })

  notification.show()
});

ipcMain.on('get-initial-theme', (event) => {
  event.returnValue = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
  console.log(nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
});


ipcMain.handle( 'export-article', (event, article) => {
  //const {image_data, ...articleWithoutImage } = article
  try {
    const exportPath = path.join(os.homedir(), 'Desktop',
      `article_${Date.now()}.json`);
    const articleData = JSON.stringify(article, null, 2)
    fs.writeFileSync(exportPath, articleData, 'utf8')
    dialog.showMessageBox({
      type: 'info',
      title: 'Article exported',
      message: 'Article exported to:' + exportPath, buttons: ['OK']
    });
    return {success: true, path: exportPath};
  }catch(error){
    return {success: false, path: error.message};
  }
});

ipcMain.handle( 'import-article', async (event, body) => {
  const result = await dialog.showOpenDialog({
  properties: ['openFile'],
  filters: [{ name: 'JSON Files', extensions: ['json'] }],
  })
  if (result.canceled || result.filePaths.length === 0) {
    return { success: false, error: 'No file selected' }
  }
  const filePath = result.filePaths [0]
  const fileContent = fs. readFileSync(filePath, 'utf8')
  const article = JSON. parse (fileContent)

  return {success: true, article}
});


app.whenReady().then( () => {
  createSplashScreen();

  const menu = [
    ...(isMac ? [
      {
        label: app.name,
        submenu: [
          {
            label: 'About',
            click: createAbout
          }
        ]
      }
    ] : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'Quit',
          click: () => app.quit(),
          accelerator: 'CmdOrCtrl+Q',
        }
      ]
    },
    ...(!isMac ? [
      {
        label: 'Help',
        submenu: [
          {
            label: 'About',
            click: createAbout
          }
        ]
      }
    ] : [])
  ];

  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu);


  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

})


