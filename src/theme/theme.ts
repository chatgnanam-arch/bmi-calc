import type { ResultTone } from '../types/bmi';

type ThemeName = 'light' | 'dark';

type GradientTriple = readonly [string, string, string];
type GradientPair = readonly [string, string];

export interface AppTheme {
  name: ThemeName;
  statusBarStyle: 'light' | 'dark';
  fonts: {
    display: string;
    body: string;
    medium: string;
    strong: string;
  };
  radii: {
    card: number;
    pill: number;
    input: number;
  };
  colors: {
    background: string;
    surface: string;
    surfaceStrong: string;
    text: string;
    mutedText: string;
    primary: string;
    primaryStrong: string;
    accent: string;
    border: string;
    divider: string;
    input: string;
    error: string;
    glowPrimary: string;
    glowSecondary: string;
    onPrimary: string;
  };
  gradients: {
    background: GradientTriple;
    card: GradientPair;
  };
  resultTones: Record<ResultTone, { chip: string; accent: string }>;
}

const sharedFonts = {
  display: 'PlayfairDisplay_700Bold',
  body: 'Outfit_400Regular',
  medium: 'Outfit_600SemiBold',
  strong: 'Outfit_700Bold',
};

const lightTheme: AppTheme = {
  name: 'light',
  statusBarStyle: 'dark',
  fonts: sharedFonts,
  radii: {
    card: 28,
    pill: 999,
    input: 20,
  },
  colors: {
    background: '#f5efe7',
    surface: '#fff8f1',
    surfaceStrong: '#f1e1cf',
    text: '#201712',
    mutedText: '#6b5950',
    primary: '#1d6e6a',
    primaryStrong: '#154f4d',
    accent: '#ef9d57',
    border: '#dcc9b4',
    divider: '#eadbc9',
    input: '#fffdf9',
    error: '#ba5a54',
    glowPrimary: 'rgba(29, 110, 106, 0.18)',
    glowSecondary: 'rgba(239, 157, 87, 0.22)',
    onPrimary: '#fffaf4',
  },
  gradients: {
    background: ['#fff6e8', '#f6ebe1', '#e4f2ec'],
    card: ['#fffdf7', '#f7efe5'],
  },
  resultTones: {
    calm: { chip: '#d7edf4', accent: '#3d7f97' },
    positive: { chip: '#dbefe7', accent: '#2a7f67' },
    warm: { chip: '#fde4c8', accent: '#bc7a2c' },
    alert: { chip: '#f9d6d4', accent: '#b65652' },
  },
};

const darkTheme: AppTheme = {
  name: 'dark',
  statusBarStyle: 'light',
  fonts: sharedFonts,
  radii: {
    card: 28,
    pill: 999,
    input: 20,
  },
  colors: {
    background: '#11191d',
    surface: '#18252a',
    surfaceStrong: '#22343a',
    text: '#f6eee6',
    mutedText: '#a2b2b4',
    primary: '#79d8cb',
    primaryStrong: '#4fb9aa',
    accent: '#f6b06a',
    border: '#284046',
    divider: '#274148',
    input: '#132126',
    error: '#f49e98',
    glowPrimary: 'rgba(121, 216, 203, 0.14)',
    glowSecondary: 'rgba(246, 176, 106, 0.14)',
    onPrimary: '#0f181a',
  },
  gradients: {
    background: ['#102128', '#1b2f36', '#102723'],
    card: ['#1a2a31', '#142228'],
  },
  resultTones: {
    calm: { chip: '#183946', accent: '#7ac6df' },
    positive: { chip: '#17352d', accent: '#81d7b1' },
    warm: { chip: '#3a2a1c', accent: '#f3bf80' },
    alert: { chip: '#412528', accent: '#f4a7a1' },
  },
};

export function getAppTheme(mode: ThemeName): AppTheme {
  return mode === 'dark' ? darkTheme : lightTheme;
}
