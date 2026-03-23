import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useSettings } from '../context/settings-context';
import {
  calculateBmi,
  EMPTY_CALCULATOR_INPUT,
  normalizeToMetric,
  validateInputs,
} from '../lib/bmi';
import type { CalculatorInput, UnitSystem } from '../types/bmi';
import { ActionButton } from '../components/action-button';
import { HeadingBlock } from '../components/heading-block';
import { NumberField } from '../components/number-field';
import { RoundIconButton } from '../components/round-icon-button';
import { ScreenContainer } from '../components/screen-container';
import { SegmentedControl } from '../components/segmented-control';
import { SurfaceCard } from '../components/surface-card';

const UNIT_OPTIONS = [
  { label: 'Metric', value: 'metric' },
  { label: 'Imperial', value: 'imperial' },
] as const;

function sanitizeNumericInput(value: string) {
  return value.replace(/[^0-9,.-]/g, '');
}

export function CalculatorScreen() {
  const router = useRouter();
  const { activeTheme, settings } = useSettings();
  const [input, setInput] = useState<CalculatorInput>(EMPTY_CALCULATOR_INPUT);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(settings.unitSystem);

  useEffect(() => {
    setUnitSystem(settings.unitSystem);
  }, [settings.unitSystem]);

  const validation = validateInputs(input, unitSystem);

  function updateField(field: keyof CalculatorInput, value: string) {
    setInput((currentInput) => ({
      ...currentInput,
      [field]: sanitizeNumericInput(value),
    }));
  }

  function handleUnitChange(nextUnitSystem: UnitSystem) {
    setUnitSystem(nextUnitSystem);
    setHasSubmitted(false);
  }

  function fieldError(field: keyof CalculatorInput) {
    if (!hasSubmitted && !input[field]) {
      return undefined;
    }

    return validation.errors[field];
  }

  function handleCalculate() {
    setHasSubmitted(true);

    if (!validation.isValid) {
      return;
    }

    const normalizedInput = normalizeToMetric(input, unitSystem);
    const bmi = calculateBmi(normalizedInput);

    router.push({
      pathname: '/results',
      params: { bmi: bmi.toString() },
    });
  }

  return (
    <ScreenContainer>
      <HeadingBlock
        action={<RoundIconButton icon="tune" onPress={() => router.push('/settings')} />}
        eyebrow="BMI Bloom"
        title="Find your balance"
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
          Measurement mode
        </Text>
        <SegmentedControl
          onChange={handleUnitChange}
          options={UNIT_OPTIONS}
          testID="unit-toggle"
          value={unitSystem}
        />

        {unitSystem === 'metric' ? (
          <View style={styles.fields}>
            <NumberField
              error={fieldError('weightKg')}
              label="Weight"
              onChangeText={(value) => updateField('weightKg', value)}
              placeholder="72.5"
              testID="weightKg-input"
              unit="kg"
              value={input.weightKg}
            />
            <NumberField
              error={fieldError('heightCm')}
              label="Height"
              onChangeText={(value) => updateField('heightCm', value)}
              placeholder="175"
              testID="heightCm-input"
              unit="cm"
              value={input.heightCm}
            />
          </View>
        ) : (
          <View style={styles.fields}>
            <NumberField
              error={fieldError('weightLb')}
              label="Weight"
              onChangeText={(value) => updateField('weightLb', value)}
              placeholder="160"
              testID="weightLb-input"
              unit="lb"
              value={input.weightLb}
            />
            <View style={styles.imperialRow}>
              <View style={styles.imperialColumn}>
                <NumberField
                  error={fieldError('heightFt')}
                  label="Height"
                  onChangeText={(value) => updateField('heightFt', value)}
                  placeholder="5"
                  testID="heightFt-input"
                  unit="ft"
                  value={input.heightFt}
                />
              </View>
              <View style={styles.imperialColumn}>
                <NumberField
                  error={fieldError('heightIn')}
                  label=""
                  onChangeText={(value) => updateField('heightIn', value)}
                  placeholder="9"
                  testID="heightIn-input"
                  unit="in"
                  value={input.heightIn}
                />
              </View>
            </View>
          </View>
        )}

        <ActionButton
          icon="arrow-forward"
          label="Calculate BMI"
          onPress={handleCalculate}
          testID="calculate-button"
        />
      </SurfaceCard>
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
  fields: {
    gap: 16,
  },
  imperialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  imperialColumn: {
    flex: 1,
  },
});
