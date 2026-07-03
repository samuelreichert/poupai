import type { MMKV } from 'react-native-mmkv';

let storageInstance: MMKV | null = null;

function isServerRender() {
  return process.env.EXPO_OS === 'web' && typeof window === 'undefined';
}

function getStorage(): MMKV | null {
  if (isServerRender()) {
    return null;
  }

  if (storageInstance) {
    return storageInstance;
  }

  try {
    const { createMMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
    storageInstance = createMMKV({ id: 'poupai-settings' });
  } catch {
    return null;
  }

  return storageInstance;
}

export const storage = {
  getString(key: string) {
    if (isServerRender()) {
      return undefined;
    }

    return getStorage()?.getString(key);
  },
  set(key: string, value: boolean | string | number | ArrayBuffer) {
    if (isServerRender()) {
      return;
    }

    getStorage()?.set(key, value);
  },
  delete(key: string) {
    if (isServerRender()) {
      return;
    }

    getStorage()?.remove(key);
  },
};

export const STORAGE_KEYS = {
  colorScheme: 'colorScheme',
  macroAllocationCompletedPrefix: 'macroAllocationCompleted:',
  lastInvestmentGoalPrefix: 'lastInvestmentGoal:',
} as const;
