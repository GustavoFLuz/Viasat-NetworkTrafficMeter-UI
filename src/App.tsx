import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { ThemeProvider } from '@mui/material';
import { LightTheme } from '@/assets/themes';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <ThemeProvider theme={LightTheme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </LocalizationProvider>
  )
}
export default App;
