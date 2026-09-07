import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { colors, font, radius, space } from '@/theme';

/* ------------------------------------------------------------------ Button */

type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
}: ButtonProps) {
  const v = BTN[variant];
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: v.bg, borderColor: v.border },
        pressed && !disabled ? styles.btnPressed : null,
        disabled ? styles.btnDisabled : null,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <Text style={[styles.btnLabel, { color: v.fg }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const BTN: Record<ButtonVariant, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.primary, fg: '#fff', border: colors.primary },
  accent: { bg: colors.accent, fg: '#fff', border: colors.accent },
  secondary: {
    bg: colors.primarySoft,
    fg: colors.primaryDark,
    border: colors.primarySoft,
  },
  ghost: { bg: 'transparent', fg: colors.textMuted, border: 'transparent' },
};

/* -------------------------------------------------------------------- Card */

export function Card({
  children,
  style,
  tone = 'plain',
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  tone?: 'plain' | 'soft';
}) {
  return (
    <View
      style={[
        styles.card,
        tone === 'soft' ? { backgroundColor: colors.surfaceAlt } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

/* -------------------------------------------------------------- ProgressBar */

export function ProgressBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${pct * 100}%` }]} />
    </View>
  );
}

/* --------------------------------------------------------------------- Chip */

export function Chip({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'neutral' | 'debit' | 'credit' | 'good' | 'bad';
}) {
  const c = CHIP[tone];
  return (
    <View style={[styles.chip, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={[styles.chipText, { color: c.fg }]}>{label}</Text>
    </View>
  );
}

const CHIP = {
  neutral: { bg: colors.surfaceAlt, border: colors.border, fg: colors.textMuted },
  debit: { bg: colors.debitBg, border: colors.debitBorder, fg: colors.debitText },
  credit: {
    bg: colors.creditBg,
    border: colors.creditBorder,
    fg: colors.creditText,
  },
  good: { bg: colors.correctBg, border: colors.correctBorder, fg: colors.primaryDark },
  bad: { bg: colors.wrongBg, border: colors.wrongBorder, fg: colors.negative },
};

/* ------------------------------------------------------------------ misc */

export function Divider() {
  return <View style={styles.divider} />;
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

const styles = StyleSheet.create({
  btn: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space(5),
  },
  btnPressed: { opacity: 0.85 },
  btnDisabled: { opacity: 0.4 },
  btnLabel: { fontSize: font.h3, fontWeight: '700' },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space(4),
    gap: space(3),
  },

  track: {
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },

  chip: {
    paddingHorizontal: space(2.5),
    paddingVertical: space(1),
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  chipText: { fontSize: font.tiny, fontWeight: '700' },

  divider: { height: 1, backgroundColor: colors.border, marginVertical: space(1) },

  sectionLabel: {
    fontSize: font.small,
    fontWeight: '700',
    color: colors.textMuted,
  },
});
