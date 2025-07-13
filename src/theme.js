import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      // Olive Green
      main: '#6B705C',
    },
    secondary: {
      // Beige
      main: '#A5A58D',
    },
    background: {
      default: '#F2F0EB',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#5C5C5C',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;
