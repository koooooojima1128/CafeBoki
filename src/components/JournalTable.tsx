import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, space } from '@/theme';
import { formatYen } from '@/engine/ledger';
import type { JournalLine } from '@/engine/types';

// 借方 = teal-green, 貸方 = blue (matches the design mockups)
const DR = { bg: colors.creditBg, border: colors.creditBorder, text: colors.creditText };
const CR = { bg: colors.debitBg, border: colors.debitBorder, text: colors.debitText };

/** SCREEN 04「簿記に翻訳すると」— the 仕訳, 借方 left / 貸方 right. */
export function JournalTable({ lines }: { lines: JournalLine[] }) {
  const debits = lines.filter((l) => l.side === 'debit');
  const credits = lines.filter((l) => l.side === 'credit');
  const rows = Math.max(debits.length, credits.length);

  return (
    <View style={styles.wrap}>
      <View style={styles.headRow}>
        <View style={styles.headCol}>
          <View style={[styles.pill, { backgroundColor: DR.bg, borderColor: DR.border }]}>
            <Text style={[styles.pillText, { color: DR.text }]}>借方（かりかた）</Text>
          </View>
        </View>
        <View style={styles.headCol}>
          <View style={[styles.pill, { backgroundColor: CR.bg, borderColor: CR.border }]}>
            <Text style={[styles.pillText, { color: CR.text }]}>貸方（かしかた）</Text>
          </View>
        </View>
      </View>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} style={styles.row}>
          <Cell line={debits[i]} c={DR} />
          <Cell line={credits[i]} c={CR} />
        </View>
      ))}
    </View>
  );
}

function Cell({
  line,
  c,
}: {
  line?: JournalLine;
  c: { bg: string; border: string; text: string };
}) {
  return (
    <View style={[styles.cell, { borderColor: c.border }]}>
      <View style={[styles.accent, { backgroundColor: c.text }]} />
      {line ? (
        <View style={styles.cellBody}>
          <Text style={[styles.acct, { color: c.text }]}>{line.label}</Text>
          <Text style={styles.amt}>{formatYen(line.amount)}</Text>
        </View>
      ) : (
        <Text style={styles.empty}>—</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space(2) },
  headRow: { flexDirection: 'row', gap: space(2.5) },
  headCol: { flex: 1, alignItems: 'flex-start' },
  pill: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: space(3),
    paddingVertical: space(1),
  },
  pillText: { fontSize: font.tiny, fontWeight: '900' },

  row: { flexDirection: 'row', gap: space(2.5) },
  cell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    minHeight: 74,
  },
  accent: { width: 4, alignSelf: 'stretch' },
  cellBody: {
    flex: 1,
    paddingVertical: space(3),
    paddingHorizontal: space(3.5),
    gap: space(0.5),
  },
  acct: { fontSize: font.h3, fontWeight: '900' },
  amt: {
    fontSize: font.body,
    fontWeight: '800',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  empty: { flex: 1, textAlign: 'center', fontSize: font.body, color: colors.textFaint },
});
