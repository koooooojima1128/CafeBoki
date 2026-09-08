import { useState } from 'react';
import { Redirect, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PhoneFrame } from '@/components/PhoneFrame';
import { Button } from '@/components/ui';
import {
  BalanceSheetView,
  IncomeStatementView,
  TrialBalanceView,
} from '@/components/Statements';
import { balancesThrough, dayProfit, getDay } from '@/data/days';
import { applyEvents, formatYen } from '@/engine/ledger';
import { useGame } from '@/state/GameContext';
import { colors, ff, font, radius, shadow, space } from '@/theme';

type Tab = 'pl' | 'bs' | 'tb';

/** 決算 — this day's PL, the cumulative BS, and the cumulative trial balance. */
export default function Settlement() {
  const { state } = useGame();
  const day = state.currentDay;
  const dayDef = getDay(day);

  const [tab, setTab] = useState<Tab>('pl');

  if (!state.hydrated) {
    return (
      <PhoneFrame scroll={false}>
        <View />
      </PhoneFrame>
    );
  }
  if (!dayDef) return <Redirect href="/" />;

  const dayBalances = applyEvents(dayDef.events); // this day's flows only
  const cumulative = balancesThrough(day); // BS / TB are cumulative
  const profit = dayProfit(day);
  const closing = !!dayDef.closing;
  // on the closing day there is no per-day PL, so fall back to BS
  const view: Tab = closing && tab === 'pl' ? 'bs' : tab;

  return (
    <PhoneFrame
      footer={
        <Button
          label={closing ? '帳簿を締めた ― まとめを見る' : '今日のまとめを見る'}
          onPress={() => router.replace('/clear')}
        />
      }
    >
      <View style={styles.head}>
        <Text style={styles.title}>
          {closing ? '帳簿の締め' : `DAY ${day} の決算`}
        </Text>
        <Text style={styles.sub}>
          {closing
            ? 'すべての決算振替が終わり、資産・負債・純資産だけが来期へ繰り越されます。'
            : `この日の ${dayDef.events.length} 個の取引（仕訳）を集めると、今日の成績と会社の現在地になります。`}
        </Text>
      </View>

      {!closing && (
        <View style={styles.profitCard}>
          <Text style={styles.profitLabel}>DAY {day} の利益</Text>
          <Text style={styles.profitValue}>{formatYen(profit)}</Text>
          <Text style={styles.profitNote}>
            売上から仕入・経費を引いたもの。現金そのものの残高とは別です。
          </Text>
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        {!closing && (
          <Tab
            label={`損益計算書 PL（DAY ${day}）`}
            active={view === 'pl'}
            onPress={() => setTab('pl')}
          />
        )}
        <Tab
          label={closing ? '貸借対照表 BS（期末）' : '貸借対照表 BS（累計）'}
          active={view === 'bs'}
          onPress={() => setTab('bs')}
        />
        <Tab
          label={closing ? '繰越試算表' : '残高試算表（累計）'}
          active={view === 'tb'}
          onPress={() => setTab('tb')}
        />
      </ScrollView>

      {view === 'pl' && !closing && <IncomeStatementView b={dayBalances} />}
      {view === 'bs' && <BalanceSheetView b={cumulative} />}
      {view === 'tb' && <TrialBalanceView b={cumulative} />}
    </PhoneFrame>
  );
}

function Tab({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  head: { gap: space(2), paddingTop: space(2) },
  title: { fontSize: font.h1, fontFamily: ff.bold, fontWeight: '900', color: colors.text },
  sub: { fontSize: font.body, color: colors.textMuted, lineHeight: 23 },

  profitCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: space(5),
    gap: space(1.5),
    ...shadow.card,
  },
  profitLabel: { fontSize: font.small, fontWeight: '800', color: '#CDECE8' },
  profitValue: { fontSize: 34, fontFamily: ff.bold, fontWeight: '900', color: '#fff' },
  profitNote: { fontSize: font.small, color: '#DBEFEC', lineHeight: 20 },

  tabs: { flexDirection: 'row', gap: space(2), paddingVertical: space(1) },
  tab: {
    paddingVertical: space(2.5),
    paddingHorizontal: space(4),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadow.sm,
  },
  tabText: {
    fontSize: font.tiny,
    fontFamily: ff.bold,
    fontWeight: '800',
    color: colors.textMuted,
  },
  tabTextActive: { color: '#fff' },
});
