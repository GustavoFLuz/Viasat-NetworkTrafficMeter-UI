import { spawn } from 'child_process';
import { resolve } from 'node:path';
import { dialog, ipcMain } from 'electron';
import AutoLaunch from 'auto-launch';
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

  ipcMain.on('request-startup-initialization', () => {
    ToggleStartup();
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
    const backend = spawn(resolve(__dirname, '../ViasatTrafficCapture.exe'), [], {
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
      'Failed to start backend process. Please make sure the ViasatTrafficCapture.exe file exists.',
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
let abortController: AbortController | null = null;
async function getDataFromTimeInterval(begin: number, end: number) {
  if (abortController) {
    abortController.abort()
    abortController = null;
  }
  abortController = new AbortController();

  try {
    const response = await axios.get(
      `http://127.0.0.1:50000/active-processes?initialDate=${begin}&endDate=${end}`,
      {
        signal: abortController.signal
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
    } else {
      console.error('Error retrieving data:', error);
    }
    return null;
  }
}

const autoLaunch = new AutoLaunch({
	name: 'ViasatTrafficCapture',
	path: resolve(__dirname, '../ViasatTrafficCapture.exe'),
})

async function ToggleStartup() {
  autoLaunch.isEnabled()
  .then(function(isEnabled){
    isEnabled? 
      autoLaunch.disable():
      autoLaunch.enable();
  })
  .catch(function(err){
      console.error(err)
  });
}