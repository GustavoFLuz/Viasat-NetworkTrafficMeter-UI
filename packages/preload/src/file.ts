import * as fs from 'fs';

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

export function GetInterface() {
  try {
    const settings = fs.readFileSync('configuration.json', 'utf8');
    const jsonSettings = JSON.parse(settings)
    return jsonSettings.interface;
  } catch (err) {
    return null;
  }
}