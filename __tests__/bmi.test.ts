import {
  buildBmiResult,
  calculateBmi,
  getBmiCategory,
  normalizeToMetric,
  validateInputs,
} from '../src/lib/bmi';

describe('BMI domain helpers', () => {
  it('calculates BMI from metric inputs', () => {
    const normalized = normalizeToMetric(
      {
        weightKg: '70',
        heightCm: '175',
        weightLb: '',
        heightFt: '',
        heightIn: '',
      },
      'metric'
    );

    expect(calculateBmi(normalized)).toBeCloseTo(22.86, 2);
  });

  it('calculates BMI from imperial inputs with conversion', () => {
    const normalized = normalizeToMetric(
      {
        weightKg: '',
        heightCm: '',
        weightLb: '160',
        heightFt: '5',
        heightIn: '9',
      },
      'imperial'
    );

    expect(calculateBmi(normalized)).toBeCloseTo(23.63, 2);
  });

  it('validates empty, malformed, and unrealistic entries', () => {
    expect(
      validateInputs(
        {
          weightKg: '',
          heightCm: '',
          weightLb: '',
          heightFt: '',
          heightIn: '',
        },
        'metric'
      ).errors
    ).toMatchObject({
      weightKg: 'Enter your weight.',
      heightCm: 'Enter your height.',
    });

    expect(
      validateInputs(
        {
          weightKg: '-10',
          heightCm: 'abc',
          weightLb: '',
          heightFt: '',
          heightIn: '',
        },
        'metric'
      ).errors
    ).toMatchObject({
      weightKg: 'Weight must be greater than 0.',
      heightCm: 'Enter your height.',
    });

    expect(
      validateInputs(
        {
          weightKg: '',
          heightCm: '',
          weightLb: '5000',
          heightFt: '2',
          heightIn: '15',
        },
        'imperial'
      ).errors
    ).toMatchObject({
      weightLb: 'Enter a realistic weight.',
      heightIn: 'Use 0 to 11.9 inches.',
    });
  });

  it('uses the correct category boundaries', () => {
    expect(getBmiCategory(18.49).category).toBe('Underweight');
    expect(getBmiCategory(18.5).category).toBe('Normal');
    expect(getBmiCategory(24.99).category).toBe('Normal');
    expect(getBmiCategory(25).category).toBe('Overweight');
    expect(getBmiCategory(29.99).category).toBe('Overweight');
    expect(getBmiCategory(30).category).toBe('Obesity');
  });

  it('builds a rounded result payload with disclaimer text', () => {
    expect(buildBmiResult(24.94)).toMatchObject({
      value: 24.9,
      category: 'Normal',
      rangeLabel: '18.5 - 24.9',
      disclaimer:
        'Adult BMI ranges are shown for general guidance only and are not a diagnosis.',
    });
  });
});
