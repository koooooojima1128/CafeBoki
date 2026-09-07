/**
 * Design tokens for カフェ簿記.
 * Palette pulled from the MVP mockup: deep teal primary, warm cream ground,
 * blue-tinted 借方 / green-tinted 貸方, orange affiliate CTA.
 */
export const colors = {
  bg: '#F4EFE6',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF3F1',

  primary: '#2E7D6B',
  primaryDark: '#245B4F',
  primarySoft: '#D9EAE4',

  text: '#1E2A27',
  textMuted: '#6B7A75',
  textFaint: '#98A39E',
  border: '#E6DECC',
  borderStrong: '#D8CEB6',

  // 借方 (debit) — left / blue tint
  debitBg: '#E9F0FD',
  debitBorder: '#C6D8F5',
  debitText: '#2C56A6',

  // 貸方 (credit) — right / green tint
  creditBg: '#E5F2EC',
  creditBorder: '#BFE0D0',
  creditText: '#2E7D6B',

  positive: '#2E7D6B',
  negative: '#C15540',
  accent: '#E8834E',
  accentDark: '#CE6C3A',

  correctBg: '#E5F2EC',
  correctBorder: '#7FBFA6',
  wrongBg: '#FBEAE4',
  wrongBorder: '#E0A996',
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 26,
  pill: 999,
} as const;

export const space = (n: number) => n * 4;

export const font = {
  h1: 26,
  h2: 20,
  h3: 17,
  body: 15,
  small: 13,
  tiny: 11,
} as const;

/** Max width of the phone column when rendered on the web. */
export const PHONE_MAX_WIDTH = 430;
