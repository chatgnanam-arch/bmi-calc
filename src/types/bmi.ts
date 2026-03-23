export type UnitSystem = 'metric' | 'imperial';

export type ThemeMode = 'light' | 'dark' | 'system';

export type BmiCategory = 'Underweight' | 'Normal' | 'Overweight' | 'Obesity';

export type ResultTone = 'calm' | 'positive' | 'warm' | 'alert';

export interface CalculatorInput {
  weightKg: string;
  heightCm: string;
  weightLb: string;
  heightFt: string;
  heightIn: string;
}

export interface NormalizedMetricInput {
  weightKg: number;
  heightCm: number;
}

export interface BmiCategoryInfo {
  category: BmiCategory;
  rangeLabel: string;
  resultTitle: string;
  tone: ResultTone;
}

export interface BmiResult extends BmiCategoryInfo {
  value: number;
  disclaimer: string;
}

export type ValidationErrors = Partial<Record<keyof CalculatorInput, string>>;

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
}

export interface AppSettings {
  unitSystem: UnitSystem;
  themeMode: ThemeMode;
}
