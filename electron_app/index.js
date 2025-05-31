//: importing dependencies
const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

if (require('electron-squirrel-startup')){ app.quit(); };
//^ prevents multiple instances of the offline application from starting up.

app.whenReady().then(() => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    //^ to set app window's dimensions near size of user's screen (excluding the taskbar) when not maximised
    const win = new BrowserWindow({
        width,
        height,
        icon: path.join(__dirname, 'assets', 'favicon.ico'),
        fullscreen: false,
        //^ very inconvenient for user if fullscreen and want to exit application
        autoHideMenuBar: true,
        //^ the program does not use the menu bar hence it being hidden
        frame: true
        });
    const menuPath = path.join(__dirname, 'frames', 'menu.html');
    //^ first loaded page (can skip index.html as how user types the URL is not a conern for the offline port)
    win.loadFile(menuPath);
    win.webContents.on('did-finish-load', () => { win.webContents.setZoomFactor(0.8); });
    //^ specified here because the CSS ".zoom-out { transform: scale(0.8); }" works on local and GitHub webhosting but not on the electron Chromium-based app
    win.maximize();
    //^ maximise for full utilization of window space
    ///win.webContents.openDevTools({ mode: 'right' });
    //^ for debugging purposes only
});