const { app, BrowserWindow } = require('electron');

app.whenReady().then(() => {
    const win = new BrowserWindow({ 
        width: 800, 
        height: 600,
        fullscreen: true,
        autoHideMenuBar: true
        });
    win.loadFile('./frames/index.html');
});
