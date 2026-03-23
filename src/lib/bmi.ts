import type {
  BmiCategoryInfo,
  BmiResult,
  CalculatorInput,
  NormalizedMetricInput,
  UnitSystem,
  ValidationErrors,
  ValidationResult,
} from '../types/bmi';

export const BMI_DISCLAIMER =
  'Adult BMI ranges are shown for general guidance only and are not a diagnosis.';

export const EMPTY_CALCULATOR_INPUT: CalculatorInput = {
  weightKg: '',
  heightCm: '',
  weightLb: '',
  heightFt: '',
  heightIn: '',
};

const METRIC_WEIGHT_RANGE = { min: 20, max: 500 };
const METRIC_HEIGHT_RANGE = { min: 90, max: 272 };
const IMPERIAL_WEIGHT_RANGE = { min: 44, max: 1100 };
const IMPERIAL_TOTAL_HEIGHT_IN_RANGE = { min: 36, max: 107 };

function parseNumericValue(value: string): number | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (!/^-?\d*([.,]\d+)?$/.test(trimmed)) {
    return null;
  }

  const parsed = Number(trimmed.replace(',', '.'));

  return Number.isFinite(parsed) ? parsed : null;
}

function hasErrors(errors: ValidationErrors): boolean {
  return Object.values(errors).some(Boolean);
}

export function validateInputs(
  input: CalculatorInput,
  unitSystem: UnitSystem
): ValidationResult {
  const errors: ValidationErrors = {};

  if (unitSystem === 'metric') {
    const weightKg = parseNumericValue(input.weightKg);
    const heightCm = parseNumericValue(input.heightCm);

    if (weightKg === null) {
      errors.weightKg = 'Enter your weight.';
    } else if (weightKg <= 0) {
      errors.weightKg = 'Weight must be greater than 0.';
    } else if (
      weightKg < METRIC_WEIGHT_RANGE.min ||
      weightKg > METRIC_WEIGHT_RANGE.max
    ) {
      errors.weightKg = 'Enter a realistic weight.';
    }

    if (heightCm === null) {
      errors.heightCm = 'Enter your height.';
    } else if (heightCm <= 0) {
      errors.heightCm = 'Height must be greater than 0.';
    } else if (
      heightCm < METRIC_HEIGHT_RANGE.min ||
      heightCm > METRIC_HEIGHT_RANGE.max
    ) {
      errors.heightCm = 'Enter a realistic height.';
    }
  } else {
    const weightLb = parseNumericValue(input.weightLb);
    const heightFt = parseNumericValue(input.heightFt);
    const heightIn = parseNumericValue(input.heightIn);

    if (weightLb === null) {
      errors.weightLb = 'Enter your weight.';
    } else if (weightLb <= 0) {
      errors.weightLb = 'Weight must be greater than 0.';
    } else if (
      weightLb < IMPERIAL_WEIGHT_RANGE.min ||
      weightLb > IMPERIAL_WEIGHT_RANGE.max
    ) {
      errors.weightLb = 'Enter a realistic weight.';
    }

    if (heightFt === null) {
      errors.heightFt = 'Enter feet.';
    } else if (heightFt < 0) {
      errors.heightFt = 'Feet cannot be negative.';
    }

    if (heightIn === null) {
      errors.heightIn = 'Enter inches.';
    } else if (heightIn < 0) {
      errors.heightIn = 'Inches cannot be negative.';
    } else if (heightIn >= 12) {
      errors.heightIn = 'Use 0 to 11.9 inches.';
    }

    if (
      weightLb !== null &&
      heightFt !== null &&
      heightFt >= 0 &&
      heightIn !== null &&
      heightIn >= 0 &&
      heightIn < 12
    ) {
      const totalHeightIn = heightFt * 12 + heightIn;

      if (
        totalHeightIn < IMPERIAL_TOTAL_HEIGHT_IN_RANGE.min ||
        totalHeightIn > IMPERIAL_TOTAL_HEIGHT_IN_RANGE.max
      ) {
        errors.heightFt = 'Enter a realistic height.';
      }
    }
  }

  return {
    isValid: !hasErrors(errors),
    errors,
  };
}

export function normalizeToMetric(
  input: CalculatorInput,
  unitSystem: UnitSystem
): NormalizedMetricInput {
  if (unitSystem === 'metric') {
    const weightKg = parseNumericValue(input.weightKg);
    const heightCm = parseNumericValue(input.heightCm);

    if (weightKg === null || heightCm === null) {
      throw new Error('Metric input is incomplete.');
    }

    return { weightKg, heightCm };
  }

  const weightLb = parseNumericValue(input.weightLb);
  const heightFt = parseNumericValue(input.heightFt);
  const heightIn = parseNumericValue(input.heightIn);

  if (weightLb === null || heightFt === null || heightIn === null) {
    throw new Error('Imperial input is incomplete.');
  }

  return {
    weightKg: weightLb * 0.45359237,
    heightCm: (heightFt * 12 + heightIn) * 2.54,
  };
}

export function calculateBmi(input: NormalizedMetricInput): number {
  const heightMeters = input.heightCm / 100;
  return input.weightKg / (heightMeters * heightMeters);
}

export function getBmiCategory(bmi: number): BmiCategoryInfo {
  if (bmi < 18.5) {
    return {
      category: 'Underweight',
      rangeLabel: 'Below 18.5',
      resultTitle: 'Below healthy range',
      tone: 'calm',
    };
  }

  if (bmi < 25) {
    return {
      category: 'Normal',
      rangeLabel: '18.5 - 24.9',
      resultTitle: "You're in a healthy range",
      tone: 'positive',
    };
  }

  if (bmi < 30) {
    return {
      category: 'Overweight',
      rangeLabel: '25.0 - 29.9',
      resultTitle: 'Slightly above range',
      tone: 'warm',
    };
  }

  return {
    category: 'Obesity',
    rangeLabel: '30.0 and above',
    resultTitle: 'Worth taking seriously',
    tone: 'alert',
  };
}

export function buildBmiResult(value: number): BmiResult {
  return {
    value: Number(value.toFixed(1)),
    disclaimer: BMI_DISCLAIMER,
    ...getBmiCategory(value),
  };
}
