import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSettings } from '../context/settings-context';

interface ScreenContainerProps {
  bottomSlot?: ReactNode;
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollEnabled?: boolean;
}

export function ScreenContainer({
  bottomSlot,
  children,
  contentContainerStyle,
  scrollEnabled = true,
}: ScreenContainerProps) {
  const { activeTheme } = useSettings();

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: activeTheme.colors.background,
        },
      ]}
    >
      <LinearGradient
        colors={activeTheme.gradients.background}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View
        pointerEvents="none"
        style={[
          styles.glow,
          styles.glowLeft,
          {
            backgroundColor: activeTheme.colors.glowPrimary,
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.glow,
          styles.glowRight,
          {
            backgroundColor: activeTheme.colors.glowSecondary,
          },
        ]}
      />
      <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.safeArea}>
        {scrollEnabled ? (
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              bottomSlot ? styles.scrollContentWithBanner : null,
              contentContainerStyle,
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.scrollContent, contentContainerStyle]}>{children}</View>
        )}
        {bottomSlot ? (
          <View
            style={[
              styles.bottomSlot,
              {
                backgroundColor: activeTheme.colors.background,
                borderTopColor: activeTheme.colors.divider,
              },
            ]}
          >
            {bottomSlot}
          </View>
        ) : null}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 40,
  },
  scrollContentWithBanner: {
    paddingBottom: 16,
  },
  bottomSlot: {
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 6,
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    height: 220,
    width: 220,
  },
  glowLeft: {
    left: -44,
    top: 72,
  },
  glowRight: {
    right: -54,
    top: 280,
  },
});
