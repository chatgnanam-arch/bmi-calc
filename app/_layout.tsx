import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import {
  Outfit_400Regular,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SettingsProvider, useSettings } from '../src/context/settings-context';

function AppShell() {
  const { activeTheme, isReady } = useSettings();
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
    PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(activeTheme.colors.background).catch(() => undefined);
  }, [activeTheme.colors.background]);

  if (!fontsLoaded || !isReady) {
    return (
      <View
        style={[
          styles.loadingRoot,
          {
            backgroundColor: activeTheme.colors.background,
          },
        ]}
      >
        <ActivityIndicator color={activeTheme.colors.primary} size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={activeTheme.statusBarStyle} />
      <Stack
        screenOptions={{
          animation: 'fade',
          contentStyle: {
            backgroundColor: activeTheme.colors.background,
          },
          headerShown: false,
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <SafeAreaProvider>
        <AppShell />
      </SafeAreaProvider>
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  loadingRoot: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
