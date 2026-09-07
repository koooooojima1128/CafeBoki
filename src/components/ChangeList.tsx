import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, space } from '@/theme';
import { signedYen } from '@/engine/ledger';
import type { EconomicChange } from '@/engine/types';

/** SCREEN 03「会社の変化」— what moved inside the company, in plain terms. */
export function ChangeList({ changes }: { changes: EconomicChange[] }) {
  return (
    <View style={styles.wrap}>
      {changes.map((c) => {
        const up = c.delta >= 0;
        return (
          <View key={c.accountId + c.category} style={styles.row}>
            <View style={styles.left}>
              <Text style={styles.name}>{c.label}</Text>
              <Text style={styles.cat}>{c.category}</Text>
            </View>
            <Text style={[styles.amount, up ? styles.up : styles.down]}>
              {signedYen(c.delta)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space(2) },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: space(3.5),
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  left: { gap: space(0.5) },
  name: { fontSize: font.h3, fontWeight: '700', color: colors.text },
  cat: { fontSize: font.tiny, fontWeight: '700', color: colors.textFaint },
  amount: { fontSize: font.h3, fontWeight: '800' },
  up: { color: colors.positive },
  down: { color: colors.negative },
});
