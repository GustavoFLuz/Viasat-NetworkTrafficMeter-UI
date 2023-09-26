import type {ElectronApplication, JSHandle} from 'playwright';
import {_electron as electron} from 'playwright';
import {afterAll, beforeAll, expect, test} from 'vitest';
import {createHash} from 'crypto';
import type {BrowserWindow} from 'electron';

let electronApp: ElectronApplication;

beforeAll(async () => {
  electronApp = await electron.launch({args: ['.']});
});

afterAll(async () => {
  await electronApp.close();
});

test('Main window state', async () => {
  const page = await electronApp.firstWindow();
  const window: JSHandle<BrowserWindow> = await electronApp.browserWindow(page);
  const windowState = await window.evaluate(
    (mainWindow): Promise<{isVisible: boolean; isDevToolsOpened: boolean; isCrashed: boolean}> => {
      const getState = () => ({
        isVisible: mainWindow.isVisible(),
        isDevToolsOpened: mainWindow.webContents.isDevToolsOpened(),
        isCrashed: mainWindow.webContents.isCrashed(),
      });

      return new Promise(resolve => {
        /**
         * The main window is created hidden, and is shown only when it is ready.
         * See {@link ../packages/main/src/mainWindow.ts} function
         */
        if (mainWindow.isVisible()) {
          resolve(getState());
        } else mainWindow.once('ready-to-show', () => resolve(getState()));
      });
    },
  );

  expect(windowState.isCrashed, 'The app has crashed').toBeFalsy();
  expect(windowState.isVisible, 'The main window was not visible').toBeTruthy();
  expect(windowState.isDevToolsOpened, 'The DevTools panel was open').toBeFalsy();
});