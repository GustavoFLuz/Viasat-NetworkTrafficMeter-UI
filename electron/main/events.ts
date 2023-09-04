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

    let auxiliaryString = '';
    new Promise<net.Socket>((resolve, reject) => {
        const connection = net.connect(50000, '127.0.0.1', () => {
            console.log('Client: Successfully connected to data streaming\n');
            resolve(connection);
        });

        connection.on('error', err => reject(err));

        connection.on('end', () => {
            console.log('Client: Disconnected from data streaming\n');
        });
    })
        .then((connection) => {
            connection.on('data', (data) => {
                const stringData = data.toString();
                if (stringData.length === 65536)
                    auxiliaryString += stringData;
                else {
                    window.webContents.send(channels.data.process, auxiliaryString + stringData);
                    auxiliaryString = '';
                }
            })
        })
        .catch((err) => {
            console.log('Client: Error connecting to data streaming\n')
            console.log(err);
        });

    ipcMain.once(channels.settings.get, (event) => {
        const settings = read_settings();
        event.reply(channels.settings.get_response, settings)
    });

    ipcMain.on(channels.settings.update, (_event: any, data: any) => {
        write_settings(data);
    });
}