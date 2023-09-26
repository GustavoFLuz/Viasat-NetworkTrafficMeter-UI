/**
 * @module preload
 */

import {contextBridge, ipcRenderer} from 'electron';
import * as fs from 'fs';
export {versions} from './versions';

contextBridge.exposeInMainWorld('electron_window', {
  close: () => ipcRenderer.invoke('window-close'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  minimize: () => ipcRenderer.invoke('window-minimize'),
});

contextBridge.exposeInMainWorld('settings', {
  get: ReadSettings,
  update: WriteSettings,
});

export function ReadSettings() {
  try {
    const settings = fs.readFileSync('settings.json', 'utf8');
    return JSON.parse(settings);
  } catch (err) {
    return null;
  }
}

export function WriteSettings(output: any) {
  return fs.writeFileSync('settings.json', JSON.stringify(output));
}