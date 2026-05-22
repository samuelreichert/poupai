import type { MMKV } from 'react-native-mmkv';

let storageInstance: MMKV | null = null;

function getStorage(): MMKV | null {
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
    return getStorage()?.getString(key);
  },
  set(key: string, value: boolean | string | number | ArrayBuffer) {
    getStorage()?.set(key, value);
  },
  delete(key: string) {
    getStorage()?.remove(key);
  },
};

export const STORAGE_KEYS = {
  colorScheme: 'colorScheme',
  macroAllocationCompletedPrefix: 'macroAllocationCompleted:',
  lastInvestmentGoalPrefix: 'lastInvestmentGoal:',
} as const;
