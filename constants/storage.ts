import { Appearance } from 'react-native';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'poupai-settings' });

export type ThemePreference = 'light' | 'dark' | 'system';

const THEME_KEY = 'theme';

export function getThemePreference(): ThemePreference {
  const value = storage.getString(THEME_KEY);
  if (value === 'light' || value === 'dark') return value;
  return 'system';
}

export function setThemePreference(value: ThemePreference) {
  storage.set(THEME_KEY, value);
  Appearance.setColorScheme(value === 'system' ? null : value);
}

// Restore persisted theme preference on module load (synchronous, before first render)
const persisted = getThemePreference();
if (persisted !== 'system') {
  Appearance.setColorScheme(persisted);
}
