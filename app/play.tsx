import { useEffect, useMemo, useState } from 'react';
import { Redirect, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PhoneFrame } from '@/components/PhoneFrame';
import { Button } from '@/components/ui';
import { QuestionView, RevealView, JournalView } from '@/components/eventViews';
import { eventsBefore, getDay } from '@/data/days';
import { applyEvents, balanceOf, buildBalanceSheet, formatYen } from '@/engine/ledger';
import { useGame } from '@/state/GameContext';
import { colors, font, space } from '@/theme';

type Phase = 'question' | 'reveal' | 'journal';

export default function Play() {
  const { state, recordAnswer, advance } = useGame();
  const [phase, setPhase] = useState<Phase>('question');
  const [selected, setSelected] = useState<string | null>(null);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);

  const day = state.currentDay;
  const dayDef = getDay(day);
  const events = dayDef?.events ?? [];
  const total = events.length;
  const idx = state.dayProgress[day] ?? 0;

  // reset per-event UI whenever we move to a new event / day
  useEffect(() => {
    setPhase('question');
    setSelected(null);
    setWasCorrect(null);
  }, [idx, day]);

  const priorEvents = useMemo(() => eventsBefore(day), [day]);
  const balancesBefore = useMemo(
    () => applyEvents([...priorEvents, ...events.slice(0, Math.min(idx, total))]),
    [priorEvents, events, idx, total],
  );
  const balancesAfter = useMemo(
    () => applyEvents([...priorEvents, ...events.slice(0, Math.min(idx + 1, total))]),
    [priorEvents, events, idx, total],
  );

  if (!state.hydrated) {
    return (
      <PhoneFrame scroll={false}>
        <View />
      </PhoneFrame>
    );
  }
  if (!dayDef) return <Redirect href="/" />;
  if (idx >= total) return <Redirect href="/settlement" />;

  const event = events[idx];
  const showingAfter = phase !== 'question';
  const balances = showingAfter ? balancesAfter : balancesBefore;
  const assets = buildBalanceSheet(balances).totalAssets;
  const cash = balanceOf(balances, 'cash');
  const isLast = idx === total - 1;

  const confirmAnswer = () => {
    if (!selected) return;
    const correct = selected === event.quiz.correctId;
    recordAnswer(event.id, correct);
    setWasCorrect(correct);
    setPhase('reveal');
  };

  let footer: React.ReactNode;
  if (phase === 'question') {
    footer = (
      <Button label="答えを確認する" onPress={confirmAnswer} disabled={!selected} />
    );
  } else if (phase === 'reveal') {
    footer = <Button label="仕訳を見る" onPress={() => setPhase('journal')} />;
  } else {
    footer = (
      <Button
        label={isLast ? '決算に進む' : '次の商売へ'}
        onPress={() => advance(day)}
      />
    );
  }

  return (
    <PhoneFrame footer={footer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.day}>
            DAY {day} ・ {event.scene}
          </Text>
          <Text style={styles.progress}>
            {idx + 1} / {total}
          </Text>
        </View>
        <Pressable style={styles.statusBtn} onPress={() => router.push('/status')}>
          <Text style={styles.statusBtnLabel}>会社の現在地</Text>
          <Text style={styles.statusBtnValue}>{formatYen(assets)}</Text>
        </Pressable>
      </View>
      <ProgressTicks total={total} index={idx} />

      {phase === 'question' && (
        <QuestionView event={event} selected={selected} onSelect={setSelected} />
      )}
      {phase === 'reveal' && <RevealView event={event} wasCorrect={wasCorrect} />}
      {phase === 'journal' && <JournalView event={event} cash={cash} />}
    </PhoneFrame>
  );
}

function ProgressTicks({ total, index }: { total: number; index: number }) {
  return (
    <View style={styles.ticks}>
      {Array.from({ length: total }).map((_, n) => (
        <View
          key={n}
          style={[
            styles.tick,
            n < index && styles.tickDone,
            n === index && styles.tickCurrent,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  day: { fontSize: font.small, fontWeight: '800', color: colors.textMuted },
  progress: { fontSize: font.h2, fontWeight: '900', color: colors.text },
  statusBtn: {
    alignItems: 'flex-end',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: space(2),
    paddingHorizontal: space(3),
  },
  statusBtnLabel: { fontSize: font.tiny, color: colors.textFaint, fontWeight: '700' },
  statusBtnValue: { fontSize: font.h3, fontWeight: '900', color: colors.primary },

  ticks: { flexDirection: 'row', gap: 3, flexWrap: 'wrap' },
  tick: {
    flex: 1,
    minWidth: 6,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  tickDone: { backgroundColor: colors.primarySoft },
  tickCurrent: { backgroundColor: colors.primary },
});
