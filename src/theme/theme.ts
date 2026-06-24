export interface ThemeColors {
  background: string;
  surface: string;
  surfaceLight: string;
  primary: string;
  primaryDull: string;
  text: string;
  textMuted: string;
  textSecondary: string;
  priorityHigh: string;
  priorityMedium: string;
  priorityLow: string;
  white: string;
  black: string;
  transparent: string;
}

export const darkTheme: ThemeColors = {
  background: '#0D0D0D',
  surface: '#171717',
  surfaceLight: '#262626',
  primary: '#00E5CC',
  primaryDull: '#004D45',
  text: '#FFFFFF',
  textMuted: '#888888',
  textSecondary: '#CCCCCC',
  priorityHigh: '#FF4D4D',
  priorityMedium: '#FFD700',
  priorityLow: '#4DFF88',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const lightTheme: ThemeColors = {
  background: '#F5F5F5',
  surface: '#FFFFFF',
  surfaceLight: '#EEEEEE',
  primary: '#00BFA5',
  primaryDull: '#80CBC4',
  text: '#1A1A1A',
  textMuted: '#999999',
  textSecondary: '#666666',
  priorityHigh: '#E53935',
  priorityMedium: '#F9A825',
  priorityLow: '#43A047',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
