import { beforeEach, expect, test, vi } from 'vitest';
import { versions } from '../src';

vi.mock('electron', () => {
  const mockContextBridge = {
    exposeInMainWorld: vi.fn(),
    exposeInRenderer: vi.fn(),
  };
  const mockIpcRenderer = {
    invoke: vi.fn().mockReturnThis(),
  };
  return {contextBridge: mockContextBridge, ipcRenderer: mockIpcRenderer};
});

beforeEach(() => {
  vi.clearAllMocks();
});

test('versions', async () => {
  expect(versions).toBe(process.versions);
});