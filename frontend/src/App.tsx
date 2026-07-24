import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import AppRoutes from './routes';
import { ThemeContextProvider, useThemeMode } from './contexts/ThemeContext';
import { appPalette } from './theme/palette';
import { GamificationProvider } from './contexts/GamificationContext';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: appPalette.dark.background,
      paper: appPalette.dark.surface,
    },
    primary: {
      main: appPalette.dark.primary,
    },
    secondary: {
      main: appPalette.dark.secondary,
    },
    success: {
      main: appPalette.dark.success,
    },
    error: {
      main: appPalette.dark.error,
    },
    info: {
      main: appPalette.dark.info,
    },
    warning: {
      main: appPalette.dark.accent,
    },
    text: {
      primary: appPalette.dark.text,
      secondary: appPalette.dark.textMuted,
    },
  },
  typography: {
    fontFamily: 'Arimo, sans-serif',
    h4: { fontWeight: 'bold' },
    h5: { fontWeight: 'bold' },
    h6: { fontWeight: 'bold' },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: appPalette.light.background,
      paper: appPalette.light.surface,
    },
    primary: {
      main: appPalette.light.primary,
    },
    secondary: {
      main: appPalette.light.secondary,
    },
    success: {
      main: appPalette.light.success,
    },
    error: {
      main: appPalette.light.error,
    },
    info: {
      main: appPalette.light.info,
    },
    warning: {
      main: appPalette.light.accent,
    },
    text: {
      primary: appPalette.light.text,
      secondary: appPalette.light.textMuted,
    },
  },
  typography: {
    fontFamily: 'Arimo, sans-serif',
    h4: { fontWeight: 'bold' },
    h5: { fontWeight: 'bold' },
    h6: { fontWeight: 'bold' },
  },
});

function ThemedApp() {
  const { mode } = useThemeMode();
  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GamificationProvider>
        <AppRoutes />
      </GamificationProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <ThemeContextProvider>
      <ThemedApp />
    </ThemeContextProvider>
  );
}

export default App;
