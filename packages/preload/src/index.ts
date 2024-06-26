/**
 * @module preload
 */

import {contextBridge, ipcRenderer} from 'electron';

export {versions} from './versions';

contextBridge.exposeInMainWorld('electron_window', {
  close: () => ipcRenderer.send('window-close'),
  maximize: () => ipcRenderer.send('window-maximize'),
  minimize: () => ipcRenderer.send('window-minimize'),
});

contextBridge.exposeInMainWorld('settings', {
  get: (key?: string) => ipcRenderer.invoke('get-settings', {key}),
  update: (key: string, value: any) => ipcRenderer.invoke('update-settings', {key, value}),
  reset: () => ipcRenderer.invoke('reset-settings'),
});

contextBridge.exposeInMainWorld('backend', {
  start: async () => await ipcRenderer.invoke('start-backend'),
  stop: async () => await ipcRenderer.invoke('stop-backend'),
  isRunning: async () => await ipcRenderer.invoke('is-running'),
  get_data: async (start: number, end: number) =>
    await ipcRenderer.invoke('get-data-from-time-interval', {start, end}),
  request_startup: () => ipcRenderer.send('request-startup-initialization'),
});
