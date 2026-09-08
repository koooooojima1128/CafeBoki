import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PhoneFrame } from '@/components/PhoneFrame';
import { HeroImage } from '@/components/HeroImage';
import { Button, Card, ProgressBar } from '@/components/ui';
import { ALL_EVENT_IDS, DAYS, FIRST_DAY } from '@/data/days';
import { overallStats, streakDays } from '@/score';
import { useGame } from '@/state/GameContext';
import { colors, ff, font, radius, shadow, space } from '@/theme';

export default function Home() {
  const { state, openDay } = useGame();

  const answered = ALL_EVENT_IDS.filter((id) => id in state.answers).length;
  const correct = ALL_EVENT_IDS.filter((id) => state.answers[id]).length;
  const pct = answered ? correct / answered : 0;
  const started = answered > 0 || state.completedDays.length > 0;
  const stats = overallStats(state.answers, state.completedDays);
  const streak = streakDays(state.completedAt, state.lastPlayedAt);

  const nextDay =
    DAYS.find(
      (d) =>
        !state.completedDays.includes(d.day) &&
        (d.day === FIRST_DAY || state.completedDays.includes(d.day - 1)),
    )?.day ?? FIRST_DAY;

  const start = (day: number) => {
    openDay(day);
    router.push('/play');
  };

  return (
    <PhoneFrame tab="home">
      <HeroImage
        title="カフェ簿記"
        tagline={'簿記という言語を、\n商売を通して理解するシミュレーター'}
      />

      <View style={styles.ctaWrap}>
        <Button
          label={started ? `DAY ${nextDay} をつづける` : 'カフェを始める'}
          onPress={() => start(started ? nextDay : FIRST_DAY)}
        />
      </View>

      <Card>
        <View style={styles.meterTop}>
          <Text style={styles.meterLabel}>あなたの簿記理解度</Text>
          <Text style={styles.meterPct}>{Math.round(pct * 100)}%</Text>
        </View>
        <ProgressBar value={pct} />
        <Text style={styles.meterSub}>
          {started
            ? `スコア ${stats.score}点 ・ ${state.completedDays.length}/${DAYS.length} DAY クリア`
            : 'まだ始めていません'}
        </Text>
        {streak > 0 ? (
          <Text style={styles.streak}>🔥 {streak}日連続で学習中</Text>
        ) : null}
      </Card>

      <Pressable
        style={({ pressed }) => [styles.introCard, pressed && { opacity: 0.85 }]}
        onPress={() => router.push('/onboarding')}
      >
        <Text style={styles.introEmoji}>🧭</Text>
        <View style={styles.introBody}>
          <Text style={styles.introTitle}>はじめての方へ</Text>
          <Text style={styles.introSub}>
            このアプリの使い方を簡単にご説明します
          </Text>
        </View>
        <Text style={styles.introChev}>›</Text>
      </Pressable>

      <Text style={styles.sectionLabel}>DAY をえらぶ</Text>
      <View style={{ gap: space(2.5) }}>
        {DAYS.map((d) => {
          const locked =
            d.day > FIRST_DAY && !state.completedDays.includes(d.day - 1);
          const done = state.completedDays.includes(d.day);
          const progress = state.dayProgress[d.day] ?? 0;
          const inProgress = !done && progress > 0;

          const ids = d.events.map((e) => e.id);
          const dayAnswered = ids.filter((id) => id in state.answers).length;
          const dayCorrect = ids.filter((id) => state.answers[id]).length;

          return (
            <Pressable
              key={d.day}
              disabled={locked}
              onPress={() => start(d.day)}
              style={({ pressed }) => [
                styles.dayCard,
                done && styles.dayCardDone,
                locked && styles.dayCardLocked,
                pressed && !locked && styles.dayCardPressed,
              ]}
            >
              <View style={styles.dayTop}>
                <Text style={[styles.dayNo, locked && styles.mutedText]}>
                  DAY {d.day}
                </Text>
                <Text style={styles.dayStatus}>
                  {locked
                    ? '🔒 前の DAY をクリアで解放'
                    : done
                      ? `✓ クリア（${dayCorrect}/${dayAnswered || d.events.length}）`
                      : inProgress
                        ? `▶ つづき（${progress}/${d.events.length}）`
                        : `▶ ${d.events.length} イベント`}
                </Text>
              </View>
              <Text style={[styles.dayTitle, locked && styles.mutedText]}>
                {d.title}
              </Text>
              {!locked && (
                <Text style={styles.daySub} numberOfLines={2}>
                  {d.subtitle}
                </Text>
              )}
              <View style={styles.chips}>
                {d.focus.map((f) => (
                  <View key={f} style={styles.chip}>
                    <Text style={styles.chipText}>{f}</Text>
                  </View>
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>
    </PhoneFrame>
  );
}

const styles = StyleSheet.create({
  ctaWrap: { marginTop: -space(7), paddingHorizontal: space(2) },

  meterTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meterLabel: { fontSize: font.small, fontWeight: '700', color: colors.textMuted },
  meterPct: { fontSize: font.h2, fontFamily: ff.bold, fontWeight: '900', color: colors.primary },
  meterSub: { fontSize: font.small, color: colors.textFaint },
  streak: { fontSize: font.small, fontWeight: '800', color: colors.accentDark },

  introCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space(3),
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: space(4),
    ...shadow.sm,
  },
  introEmoji: { fontSize: 26 },
  introBody: { flex: 1, gap: 2 },
  introTitle: { fontSize: font.h3, fontFamily: ff.bold, fontWeight: '800', color: colors.text },
  introSub: { fontSize: font.small, color: colors.textMuted },
  introChev: { fontSize: font.h1, color: colors.textFaint, fontWeight: '300' },

  sectionLabel: {
    fontSize: font.small,
    fontWeight: '800',
    color: colors.textMuted,
    marginTop: space(2),
  },

  dayCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space(4),
    gap: space(1.5),
    ...shadow.sm,
  },
  dayCardDone: { borderColor: colors.correctBorder, backgroundColor: colors.correctBg },
  dayCardLocked: { backgroundColor: colors.surfaceAlt, opacity: 0.7 },
  dayCardPressed: { opacity: 0.85 },

  dayTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayNo: {
    fontSize: font.small,
    fontFamily: ff.bold,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1,
  },
  dayStatus: { fontSize: font.tiny, fontWeight: '700', color: colors.textMuted },
  dayTitle: { fontSize: font.h3, fontFamily: ff.bold, fontWeight: '800', color: colors.text },
  daySub: { fontSize: font.small, color: colors.textMuted, lineHeight: 19 },
  mutedText: { color: colors.textFaint },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space(1.5), marginTop: space(1) },
  chip: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: space(2.5),
    paddingVertical: space(1),
  },
  chipText: { fontSize: font.tiny, fontWeight: '700', color: colors.textMuted },
});
