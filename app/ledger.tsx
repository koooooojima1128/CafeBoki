import { useMemo } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PhoneFrame } from '@/components/PhoneFrame';
import { Button, Card } from '@/components/ui';
import { dayOfEvent, reachedEvents } from '@/data/days';
import { ACCOUNTS, accountNormalSide } from '@/engine/accounts';
import { formatYen } from '@/engine/ledger';
import { useGame } from '@/state/GameContext';
import { colors, font, space } from '@/theme';

interface Posting {
  day: number;
  side: 'debit' | 'credit';
  amount: number;
  counterpart: string;
}

export default function Ledger() {
  const { acct } = useLocalSearchParams<{ acct?: string }>();
  const { state } = useGame();

  const events = useMemo(
    () => reachedEvents(state.completedDays, state.dayProgress),
    [state.completedDays, state.dayProgress],
  );

  // which accounts have any postings
  const usedIds = useMemo(() => {
    const s = new Set<string>();
    for (const e of events) for (const l of e.journal) s.add(l.accountId);
    return [...s].filter((id) => ACCOUNTS[id]);
  }, [events]);

  if (!acct || !ACCOUNTS[acct]) {
    return (
      <PhoneFrame
        footer={<Button label="もどる" variant="secondary" onPress={() => router.back()} />}
      >
        <View style={styles.head}>
          <Text style={styles.title}>総勘定元帳（T字）</Text>
          <Text style={styles.sub}>
            勘定をえらぶと、その勘定への記入をT字で見られます。
          </Text>
        </View>
        <View style={styles.pickWrap}>
          {usedIds.length === 0 ? (
            <Card tone="soft">
              <Text style={styles.empty}>まだ記入がありません。</Text>
            </Card>
          ) : (
            usedIds.map((id) => (
              <Pressable
                key={id}
                style={styles.pick}
                onPress={() => router.setParams({ acct: id })}
              >
                <Text style={styles.pickText}>{ACCOUNTS[id].name}</Text>
              </Pressable>
            ))
          )}
        </View>
      </PhoneFrame>
    );
  }

  const def = ACCOUNTS[acct];
  const postings: Posting[] = [];
  for (const e of events) {
    const mine = e.journal.filter((l) => l.accountId === acct);
    if (mine.length === 0) continue;
    const others = e.journal
      .filter((l) => l.accountId !== acct)
      .map((l) => l.label);
    const counterpart =
      others.length === 1 ? others[0] : others.length ? '諸口' : '—';
    for (const l of mine) {
      postings.push({ day: dayOfEvent(e.id), side: l.side, amount: l.amount, counterpart });
    }
  }

  const debits = postings.filter((p) => p.side === 'debit');
  const credits = postings.filter((p) => p.side === 'credit');
  const dSum = debits.reduce((s, p) => s + p.amount, 0);
  const cSum = credits.reduce((s, p) => s + p.amount, 0);
  const normal = accountNormalSide(def);
  const net = normal === 'debit' ? dSum - cSum : cSum - dSum;
  const rows = Math.max(debits.length, credits.length);

  return (
    <PhoneFrame
      footer={
        <View style={{ gap: space(2) }}>
          <Button
            label="別の勘定をみる"
            variant="secondary"
            onPress={() => router.setParams({ acct: '' })}
          />
          <Button label="もどる" variant="ghost" onPress={() => router.back()} />
        </View>
      }
    >
      <View style={styles.head}>
        <Text style={styles.title}>{def.name}</Text>
        <Text style={styles.sub}>
          T字の左が借方、右が貸方。{normal === 'debit' ? '借方' : '貸方'}
          側に残高が出る勘定です。
        </Text>
      </View>

      <Card>
        <View style={styles.tHead}>
          <Text style={[styles.tHeadCell, { color: colors.debitText }]}>借方</Text>
          <Text style={styles.tDivider}>{def.name}</Text>
          <Text style={[styles.tHeadCell, { color: colors.creditText }]}>貸方</Text>
        </View>
        {Array.from({ length: rows }).map((_, i) => (
          <View key={i} style={styles.tRow}>
            <View style={styles.tCell}>
              {debits[i] ? (
                <Text style={styles.tText}>
                  D{debits[i].day} {debits[i].counterpart}{' '}
                  <Text style={styles.tAmt}>{formatYen(debits[i].amount)}</Text>
                </Text>
              ) : null}
            </View>
            <View style={styles.tLine} />
            <View style={styles.tCell}>
              {credits[i] ? (
                <Text style={styles.tText}>
                  D{credits[i].day} {credits[i].counterpart}{' '}
                  <Text style={styles.tAmt}>{formatYen(credits[i].amount)}</Text>
                </Text>
              ) : null}
            </View>
          </View>
        ))}
        <View style={styles.tRule} />
        <View style={styles.tRow}>
          <Text style={[styles.tCell, styles.tText, styles.tStrong]}>
            借方合計 {formatYen(dSum)}
          </Text>
          <View style={styles.tLine} />
          <Text style={[styles.tCell, styles.tText, styles.tStrong]}>
            貸方合計 {formatYen(cSum)}
          </Text>
        </View>
      </Card>

      <View style={styles.balanceBox}>
        <Text style={styles.balanceLabel}>残高</Text>
        <Text style={styles.balanceValue}>{formatYen(net)}</Text>
      </View>
    </PhoneFrame>
  );
}

const styles = StyleSheet.create({
  head: { gap: space(1), paddingTop: space(2) },
  title: { fontSize: font.h1, fontWeight: '900', color: colors.text },
  sub: { fontSize: font.small, color: colors.textMuted, lineHeight: 20 },
  empty: { fontSize: font.body, color: colors.textMuted },

  pickWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space(2) },
  pick: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: space(3.5),
    paddingVertical: space(2),
  },
  pickText: { fontSize: font.small, fontWeight: '700', color: colors.text },

  tHead: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.borderStrong,
    paddingBottom: space(1),
  },
  tHeadCell: { flex: 1, fontSize: font.small, fontWeight: '900', textAlign: 'center' },
  tDivider: {
    fontSize: font.tiny,
    fontWeight: '800',
    color: colors.textFaint,
    paddingHorizontal: space(2),
  },
  tRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 3 },
  tCell: { flex: 1, paddingHorizontal: space(1) },
  tLine: { width: 1, alignSelf: 'stretch', backgroundColor: colors.borderStrong },
  tText: { fontSize: font.small, color: colors.text },
  tAmt: { fontWeight: '800', fontVariant: ['tabular-nums'] },
  tStrong: { fontWeight: '800' },
  tRule: { height: 1, backgroundColor: colors.border, marginVertical: space(1) },

  balanceBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    paddingVertical: space(3),
    paddingHorizontal: space(4),
  },
  balanceLabel: { fontSize: font.small, fontWeight: '800', color: colors.primaryDark },
  balanceValue: { fontSize: font.h2, fontWeight: '900', color: colors.primaryDark },
});
