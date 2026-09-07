import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, space } from '@/theme';
import { formatYen } from '@/engine/ledger';
import type { JournalLine } from '@/engine/types';

/** SCREEN 04「簿記に翻訳すると」— the 仕訳, 借方 left / 貸方 right. */
export function JournalTable({ lines }: { lines: JournalLine[] }) {
  const debits = lines.filter((l) => l.side === 'debit');
  const credits = lines.filter((l) => l.side === 'credit');
  const rows = Math.max(debits.length, credits.length);

  return (
    <View style={styles.wrap}>
      <View style={styles.headRow}>
        <Text style={[styles.head, styles.debitHead]}>借方（かりかた）</Text>
        <Text style={[styles.head, styles.creditHead]}>貸方（かしかた）</Text>
      </View>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} style={styles.row}>
          <Cell line={debits[i]} tone="debit" />
          <Cell line={credits[i]} tone="credit" />
        </View>
      ))}
    </View>
  );
}

function Cell({
  line,
  tone,
}: {
  line?: JournalLine;
  tone: 'debit' | 'credit';
}) {
  const isDebit = tone === 'debit';
  return (
    <View
      style={[
        styles.cell,
        {
          backgroundColor: isDebit ? colors.debitBg : colors.creditBg,
          borderColor: isDebit ? colors.debitBorder : colors.creditBorder,
        },
      ]}
    >
      {line ? (
        <>
          <Text
            style={[
              styles.acct,
              { color: isDebit ? colors.debitText : colors.creditText },
            ]}
          >
            {line.label}
          </Text>
          <Text style={styles.amt}>{formatYen(line.amount)}</Text>
        </>
      ) : (
        <Text style={styles.empty}>—</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space(2) },
  headRow: { flexDirection: 'row', gap: space(2) },
  head: {
    flex: 1,
    fontSize: font.small,
    fontWeight: '800',
    textAlign: 'center',
  },
  debitHead: { color: colors.debitText },
  creditHead: { color: colors.creditText },
  row: { flexDirection: 'row', gap: space(2) },
  cell: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: space(3.5),
    paddingHorizontal: space(3),
    alignItems: 'center',
    gap: space(1),
    minHeight: 72,
    justifyContent: 'center',
  },
  acct: { fontSize: font.h3, fontWeight: '800' },
  amt: { fontSize: font.body, fontWeight: '700', color: colors.text },
  empty: { fontSize: font.body, color: colors.textFaint },
});
