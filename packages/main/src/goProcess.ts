import {exec, spawn} from 'child_process';
import {resolve} from 'node:path';
import * as fs from 'fs';
import {dialog, ipcMain} from 'electron';
import FormData from 'form-data';
import find from 'find-process';
import axios from 'axios';

type Interface = {
  Index: number;
  Description: string;
  Name: string;
};

type configuration = {
  pid?: number | null;
  interface?: Interface;
};

export function addBackendEvents(window: Electron.BrowserWindow) {
  ipcMain.on('start-backend', () => {
    startProcess().then(() => {
      setTimeout(setProcessInterface, 1000);
    });
  });
  ipcMain.on('stop-backend', () => {
    stopProcess();
  });
  ipcMain.on('update-interface', (_, chosenInterface) => {
    setProcessInterface(chosenInterface);
  });

  startProcess()
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

async function startProcess(): Promise<number | null> {
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
    updateBackendConfiguration({pid: backend.pid});
    console.log(`Started process ${backend.pid}`);
    setTimeout(loadProcessInterface, 1000);
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

async function loadProcessInterface() {
  const backendConfig = getBackendConfiguration();
  if (!backendConfig || !backendConfig.interface) {
    console.log('No interface found.');
    return null;
  }
  const backendInterface = backendConfig.interface as Interface;
  console.log(`Loading interface ${backendInterface.Name}`);
  setProcessInterface(backendInterface)
}

async function setProcessInterface(chosenInterface: Interface) {
  const form = new FormData();
  form.append('interface', chosenInterface.Name.replace(/\\\\/g, '\\'));

  axios
    .post('http://127.0.0.1:50000/devices', form)
    .then(function (response) {
      console.log('Success:', response.data.message);
      updateBackendConfiguration({interface: chosenInterface});
    })
    .catch(function (error) {
      console.error('Error:', error);
    });
}

function updateBackendConfiguration(update: configuration) {
  const currentJson = getBackendConfiguration();
  fs.writeFileSync('configuration.json', JSON.stringify({...currentJson, ...update}));
}

function getBackendConfiguration(): configuration | null {
  try {
    const settings = fs.readFileSync('configuration.json', 'utf8');
    return JSON.parse(settings);
  } catch (err) {
    return null;
  }
}
