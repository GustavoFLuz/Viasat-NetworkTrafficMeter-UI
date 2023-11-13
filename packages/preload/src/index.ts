/**
 * @module preload
 */

import {contextBridge, ipcRenderer} from 'electron';

export {versions} from './versions';
import {Interface} from '../../types';

contextBridge.exposeInMainWorld('electron_window', {
  close: () => ipcRenderer.send('window-close'),
  maximize: () => ipcRenderer.send('window-maximize'),
  minimize: () => ipcRenderer.send('window-minimize'),
});

contextBridge.exposeInMainWorld('settings', {
  get: () => ipcRenderer.invoke('get-settings'),
  update: (output: any) => ipcRenderer.invoke('update-settings', output),
});

contextBridge.exposeInMainWorld('backend', {
  start: () => ipcRenderer.send('start-backend'),
  stop: () => ipcRenderer.send('stop-backend'),
  update_interface: async (chosenInterface: Interface) =>
    await ipcRenderer.invoke('update-interface', chosenInterface),
  get_interface: async () => {
    return await ipcRenderer.invoke('get-interface');
  },
  get_interfaces: async () => await ipcRenderer.invoke('get-interfaces'),
  get_data: async (start: number, end: number) =>
    await ipcRenderer.invoke('get-data-from-time-interval', {start, end}),
});
