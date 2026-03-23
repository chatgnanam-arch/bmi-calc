import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { useSettings } from '../context/settings-context';
import { buildBmiResult } from '../lib/bmi';
import type { BmiCategory } from '../types/bmi';
import { ActionButton } from '../components/action-button';
import { AdBanner } from '../components/ad-banner';
import { HeadingBlock } from '../components/heading-block';
import { RoundIconButton } from '../components/round-icon-button';
import { ScreenContainer } from '../components/screen-container';
import { SurfaceCard } from '../components/surface-card';
import { useInterstitialAd } from '../hooks/use-interstitial-ad';

interface ResultsScreenContentProps {
  bmiValue: number | null;
  onOpenSettings: () => void;
  onRecalculate: () => void;
}

const BMI_SCALE: { category: BmiCategory; label: string; tone: 'calm' | 'positive' | 'warm' | 'alert' }[] = [
  { category: 'Underweight', label: 'Under', tone: 'calm' },
  { category: 'Normal', label: 'Normal', tone: 'positive' },
  { category: 'Overweight', label: 'Over', tone: 'warm' },
  { category: 'Obesity', label: 'Obese', tone: 'alert' },
];

function readParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function ResultsScreenContent({
  bmiValue,
  onOpenSettings,
  onRecalculate,
}: ResultsScreenContentProps) {
  const { activeTheme } = useSettings();
  const { showOrContinue } = useInterstitialAd();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        duration: 420,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        friction: 8,
        tension: 70,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  if (bmiValue === null || Number.isNaN(bmiValue)) {
    return (
      <ScreenContainer>
        <HeadingBlock
          action={<RoundIconButton icon="arrow-back" onPress={onRecalculate} />}
          eyebrow="Result"
          subtitle="We need a fresh calculation before we can show a BMI reading."
          title="Nothing to display"
        />
        <SurfaceCard style={styles.block}>
          <Text
            style={[
              styles.copy,
              {
                color: activeTheme.colors.text,
                fontFamily: activeTheme.fonts.body,
              },
            ]}
          >
            Head back to the calculator, enter your height and weight, and we will build
            the result card for you.
          </Text>
          <ActionButton
            icon="refresh"
            label="Go to calculator"
            onPress={onRecalculate}
            testID="recalculate-button"
          />
        </SurfaceCard>
      </ScreenContainer>
    );
  }

  const result = buildBmiResult(bmiValue);
  const tone = activeTheme.resultTones[result.tone];

  return (
    <ScreenContainer bottomSlot={<AdBanner />}>
      <HeadingBlock
        action={<RoundIconButton icon="tune" onPress={onOpenSettings} />}
        eyebrow="Result"
        title={result.resultTitle}
      />

      <Animated.View
        style={[
          styles.animatedCard,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <SurfaceCard style={styles.heroCard}>
          {/* Tone-tinted BMI halo */}
          <View
            style={[
              styles.valueHalo,
              {
                backgroundColor: tone.chip,
              },
            ]}
          >
            <Text
              style={[
                styles.valueLabel,
                {
                  color: tone.accent,
                  fontFamily: activeTheme.fonts.medium,
                },
              ]}
            >
              BMI
            </Text>
            <Text
              style={[
                styles.value,
                {
                  color: activeTheme.colors.text,
                  fontFamily: activeTheme.fonts.display,
                },
              ]}
              testID="result-value"
            >
              {result.value.toFixed(1)}
            </Text>
          </View>

          {/* Category chip */}
          <View
            style={[
              styles.categoryChip,
              {
                backgroundColor: tone.chip,
              },
            ]}
          >
            <Text
              style={[
                styles.categoryChipText,
                {
                  color: tone.accent,
                  fontFamily: activeTheme.fonts.strong,
                },
              ]}
              testID="result-category"
            >
              {result.category}
            </Text>
          </View>

          {/* BMI scale bar */}
          <View style={styles.scaleBar}>
            {BMI_SCALE.map((segment, index) => {
              const active = segment.category === result.category;
              const segTone = activeTheme.resultTones[segment.tone];
              const isFirst = index === 0;
              const isLast = index === BMI_SCALE.length - 1;

              return (
                <View key={segment.category} style={styles.scaleSegmentWrapper}>
                  <View
                    style={[
                      styles.scaleSegment,
                      {
                        backgroundColor: active ? segTone.chip : activeTheme.colors.surfaceStrong,
                        borderColor: active ? segTone.accent : 'transparent',
                        borderBottomLeftRadius: isFirst ? 999 : 0,
                        borderTopLeftRadius: isFirst ? 999 : 0,
                        borderBottomRightRadius: isLast ? 999 : 0,
                        borderTopRightRadius: isLast ? 999 : 0,
                        borderWidth: active ? 1.5 : 0,
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.scaleLabel,
                      {
                        color: active ? segTone.accent : activeTheme.colors.mutedText,
                        fontFamily: active ? activeTheme.fonts.strong : activeTheme.fonts.body,
                      },
                    ]}
                  >
                    {segment.label}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* WHO link for Obesity */}
          {result.category === 'Obesity' ? (
            <Pressable
              onPress={() => Linking.openURL('https://www.who.int/health-topics/obesity')}
              style={({ pressed }) => [
                styles.whoLink,
                { borderColor: tone.accent, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text
                style={[
                  styles.whoLinkText,
                  {
                    color: tone.accent,
                    fontFamily: activeTheme.fonts.medium,
                  },
                ]}
              >
                WHO health tips on obesity ↗
              </Text>
            </Pressable>
          ) : null}

          <View style={styles.metaRow}>
            <View style={styles.metaBlock}>
              <Text
                style={[
                  styles.metaLabel,
                  {
                    color: activeTheme.colors.mutedText,
                    fontFamily: activeTheme.fonts.medium,
                  },
                ]}
              >
                Adult reference band
              </Text>
              <Text
                style={[
                  styles.metaValue,
                  {
                    color: activeTheme.colors.text,
                    fontFamily: activeTheme.fonts.strong,
                  },
                ]}
                testID="result-range"
              >
                {result.rangeLabel}
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.disclaimer,
              {
                color: activeTheme.colors.mutedText,
                fontFamily: activeTheme.fonts.body,
              },
            ]}
            testID="result-disclaimer"
          >
            {result.disclaimer}
          </Text>
        </SurfaceCard>
      </Animated.View>

      <View style={styles.actions}>
        <ActionButton
          icon="refresh"
          label="Recalculate"
          onPress={() => showOrContinue(onRecalculate)}
          testID="recalculate-button"
        />
        <ActionButton
          icon="tune"
          label="Adjust settings"
          onPress={onOpenSettings}
          variant="secondary"
        />
      </View>
    </ScreenContainer>
  );
}

export function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ bmi?: string | string[] }>();
  const bmiParam = readParam(params.bmi);
  const bmiValue = bmiParam ? Number(bmiParam) : null;

  return (
    <ResultsScreenContent
      bmiValue={bmiValue}
      onOpenSettings={() => router.push('/settings')}
      onRecalculate={() => router.replace('/')}
    />
  );
}

const styles = StyleSheet.create({
  animatedCard: {
    marginBottom: 18,
  },
  block: {
    gap: 18,
  },
  copy: {
    fontSize: 16,
    lineHeight: 24,
  },
  heroCard: {
    alignItems: 'center',
    gap: 18,
  },
  valueHalo: {
    alignItems: 'center',
    borderRadius: 999,
    height: 190,
    justifyContent: 'center',
    width: 190,
  },
  valueLabel: {
    fontSize: 14,
    letterSpacing: 0.7,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 58,
    lineHeight: 62,
  },
  categoryChip: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  categoryChipText: {
    fontSize: 15,
  },
  scaleBar: {
    flexDirection: 'row',
    gap: 3,
    width: '100%',
  },
  scaleSegmentWrapper: {
    alignItems: 'center',
    flex: 1,
    gap: 5,
  },
  scaleSegment: {
    height: 8,
    width: '100%',
  },
  scaleLabel: {
    fontSize: 10,
    letterSpacing: 0.2,
  },
  whoLink: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  whoLinkText: {
    fontSize: 13,
    letterSpacing: 0.3,
  },
  metaRow: {
    flexDirection: 'row',
    width: '100%',
  },
  metaBlock: {
    flex: 1,
    gap: 6,
  },
  metaLabel: {
    fontSize: 13,
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 18,
  },
  disclaimer: {
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    gap: 12,
  },
});
