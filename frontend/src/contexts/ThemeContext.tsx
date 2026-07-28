import { createContext, useContext, useLayoutEffect, useState } from 'react';
import type { ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light';
const THEME_STORAGE_KEY = 'englishverse-theme';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  setMode: () => {},
  toggleTheme: () => {},
});

function readStoredTheme(): ThemeMode {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark';
  } catch {
    return 'dark';
  }
}

function storeTheme(mode: ThemeMode) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // A interface continua funcionando mesmo quando o navegador bloqueia o armazenamento.
  }
}

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(readStoredTheme);

  const setMode = (nextMode: ThemeMode) => {
    storeTheme(nextMode);
    setModeState(nextMode);
  };

  const toggleTheme = () => {
    setModeState(previousMode => {
      const nextMode = previousMode === 'dark' ? 'light' : 'dark';
      storeTheme(nextMode);
      return nextMode;
    });
  };

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeContext);
}
