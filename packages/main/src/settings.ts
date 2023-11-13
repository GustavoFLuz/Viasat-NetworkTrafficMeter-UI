import {app, ipcMain} from 'electron';
import * as fs from 'fs';

export function addSettingsEvents() {
  ipcMain.handle('get-settings', () => {
    return ReadSettings();
  });

  ipcMain.handle('update-settings', (_, output) => {
    return WriteSettings(output);
  });
}

function ReadSettings() {
  try {
    const settings = fs.readFileSync(
      app.getPath('appData') + '/networktrafficmeter/settings.json',
      'utf8',
    );
    return JSON.parse(settings);
  } catch (err) {
    return null;
  }
}

function WriteSettings(output: any) {
  return fs.writeFileSync(
    app.getPath('appData') + '/networktrafficmeter/settings.json',
    JSON.stringify(output),
  );
}
