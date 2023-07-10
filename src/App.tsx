import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ThemeProvider } from '@mui/material';
import { LightTheme } from './shared/themes';

const App = () => {
  return (
    <ThemeProvider theme={LightTheme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
export default App;
