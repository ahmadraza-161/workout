import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { getKv, setKv, type ThemePreference } from '../kv';
import { darkColors, lightColors, type ColorScheme, type ThemeColors } from './colors';
import { elevation, motion, radius, sizes, spacing } from './tokens';

export interface Theme {
  scheme: ColorScheme;
  isDark: boolean;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  sizes: typeof sizes;
  elevation: typeof elevation;
  motion: typeof motion;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  reloadPreference: () => void;
}

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>(() => getKv('settings.theme'));

  const setPreference = useCallback((next: ThemePreference) => {
    setKv('settings.theme', next);
    setPreferenceState(next);
  }, []);
  const reloadPreference = useCallback(() => setPreferenceState(getKv('settings.theme')), []);

  const theme = useMemo<Theme>(() => {
    const scheme: ColorScheme =
      preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;
    return {
      scheme,
      isDark: scheme === 'dark',
      colors: scheme === 'dark' ? darkColors : lightColors,
      spacing,
      radius,
      sizes,
      elevation,
      motion,
      preference,
      setPreference,
      reloadPreference,
    };
  }, [preference, systemScheme, setPreference, reloadPreference]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTheme must be used inside <ThemeProvider>');
  return theme;
}
