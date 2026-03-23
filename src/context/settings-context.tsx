import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';

import { asyncStorageSettingsStorage, type SettingsStorage } from '../lib/settings-storage';
import { getAppTheme, type AppTheme } from '../theme/theme';
import type { AppSettings, ThemeMode, UnitSystem } from '../types/bmi';

interface SettingsContextValue {
  activeTheme: AppTheme;
  isReady: boolean;
  settings: AppSettings;
  resolvedThemeMode: 'light' | 'dark';
  setThemeMode: (themeMode: ThemeMode) => Promise<void>;
  setUnitSystem: (unitSystem: UnitSystem) => Promise<void>;
}

interface SettingsProviderProps {
  children: ReactNode;
  initialSettings?: Partial<AppSettings>;
  storage?: SettingsStorage;
}

const DEFAULT_SETTINGS: AppSettings = {
  unitSystem: 'metric',
  themeMode: 'system',
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({
  children,
  initialSettings,
  storage = asyncStorageSettingsStorage,
}: SettingsProviderProps) {
  const systemColorScheme = useColorScheme();
  const [settings, setSettings] = useState<AppSettings>({
    ...DEFAULT_SETTINGS,
    ...initialSettings,
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    storage
      .load()
      .then((storedSettings) => {
        if (!isMounted) {
          return;
        }

        if (storedSettings) {
          setSettings((currentSettings) => ({
            ...currentSettings,
            ...storedSettings,
          }));
        }

        setIsReady(true);
      })
      .catch(() => {
        if (isMounted) {
          setIsReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [storage]);

  const resolvedThemeMode =
    settings.themeMode === 'system'
      ? systemColorScheme === 'dark'
        ? 'dark'
        : 'light'
      : settings.themeMode;

  const activeTheme = getAppTheme(resolvedThemeMode);

  async function updateSettings(patch: Partial<AppSettings>) {
    let savePromise = Promise.resolve();

    setSettings((currentSettings) => {
      const nextSettings = {
        ...currentSettings,
        ...patch,
      };

      savePromise = storage.save(nextSettings);

      return nextSettings;
    });

    await savePromise;
  }

  return (
    <SettingsContext.Provider
      value={{
        activeTheme,
        isReady,
        settings,
        resolvedThemeMode,
        setThemeMode: async (themeMode) => updateSettings({ themeMode }),
        setUnitSystem: async (unitSystem) => updateSettings({ unitSystem }),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const value = useContext(SettingsContext);

  if (!value) {
    throw new Error('useSettings must be used inside SettingsProvider.');
  }

  return value;
}
