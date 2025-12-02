import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import AppRoutes from './routes';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1a1a1a',
    },
    primary: {
      main: '#007aff',
    },
  },
  typography: {
    fontFamily: 'Arimo, sans-serif',
    h5: {
        fontWeight: 'bold',
    },
    h6: {
        fontWeight: 'bold',
    },
    h4: {
        fontWeight: 'bold',
    }
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;