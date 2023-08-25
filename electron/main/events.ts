import { ipcMain } from 'electron';
import net from 'net';
import { read_settings, write_settings } from './file';

export function addEvents(window: Electron.CrossProcessExports.BrowserWindow) {
    ipcMain.on('close-window', (event) => {
        window.close();
    });
    ipcMain.on('maximize-window', (event) => {
        window.isMaximized() ? window.unmaximize() : window.maximize();
    });
    ipcMain.on('minimize-window', (event) => {
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
                    window.webContents.send('process', auxiliaryString + stringData);
                    auxiliaryString = '';
                }
            })
        })
        .catch((err) => {
            console.log('Client: Error connecting to data streaming\n')
            console.log(err);
        });

    ipcMain.once('get-settings', (event) => {
        const settings = read_settings();
        event.reply('get-settings-response', settings)
    });

    ipcMain.on('update-settings', (_event: any, data: any) => {
        write_settings(data);
    });
}