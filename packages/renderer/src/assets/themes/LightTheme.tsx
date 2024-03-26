import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: {
      black: string;
      white: string;
      lightGray: string;
      gray: string;
      darkGray: string;
    };
  }
  interface PaletteOptions {
    neutral: {
      black: string;
      white: string;
      lightGray: string;
      gray: string;
      darkGray: string;
    };
  }
}

export const LightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#009FE3',
    },
    secondary: {
      main: '#BED733',
    },
    background: {
      default: '#F5F6FA',
      paper: '#EAEAEA',
    },
    error: {
      main: '#ff4747',
    },
    neutral: {
      white: '#FFFFFF',
      black: '#030517',
      lightGray: '#EAEAEA',
      gray: '#8F8F8F',
      darkGray: '#2E2F42',
    },
  },
  typography: {
    fontFamily: ['Poppins', 'Roboto','sans-serif'].join(","),
    h1: {
      fontSize: '2.5rem',
      lineHeight: '3.5rem',
    },
    h6: {
      fontSize: '1.25rem',
      lineHeight: '1.75rem',
    }
  },
});