import { app, ipcMain } from 'electron';
import Store from 'electron-store';

export function addSettingsEvents() {
  const store = new Store({
    cwd: app.getPath('appData'),
    name: "settings",
    schema: {
      startOnWindowsStartup: {
        type: "boolean",
        default: false,
      },
      runBackend: {
        type: "boolean",
        default: true,
      },
    }
  });

  ipcMain.handle('get-settings', async (_, {key}) => {
    return await ReadSettings(store, key);
  });

  ipcMain.handle('update-settings', async (_, output: {key: string, value: any}) => {
    return await WriteSettings(store, output.key, output.value);
  });

  ipcMain.handle('reset-settings', async () => {
    return await store.clear();
  });

  return store;
}

function ReadSettings(store: Store<any>, key?: string) {
  return key?store.get(key):store.store;
}

function WriteSettings(store: Store<any>, key: string, output: any) {
  return store.set(key, output)
}
