import {RouterProvider} from 'react-router-dom';
import {router} from '@/router';
import {CssBaseline, ThemeProvider} from '@mui/material';
import {LightTheme} from '@/assets/themes';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import {SettingsProvider} from './shared/contexts/Settings';
import {NotificationProvider} from './shared/contexts';
import {Interface} from '../../types';
import {SettingsType} from '@/shared/types/Settings';
import {SocketNetworkData} from '@/shared/types/NetworkUsage';

declare global {
  interface Window {
    electron_window: {
      close: () => void;
      maximize: () => void;
      minimize: () => void;
    };
    settings: {
      get: () => Promise<any>;
      update: (settings: SettingsType) => Promise<any>;
    };
    backend: {
      start: () => void;
      stop: () => void;
      update_interface: (interface: Interface) => Promise<any>;
      get_interface: () => Promise<Interface | undefined>;
      get_interfaces: () => Promise<Interface[]>;
      get_data: (start: number, end: number) => Promise<SocketNetworkData[]>;
    };
  }
}
const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <SettingsProvider>
        <ThemeProvider theme={LightTheme}>
          <NotificationProvider>
            <CssBaseline />
            <RouterProvider router={router} />
          </NotificationProvider>
        </ThemeProvider>
      </SettingsProvider>
    </LocalizationProvider>
  );
};
export default App;
