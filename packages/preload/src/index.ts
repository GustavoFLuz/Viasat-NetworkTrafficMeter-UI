/**
 * @module preload
 */

import {contextBridge, ipcRenderer} from 'electron';

export {versions} from './versions';
import {ReadSettings, WriteSettings, GetInterface} from './file';

contextBridge.exposeInMainWorld('electron_window', {
  close: () => ipcRenderer.send('window-close'),
  maximize: () => ipcRenderer.send('window-maximize'),
  minimize: () => ipcRenderer.send('window-minimize'),
});

contextBridge.exposeInMainWorld('settings', {
  get: ReadSettings,
  update: WriteSettings,
});

contextBridge.exposeInMainWorld('backend', {
  start: () => ipcRenderer.send('start-backend'),
  stop: () => ipcRenderer.send('stop-backend'),
  update_interface: (chosenInterface: Interface) =>
    ipcRenderer.send('update-interface', chosenInterface),
  get_interface: () => GetInterface(),
});

type Interface = {
  Index: number;
  Description: string;
  Name: string;
};