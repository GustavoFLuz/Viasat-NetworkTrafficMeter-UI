/**
 * @module preload
 */

import {contextBridge, ipcRenderer} from 'electron';

export {versions} from './versions';
import {ReadSettings, WriteSettings, GetInterface} from './file';
import {Interface} from "../../types"

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
  update_interface: async (chosenInterface: Interface) =>
    await ipcRenderer.invoke('update-interface', chosenInterface),
  get_interface: () => GetInterface(),
  get_interfaces: async () => await ipcRenderer.invoke('get-interfaces'),
});