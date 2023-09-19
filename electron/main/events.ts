import channels from '../channels';
import { ipcMain } from 'electron';
import net from 'net';
import { read_settings, write_settings } from './file';

export function addEvents(window: Electron.CrossProcessExports.BrowserWindow) {
    ipcMain.on(channels.window.close, (event) => {
        window.close();
    });
    ipcMain.on(channels.window.maximize, (event) => {
        window.isMaximized() ? window.unmaximize() : window.maximize();
    });
    ipcMain.on(channels.window.minimize, (event) => {
        window.minimize();
    });

    ipcMain.once(channels.settings.get, (event) => {
        const settings = read_settings();
        event.reply(channels.settings.get_response, settings)
    });

    ipcMain.on(channels.settings.update, (_event: any, data: any) => {
        write_settings(data);
    });
}