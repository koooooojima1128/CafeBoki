import { Platform } from 'react-native';

/**
 * Design tokens for カフェ簿記.
 * Fresh, cool palette: bright sea-teal primary, cool near-white ground,
 * soft floating cards, pastel category tints, orange affiliate CTA.
 */
export const colors = {
  bg: '#F2F6F7',
  surface: '#FFFFFF',
  surfaceAlt: '#EAF3F2',

  primary: '#2E9E97',
  primaryDark: '#237E79',
  primarySoft: '#DBF0EE',

  text: '#1C2B29',
  textMuted: '#5B6B69',
  textFaint: '#9AA7A5',
  border: '#E5ECEC',
  borderStrong: '#CCD9D8',

  // 借方 (debit) — blue set
  debitBg: '#E7F1FB',
  debitBorder: '#C4DAF4',
  debitText: '#2C63C6',

  // 貸方 (credit) — teal-green set
  creditBg: '#E1F4EE',
  creditBorder: '#B4E3D3',
  creditText: '#1F8C7E',

  positive: '#1E9C88',
  negative: '#E0664C',
  accent: '#F2894C',
  accentDark: '#DB7331',

  correctBg: '#E2F5EE',
  correctBorder: '#8AD3BC',
  wrongBg: '#FCEDE7',
  wrongBorder: '#F1BCAA',
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

export const space = (n: number) => n * 4;

export const font = {
  h0: 30,
  h1: 27,
  h2: 20,
  h3: 17,
  body: 15,
  small: 13,
  tiny: 11,
} as const;

/**
 * Font families. Rounded gothic (M PLUS Rounded 1c) everywhere.
 * Web pulls it from Google Fonts (see app/+html.tsx); native bundles the
 * .ttf files (see app/_layout.tsx). `bold` maps to the ExtraBold face on
 * native; on web the same family name resolves the weight via CSS.
 */
export const ff = {
  regular: (Platform.select({
    web: "'M PLUS Rounded 1c', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    default: 'MPLUSRounded1c',
  }) ?? 'System') as string,
  bold: (Platform.select({
    web: "'M PLUS Rounded 1c', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    default: 'MPLUSRounded1cExtraBold',
  }) ?? 'System') as string,
};

/** Soft elevation for cards / floating elements. */
export const shadow = {
  sm: (Platform.select({
    web: { boxShadow: '0 2px 8px rgba(20,45,45,0.05)' },
    default: {
      shadowColor: '#12302C',
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
  }) ?? {}) as object,
  card: (Platform.select({
    web: { boxShadow: '0 10px 28px rgba(20,45,45,0.08)' },
    default: {
      shadowColor: '#12302C',
      shadowOpacity: 0.1,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
    },
  }) ?? {}) as object,
};

/** Pastel styling per 会社の変化 category. */
export const categoryStyle: Record<
  string,
  { bg: string; border: string; label: string }
> = {
  資産: { bg: '#E7F5EF', border: '#BEE4D5', label: '#1E9C88' },
  負債: { bg: '#FCEEE8', border: '#F1C9B8', label: '#D9702F' },
  純資産: { bg: '#E9F1FB', border: '#C7DBF6', label: '#2C63C6' },
  収益: { bg: '#E7F5EF', border: '#BEE4D5', label: '#1E9C88' },
  費用: { bg: '#FCECE6', border: '#F1C4B2', label: '#D9654B' },
  '資産(−)': { bg: '#F0F1F3', border: '#D9DBDF', label: '#6A6B76' },
};

export function catStyle(category: string) {
  return categoryStyle[category] ?? categoryStyle['資産'];
}

/** Max width of the phone column when rendered on the web. */
export const PHONE_MAX_WIDTH = 430;
