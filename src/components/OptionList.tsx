import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, shadow, space } from '@/theme';
import type { QuizOption } from '@/engine/types';

interface Props {
  options: QuizOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  revealed?: boolean;
  correctId?: string;
}

export function OptionList({
  options,
  selectedId,
  onSelect,
  revealed = false,
  correctId,
}: Props) {
  return (
    <View style={styles.wrap}>
      {options.map((opt) => {
        const selected = opt.id === selectedId;
        const isCorrect = revealed && opt.id === correctId;
        const isWrongPick = revealed && selected && opt.id !== correctId;
        const active = (selected && !revealed) || isCorrect;

        return (
          <Pressable
            key={opt.id}
            disabled={revealed}
            onPress={() => onSelect(opt.id)}
            style={({ pressed }) => [
              styles.row,
              active ? shadow.sm : null,
              selected && !revealed ? styles.rowSelected : null,
              isCorrect ? styles.rowCorrect : null,
              isWrongPick ? styles.rowWrong : null,
              pressed && !revealed ? styles.rowPressed : null,
            ]}
          >
            <View
              style={[
                styles.bullet,
                selected && !revealed ? styles.bulletSelected : null,
                isCorrect ? styles.bulletFilled : null,
                isWrongPick ? styles.bulletWrong : null,
              ]}
            >
              {selected && !revealed && !isWrongPick ? (
                <View style={styles.bulletDot} />
              ) : null}
              {isCorrect ? <Text style={styles.mark}>✓</Text> : null}
              {isWrongPick ? <Text style={styles.mark}>×</Text> : null}
            </View>
            <Text style={styles.label}>{opt.label}</Text>
            {selected && !revealed ? (
              <Text style={styles.chev}>›</Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space(2.5) },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space(3),
    paddingVertical: space(4),
    paddingHorizontal: space(4),
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  rowPressed: { opacity: 0.9, transform: [{ scale: 0.995 }] },
  rowSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  rowCorrect: {
    borderColor: colors.correctBorder,
    backgroundColor: colors.correctBg,
  },
  rowWrong: { borderColor: colors.wrongBorder, backgroundColor: colors.wrongBg },

  bullet: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulletSelected: { borderColor: colors.primary },
  bulletDot: {
    width: 12,
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  bulletFilled: { borderColor: colors.primary, backgroundColor: colors.primary },
  bulletWrong: { borderColor: colors.negative, backgroundColor: colors.negative },
  mark: { color: '#fff', fontSize: font.small, fontWeight: '900' },

  label: { flex: 1, fontSize: font.body, color: colors.text, lineHeight: 21 },
  chev: { fontSize: font.h2, color: colors.primary, fontWeight: '800' },
});
