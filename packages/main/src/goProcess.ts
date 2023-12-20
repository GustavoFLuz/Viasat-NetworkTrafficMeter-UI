import { spawn } from 'child_process';
import { resolve } from 'node:path';
import { dialog, ipcMain } from 'electron';
import axios from 'axios';

export function addBackendEvents(window: Electron.BrowserWindow) {
  ipcMain.on('start-backend', () => {
    startProcess()
  });
  ipcMain.on('stop-backend', () => {
    stopProcess();
  });

  ipcMain.handle('get-data-from-time-interval', async (_, { start, end }) => {
    const data = await getDataFromTimeInterval(start, end);
    return data;
  });
}

async function getProcess(): Promise<boolean> {
  try {
    const running = await axios.get(
      `http://127.0.0.1:50000/ping`,
    );
    return running.status === 200
  } catch(e){
    return false
  }
}

export async function startProcess(): Promise<any> {
  console.log('Process Start');
  const backendRunning = await getProcess();
  if (backendRunning) {
    return console.log(`Process already running.`);
  }
  try {
    const backend = spawn(resolve(__dirname, '../NetworkTrafficBackend.exe'), [], {
      detached: true,
      stdio: 'ignore',
      killSignal: 'SIGTERM',
    });
    backend.unref();
    backend.on('message', console.log);

    console.log(`Started process ${backend.pid}`);
    return backend.pid;
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
  const backendRunning = await getProcess();
  if (!backendRunning) return null;
  const req = await axios.post(
    `http://127.0.0.1:50000/shutdown`,
  );

  if (req.status !== 200)
    return console.log(`An error happened while stopping the backend process`)
}

async function getDataFromTimeInterval(begin: number, end: number) {
  const data = await axios.get(
    `http://127.0.0.1:50000/active-processes?initialDate=${begin}&endDate=${end}`,
  );
  return data.data;
}
