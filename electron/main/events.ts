import { ipcMain } from 'electron';

export function addEvents(window: Electron.CrossProcessExports.BrowserWindow) {
    ipcMain.on('close-window', (event) => {
        console.log("first")
        window.close();
    });
    ipcMain.on('maximize-window', (event) => {
        window.isMaximized() ? window.unmaximize() : window.maximize();
    });
    ipcMain.on('minimize-window', (event) => {
        window.minimize();
    });
}