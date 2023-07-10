import { createTheme } from '@mui/material/styles';

export const LightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7dd8ff',
    },
    secondary: {
      main: '#abc22e',
    },
    background: {
      default: '#f5f6fa',
      paper: '#ffffff',
    },
  },
});