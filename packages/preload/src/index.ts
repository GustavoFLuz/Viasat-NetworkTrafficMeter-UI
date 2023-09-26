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

function ReadSettings(event: any) {
  try {
    const settings = fs.readFileSync('settings.json', 'utf8');
    return JSON.parse(settings);
  } catch (err) {
    return null;
  }
}

function WriteSettings(output: any) {
  return fs.writeFileSync('settings.json', JSON.stringify(output));
}

/* 
ipcMain.once(channels.settings.get, (event) => {
    const settings = read_settings();
    event.reply(channels.settings.get_response, settings)
});

ipcMain.on(channels.settings.update, (_event: any, data: any) => {
    write_settings(data);
}); */
