import { spawn } from 'child_process';
import { resolve } from 'node:path';
import { dialog, ipcMain } from 'electron';
import Store from 'electron-store';
import AutoLaunch from 'auto-launch';
import axios from 'axios';

export function addBackendEvents(window: Electron.BrowserWindow, store: Store<any>) {
  ipcMain.handle('start-backend', async () => await startProcess());
  ipcMain.handle('stop-backend', async () => await stopProcess());
  ipcMain.handle('is-running', async () => await getProcess())
  ipcMain.handle('get-data-from-time-interval', async (_, { start, end }) => await getDataFromTimeInterval(start, end));

  store.onDidChange('startOnWindowsStartup', (newValue) => {
    ToggleStartup(newValue);
  });

  if(store.get("runBackend"))
    startProcess();
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

export async function startProcess(): Promise<boolean> {
  console.log('Process Start');
  const backendRunning = await getProcess();
  if (backendRunning) {
    return true;
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
    return true;
  } catch (err) {
    console.error(`Error starting process: ${err}`);
    dialog.showErrorBox(
      'Error',
      'Failed to start backend process. Please make sure the ViasatTrafficCapture.exe file exists.',
    );
    return false;
  }
}

async function stopProcess(): Promise<boolean> {
  const backendRunning = await getProcess();
  if (!backendRunning) return false;
  const req = await axios.post(
    `http://127.0.0.1:50000/shutdown`,
  );

  return req.status !== 200
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
      return null;
    } 
    const isRunning = await getProcess()
    if(!isRunning){
      console.log('Backend is not running')
      return null;
    }
    console.error('Error retrieving data:', error);
    return null;
  }
}

const autoLaunch = new AutoLaunch({
	name: 'ViasatTrafficCapture',
	path: resolve(__dirname, '../ViasatTrafficCapture.exe'),
})

async function ToggleStartup(enable: boolean) {
  enable ?
    autoLaunch.enable() :
    autoLaunch.disable();
}