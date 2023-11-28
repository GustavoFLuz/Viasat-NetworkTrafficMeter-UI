import {exec, spawn} from 'child_process';
import {resolve} from 'node:path';
import * as fs from 'fs';
import {dialog, ipcMain, app} from 'electron';
import FormData from 'form-data';
import find from 'find-process';
import axios from 'axios';
import {configuration} from '../../types';

export function addBackendEvents(window: Electron.BrowserWindow) {
  ipcMain.on('start-backend', () => {
    startProcess()
  });
  ipcMain.on('stop-backend', () => {
    stopProcess();
  });
  
  ipcMain.handle('get-data-from-time-interval', async (_, {start, end}) => {
    const data = await getDataFromTimeInterval(start, end);
    return data;
  });
}

async function getProcess(): Promise<number | null> {
  const backendConfig = getBackendConfiguration();
  if (!backendConfig || !backendConfig.pid) return null;
  const backendPid = backendConfig.pid;

  const result = await new Promise<number | null>((resolve, reject) => {
    find('pid', backendPid)
      .then(list => {
        if (list && list.length > 0) return resolve(backendPid);
        updateBackendConfiguration({pid: null});
        return resolve(null);
      })
      .catch(reject);
  }).catch(err => {
    console.error(err);
    return null;
  });
  return result;
}

export async function startProcess(): Promise<number | null> {
  console.log('Process Start');
  const backendPid = await getProcess();
  if (backendPid !== null) {
    console.log(`Process ${backendPid} already running.`);
    return backendPid;
  }
  try {
    const backend = spawn(resolve(__dirname, '../NetworkTrafficBackend.exe'), [], {
      detached: true,
      stdio: 'ignore',
      killSignal: 'SIGTERM',
    });
    backend.unref();
    backend.on('message', console.log);

    updateBackendConfiguration({pid: backend.pid});
    console.log(`Started process ${backend.pid}`);
    return backend.pid || null;
  } catch (err) {
    console.error(`Error starting process: ${err}`);
    dialog.showErrorBox(
      'Error',
      'Failed to start backend process. Please make sure the NetworkTrafficBackend.exe file exists.',
    );
    return null;
  }
}

async function stopProcess() {
  const backendConfig = getBackendConfiguration();
  if (!backendConfig || !backendConfig.pid) return null;
  const backendPid = backendConfig.pid;

  if (backendPid === null) console.error('No detached process pid found.');
  exec(`taskkill /F /PID ${backendPid}`, (error, stdout, stderr) => {
    if (error) return console.error(`Error killing process ${backendPid}: ${error}`);
    updateBackendConfiguration({pid: null});
    console.log(`Killed process ${backendPid}`);
  });
}

function updateBackendConfiguration(update: configuration) {
  const currentJson = getBackendConfiguration();

  fs.writeFileSync(
    app.getPath('appData') + '/networktrafficmeter/configuration.json',
    JSON.stringify({...currentJson, ...update}),
  );
}

function getBackendConfiguration(): configuration | null {
  try {
    const settings = fs.readFileSync(
      app.getPath('appData') + '/networktrafficmeter/configuration.json',
      'utf8',
    );
    return JSON.parse(settings);
  } catch (err) {
    return null;
  }
}
async function getDataFromTimeInterval(begin: number, end: number) {
  const data = await axios.get(
    `http://127.0.0.1:50000/active-processes?initialDate=${begin}&endDate=${end}`,
  );
  return data.data;
}
