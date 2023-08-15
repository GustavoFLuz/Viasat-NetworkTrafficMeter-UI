import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { LightTheme } from '@/assets/themes';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { SettingsProvider } from './shared/contexts/Settings';

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <SettingsProvider>
        <ThemeProvider theme={LightTheme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </SettingsProvider>
    </LocalizationProvider>
  )
}
export default App;
