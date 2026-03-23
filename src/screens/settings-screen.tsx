import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useSettings } from '../context/settings-context';
import type { ThemeMode, UnitSystem } from '../types/bmi';
import { ActionButton } from '../components/action-button';
import { HeadingBlock } from '../components/heading-block';
import { RoundIconButton } from '../components/round-icon-button';
import { ScreenContainer } from '../components/screen-container';
import { SegmentedControl } from '../components/segmented-control';
import { SurfaceCard } from '../components/surface-card';

const UNIT_OPTIONS = [
  { label: 'Metric', value: 'metric' },
  { label: 'Imperial', value: 'imperial' },
] as const;

const THEME_OPTIONS: { description: string; label: string; value: ThemeMode }[] = [
  {
    description: 'Matches your device appearance automatically.',
    label: 'System',
    value: 'system',
  },
  {
    description: 'Warm, airy surfaces with contrast tuned for daytime reading.',
    label: 'Light',
    value: 'light',
  },
  {
    description: 'Deep, lower-glare tones for evening check-ins.',
    label: 'Dark',
    value: 'dark',
  },
];

export function SettingsScreen() {
  const router = useRouter();
  const { activeTheme, resolvedThemeMode, setThemeMode, setUnitSystem, settings } =
    useSettings();

  async function handleUnitChange(unitSystem: UnitSystem) {
    await setUnitSystem(unitSystem);
  }

  async function handleThemeChange(themeMode: ThemeMode) {
    await setThemeMode(themeMode);
  }

  return (
    <ScreenContainer>
      <HeadingBlock
        action={<RoundIconButton icon="arrow-back" onPress={() => router.back()} />}
        eyebrow="Preferences"
        subtitle="Shape how the calculator feels every time you open it."
        title="Tune the experience"
      />

      <SurfaceCard style={styles.section}>
        <Text
          style={[
            styles.sectionLabel,
            {
              color: activeTheme.colors.mutedText,
              fontFamily: activeTheme.fonts.medium,
            },
          ]}
        >
          Default units
        </Text>
        <SegmentedControl onChange={handleUnitChange} options={UNIT_OPTIONS} value={settings.unitSystem} />
        <Text
          style={[
            styles.helper,
            {
              color: activeTheme.colors.mutedText,
              fontFamily: activeTheme.fonts.body,
            },
          ]}
        >
          This sets the calculator’s starting mode whenever the app opens.
        </Text>
      </SurfaceCard>

      <SurfaceCard style={styles.section}>
        <Text
          style={[
            styles.sectionLabel,
            {
              color: activeTheme.colors.mutedText,
              fontFamily: activeTheme.fonts.medium,
            },
          ]}
        >
          Theme mood
        </Text>

        <View style={styles.themeOptions}>
          {THEME_OPTIONS.map((option) => {
            const selected = settings.themeMode === option.value;

            return (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                key={option.value}
                onPress={() => handleThemeChange(option.value)}
                style={[
                  styles.themeCard,
                  {
                    backgroundColor: selected
                      ? activeTheme.colors.surfaceStrong
                      : activeTheme.colors.input,
                    borderColor: selected
                      ? activeTheme.colors.primary
                      : activeTheme.colors.border,
                  },
                ]}
                testID={`theme-${option.value}`}
              >
                <View style={styles.themeHeader}>
                  <Text
                    style={[
                      styles.themeLabel,
                      {
                        color: activeTheme.colors.text,
                        fontFamily: activeTheme.fonts.strong,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {selected ? (
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor: activeTheme.colors.primary,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          {
                            color: activeTheme.colors.onPrimary,
                            fontFamily: activeTheme.fonts.strong,
                          },
                        ]}
                      >
                        Active
                      </Text>
                    </View>
                  ) : null}
                </View>
                <Text
                  style={[
                    styles.themeDescription,
                    {
                      color: activeTheme.colors.mutedText,
                      fontFamily: activeTheme.fonts.body,
                    },
                  ]}
                >
                  {option.description}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text
          style={[
            styles.helper,
            {
              color: activeTheme.colors.mutedText,
              fontFamily: activeTheme.fonts.body,
            },
          ]}
        >
          Current resolved theme: {resolvedThemeMode}.
        </Text>
      </SurfaceCard>

      <ActionButton
        icon="arrow-back"
        label="Back to calculator"
        onPress={() => router.replace('/')}
        variant="secondary"
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 18,
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 13,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  helper: {
    fontSize: 15,
    lineHeight: 22,
  },
  themeOptions: {
    gap: 12,
  },
  themeCard: {
    borderRadius: 22,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  themeHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeLabel: {
    fontSize: 18,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  themeDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
});
