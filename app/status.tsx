import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { PhoneFrame } from '@/components/PhoneFrame';
import { Button } from '@/components/ui';
import { BalanceSheetView } from '@/components/Statements';
import { eventsBefore, getDay } from '@/data/days';
import { applyEvents } from '@/engine/ledger';
import { useGame } from '@/state/GameContext';
import { colors, font, space } from '@/theme';

/** 会社の現在地 — cumulative BS built from every confirmed transaction so far. */
export default function Status() {
  const { state } = useGame();
  const day = state.currentDay;
  const dayDef = getDay(day);
  const doneInDay = Math.min(
    state.dayProgress[day] ?? 0,
    dayDef?.events.length ?? 0,
  );
  const confirmed = [
    ...eventsBefore(day),
    ...(dayDef?.events.slice(0, doneInDay) ?? []),
  ];
  const balances = applyEvents(confirmed);

  return (
    <PhoneFrame
      footer={<Button label="とじる" variant="secondary" onPress={() => router.back()} />}
    >
      <View style={styles.head}>
        <Text style={styles.title}>☕ MY CAFE</Text>
        <Text style={styles.sub}>
          確定した取引：DAY {day} の {doneInDay} / {dayDef?.events.length ?? 0}
          {'　'}(これまでの累計)
        </Text>
      </View>

      <BalanceSheetView b={balances} />

      <Text style={styles.foot}>
        簿記は「いま会社がどうなっているか」を記録するもの。取引が進むたびに、この表が動きます。
      </Text>
    </PhoneFrame>
  );
}

const styles = StyleSheet.create({
  head: { gap: space(1), paddingTop: space(2) },
  title: { fontSize: font.h1, fontWeight: '900', color: colors.text },
  sub: { fontSize: font.small, color: colors.textMuted },
  foot: {
    fontSize: font.small,
    color: colors.textFaint,
    lineHeight: 20,
    paddingTop: space(2),
  },
});
