import { render } from '@testing-library/react-native';
import type { ReactElement, ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SettingsProvider } from './src/context/settings-context';
import type { SettingsStorage } from './src/lib/settings-storage';
import type { AppSettings } from './src/types/bmi';

interface RenderWithProvidersOptions {
  initialSettings?: Partial<AppSettings>;
  storage?: SettingsStorage;
}

const TEST_INITIAL_METRICS = {
  frame: {
    x: 0,
    y: 0,
    width: 390,
    height: 844,
  },
  insets: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
};

export function createMemorySettingsStorage(
  initial: Partial<AppSettings> | null = null
): SettingsStorage & {
  load: jest.Mock<Promise<Partial<AppSettings> | null>, []>;
  save: jest.Mock<Promise<void>, [AppSettings]>;
} {
  let storedValue = initial ? { ...initial } : null;

  return {
    load: jest.fn(async () => storedValue),
    save: jest.fn(async (settings: AppSettings) => {
      storedValue = { ...settings };
    }),
  };
}

export function renderWithProviders(
  ui: ReactElement,
  { initialSettings, storage }: RenderWithProvidersOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <SafeAreaProvider initialMetrics={TEST_INITIAL_METRICS}>
        <SettingsProvider initialSettings={initialSettings} storage={storage}>
          {children}
        </SettingsProvider>
      </SafeAreaProvider>
    );
  }

  return render(ui, { wrapper: Wrapper });
}
