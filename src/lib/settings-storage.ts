import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AppSettings, ThemeMode, UnitSystem } from '../types/bmi';

const SETTINGS_STORAGE_KEY = '@bmi-bloom/settings';

export interface SettingsStorage {
  load: () => Promise<Partial<AppSettings> | null>;
  save: (settings: AppSettings) => Promise<void>;
}

function isUnitSystem(value: unknown): value is UnitSystem {
  return value === 'metric' || value === 'imperial';
}

function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system';
}

function sanitizeStoredSettings(value: unknown): Partial<AppSettings> | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const settings: Partial<AppSettings> = {};

  if (isUnitSystem(candidate.unitSystem)) {
    settings.unitSystem = candidate.unitSystem;
  }

  if (isThemeMode(candidate.themeMode)) {
    settings.themeMode = candidate.themeMode;
  }

  return Object.keys(settings).length > 0 ? settings : null;
}

export const asyncStorageSettingsStorage: SettingsStorage = {
  async load() {
    const rawValue = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    try {
      return sanitizeStoredSettings(JSON.parse(rawValue));
    } catch {
      return null;
    }
  },
  async save(settings) {
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  },
};
