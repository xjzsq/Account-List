
// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const electron = require('electron')

// 引入node的 path 和url模块
const path = require('path')
const url = require('url')
// 获取在 package.json 中的命令脚本传入的参数，来判断是开发还是生产环境
const mode = process.argv[2]
const Menu = electron.Menu
const { ipcMain } = require('electron')

function createWindow() {
    // 隐藏菜单栏
    Menu.setApplicationMenu(null)
    // 创建窗口
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    // 窗口最小化、最大化、关闭
    ipcMain.on('minScreen', e => mainWindow.minimize());
    ipcMain.on('maxScreen', e => {
        if (mainWindow.isMaximized() || mainWindow.isFullScreen()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    });
    ipcMain.on('closeScreen', e => mainWindow.close());
    // 判断是否是开发模式 
    if (mode === 'dev') {
        mainWindow.loadURL("http://localhost:3000/")
    } else {
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, './build/index.html'),
            protocol: 'file:',
            slashes: true
        }))
    }


    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.