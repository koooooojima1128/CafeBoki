import { useMemo } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { PhoneFrame } from '@/components/PhoneFrame';
import { Button, Card } from '@/components/ui';
import { DAYS, dayOfEvent, reachedEvents } from '@/data/days';
import type { BusinessEvent } from '@/engine/types';
import { formatYen } from '@/engine/ledger';
import { useGame } from '@/state/GameContext';
import { colors, font, space } from '@/theme';

export default function JournalBook() {
  const { state } = useGame();

  const byDay = useMemo(() => {
    const list = reachedEvents(state.completedDays, state.dayProgress);
    const map = new Map<number, BusinessEvent[]>();
    for (const e of list) {
      const d = dayOfEvent(e.id);
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(e);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [state.completedDays, state.dayProgress]);

  const totalEntries = byDay.reduce((s, [, evs]) => s + evs.length, 0);

  return (
    <PhoneFrame
      footer={
        <Button label="もどる" variant="secondary" onPress={() => router.back()} />
      }
    >
      <View style={styles.head}>
        <Text style={styles.title}>仕訳日記帳</Text>
        <Text style={styles.sub}>
          これまでにあなたがつくった仕訳 {totalEntries} 件。取引の記録の積み重ねが簿記です。
        </Text>
      </View>

      {byDay.length === 0 ? (
        <Card tone="soft">
          <Text style={styles.empty}>
            まだ仕訳がありません。DAY 1 から商売を始めましょう。
          </Text>
        </Card>
      ) : (
        byDay.map(([day, evs]) => (
          <View key={day} style={styles.daySection}>
            <Text style={styles.dayLabel}>
              DAY {day} ・ {DAYS.find((d) => d.day === day)?.title ?? ''}
            </Text>
            {evs.map((e) => (
              <Card key={e.id} style={styles.entry}>
                <Text style={styles.entryHead}>
                  {e.label} ・ {e.scene}
                </Text>
                {e.journal.map((l, i) => (
                  <View key={i} style={styles.line}>
                    <Text
                      style={[
                        styles.sideTag,
                        l.side === 'debit' ? styles.debitTag : styles.creditTag,
                      ]}
                    >
                      {l.side === 'debit' ? '借' : '貸'}
                    </Text>
                    <Text
                      style={[
                        styles.acct,
                        l.side === 'credit' && styles.acctIndent,
                      ]}
                    >
                      {l.label}
                    </Text>
                    <Text style={styles.amt}>{formatYen(l.amount)}</Text>
                  </View>
                ))}
              </Card>
            ))}
          </View>
        ))
      )}
    </PhoneFrame>
  );
}

const styles = StyleSheet.create({
  head: { gap: space(1), paddingTop: space(2) },
  title: { fontSize: font.h1, fontWeight: '900', color: colors.text },
  sub: { fontSize: font.small, color: colors.textMuted, lineHeight: 20 },
  empty: { fontSize: font.body, color: colors.textMuted, lineHeight: 22 },

  daySection: { gap: space(2) },
  dayLabel: {
    fontSize: font.small,
    fontWeight: '900',
    color: colors.textMuted,
    marginTop: space(1),
  },
  entry: { gap: space(1.5), padding: space(3.5) },
  entryHead: { fontSize: font.small, fontWeight: '800', color: colors.primary },
  line: { flexDirection: 'row', alignItems: 'center', gap: space(2) },
  sideTag: {
    fontSize: font.tiny,
    fontWeight: '900',
    width: 20,
    height: 20,
    borderRadius: 6,
    textAlign: 'center',
    lineHeight: 20,
    overflow: 'hidden',
  },
  debitTag: { backgroundColor: colors.debitBg, color: colors.debitText },
  creditTag: { backgroundColor: colors.creditBg, color: colors.creditText },
  acct: { flex: 1, fontSize: font.body, color: colors.text },
  acctIndent: { paddingLeft: space(3) },
  amt: {
    fontSize: font.body,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
});
