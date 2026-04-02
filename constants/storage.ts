import { Appearance } from 'react-native';

export type ThemePreference = 'light' | 'dark' | 'system';

const THEME_KEY = 'theme';

// Lazy singleton — deferred so the Nitro native module is ready before first access
let _storage: import('react-native-mmkv').MMKV | null = null;

function getStorage(): import('react-native-mmkv').MMKV | null {
  if (_storage) return _storage;
  try {
    const { MMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
    _storage = new MMKV({ id: 'poupai-settings' });
  } catch {
    // Native module not available (prebuild not done or Expo Go)
  }
  return _storage;
}

export function getThemePreference(): ThemePreference {
  const value = getStorage()?.getString(THEME_KEY);
  if (value === 'light' || value === 'dark') return value;
  return 'system';
}

export function setThemePreference(value: ThemePreference) {
  getStorage()?.set(THEME_KEY, value);
  Appearance.setColorScheme(value === 'system' ? null : value);
}

export function initializeTheme() {
  const pref = getThemePreference();
  if (pref !== 'system') {
    Appearance.setColorScheme(pref);
  }
}
