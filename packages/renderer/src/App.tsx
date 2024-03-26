import {RouterProvider} from 'react-router-dom';
import {router} from '@/router';
import {CssBaseline, ThemeProvider} from '@mui/material';
import {LightTheme} from '@/assets/themes';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import {NotificationProvider} from './shared/contexts';
import {SocketNetworkData} from '@/shared/types/NetworkUsage';

declare global {
  interface Window {
    electron_window: {
      close: () => void;
      maximize: () => void;
      minimize: () => void;
    };
    settings: {
      get: (key?: string) => Promise<any>;
      update: (key: string, value: any) => Promise<any>;
      reset: () => Promise<any>;
    };
    backend: {
      start: () => Promise<boolean>;
      stop: () => Promise<boolean>;
      isRunning: () => Promise<boolean>;
      get_data: (start: number, end: number) => Promise<SocketNetworkData[]>;
    };
  }
}
const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <ThemeProvider theme={LightTheme}>
        <NotificationProvider>
          <CssBaseline />
          <RouterProvider router={router} />
        </NotificationProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
};
export default App;
