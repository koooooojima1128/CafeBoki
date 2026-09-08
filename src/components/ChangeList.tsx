import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { catStyle, colors, ff, font, radius, space } from '@/theme';
import { signedYen } from '@/engine/ledger';
import type { EconomicChange } from '@/engine/types';

/** SCREEN 03「会社の変化」— what moved inside the company, as pastel cards. */
export function ChangeList({ changes }: { changes: EconomicChange[] }) {
  return (
    <View style={styles.wrap}>
      {changes.map((c) => {
        const cs = catStyle(c.category);
        const up = c.delta >= 0;
        return (
          <View
            key={c.accountId + c.category}
            style={[styles.card, { backgroundColor: cs.bg, borderColor: cs.border }]}
          >
            <Text style={styles.name}>{c.label}</Text>
            <Text
              style={[styles.amount, { color: up ? colors.positive : colors.negative }]}
            >
              {signedYen(c.delta)}
            </Text>
            <Text style={[styles.cat, { color: cs.label }]}>（{c.category}）</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space(2.5) },
  card: {
    flexGrow: 1,
    flexBasis: '44%',
    minWidth: 130,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: space(3.5),
    gap: space(1),
  },
  name: { fontSize: font.small, fontWeight: '800', color: colors.text },
  amount: { fontSize: font.h2, fontFamily: ff.bold, fontWeight: '900' },
  cat: { fontSize: font.tiny, fontWeight: '700' },
});
