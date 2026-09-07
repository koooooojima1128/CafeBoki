import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PhoneFrame } from '@/components/PhoneFrame';
import { Button, Card, ProgressBar } from '@/components/ui';
import { ConfirmModal } from '@/components/ConfirmModal';
import { ALL_EVENT_IDS, DAYS, FIRST_DAY } from '@/data/days';
import { overallStats, rankForCorrect, streakDays, wrongEventIds } from '@/score';
import { useGame } from '@/state/GameContext';
import { colors, font, radius, shadow, space } from '@/theme';

type Tool = { label: string; href: string; hint: string };

export default function Home() {
  const { state, openDay, resetAll } = useGame();
  const [confirmReset, setConfirmReset] = useState(false);

  const answered = ALL_EVENT_IDS.filter((id) => id in state.answers).length;
  const correct = ALL_EVENT_IDS.filter((id) => state.answers[id]).length;
  const pct = answered ? correct / answered : 0;
  const started = answered > 0 || state.completedDays.length > 0;
  const stats = overallStats(state.answers, state.completedDays);
  const rank = rankForCorrect(stats.correct);
  const streak = streakDays(state.completedAt, state.lastPlayedAt);
  const wrongCount = wrongEventIds(state.answers).length;

  const tools: Tool[] = [
    { label: 'ふりかえる', href: '/review', hint: `まちがい ${wrongCount}問` },
    { label: '仕訳日記帳', href: '/journal-book', hint: 'つくった仕訳' },
    { label: '勘定科目じてん', href: '/reference', hint: '借方・貸方' },
    { label: '学んだことノート', href: '/notes', hint: 'DAYごとの要点' },
    { label: '会社の現在地', href: '/status', hint: '累計 BS' },
    { label: '成績表・修了証', href: '/cert', hint: '称号・シェア' },
    { label: '進捗の引き継ぎ', href: '/transfer', hint: 'コードで移行' },
    { label: '使い方', href: '/onboarding', hint: 'あそびかた' },
  ];

  const start = (day: number) => {
    openDay(day);
    router.push('/play');
  };

  return (
    <PhoneFrame
      footer={
        started ? (
          <Button
            label="はじめからやり直す"
            variant="ghost"
            onPress={() => setConfirmReset(true)}
          />
        ) : (
          <Button label="カフェを始める" onPress={() => start(FIRST_DAY)} />
        )
      }
    >
      <View style={styles.hero}>
        <View style={styles.heroGlow} />
        <Text style={styles.logo}>☕ カフェ簿記</Text>
        <Text style={styles.tagline}>
          簿記という言語を、{'\n'}商売を通して理解するシミュレーター
        </Text>
      </View>

      <Card>
        <View style={styles.meterTop}>
          <Text style={styles.meterLabel}>あなたの正答率</Text>
          {started ? (
            <Pressable onPress={() => router.push('/cert')} hitSlop={8}>
              <Text style={styles.rankBadge}>称号：{rank.name} ▸</Text>
            </Pressable>
          ) : null}
        </View>
        <ProgressBar value={pct} />
        <View style={styles.meterRow}>
          <Text style={styles.meterPct}>{Math.round(pct * 100)}%</Text>
          <Text style={styles.meterSub}>
            {started
              ? `スコア ${stats.score}点 ・ ${state.completedDays.length}/${DAYS.length} DAY`
              : 'まだ始めていません'}
          </Text>
        </View>
        {streak > 0 ? (
          <Text style={styles.streak}>🔥 {streak}日連続で学習中</Text>
        ) : null}
      </Card>

      {started ? (
        <View style={styles.toolGrid}>
          {tools.map((t) => (
            <Pressable
              key={t.href}
              style={({ pressed }) => [styles.tool, pressed && { opacity: 0.85 }]}
              onPress={() => router.push(t.href as never)}
            >
              <Text style={styles.toolLabel}>{t.label}</Text>
              <Text style={styles.toolHint}>{t.hint}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

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

      <View style={styles.footerLinks}>
        <Pressable onPress={() => router.push('/onboarding')} hitSlop={6}>
          <Text style={styles.footerLink}>使い方</Text>
        </Pressable>
        <Text style={styles.footerDot}>・</Text>
        <Pressable onPress={() => router.push('/privacy')} hitSlop={6}>
          <Text style={styles.footerLink}>プライバシーポリシー</Text>
        </Pressable>
        <Text style={styles.footerDot}>・</Text>
        <Pressable onPress={() => router.push('/terms')} hitSlop={6}>
          <Text style={styles.footerLink}>利用規約</Text>
        </Pressable>
      </View>

      <ConfirmModal
        visible={confirmReset}
        title="最初からやり直しますか？"
        body="これまでの進捗・正答・称号がすべて消えます。元に戻せません。（引き継ぎコードは「進捗の引き継ぎ」で控えられます）"
        confirmLabel="やり直す"
        destructive
        onConfirm={() => {
          setConfirmReset(false);
          resetAll();
        }}
        onCancel={() => setConfirmReset(false)}
      />
    </PhoneFrame>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: space(2),
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    paddingVertical: space(7),
    paddingHorizontal: space(6),
    gap: space(2.5),
    overflow: 'hidden',
    ...shadow.card,
  },
  heroGlow: {
    position: 'absolute',
    top: -70,
    right: -50,
    width: 170,
    height: 170,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  logo: {
    fontSize: font.h0,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: font.body,
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 23,
    fontWeight: '600',
  },

  meterTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meterLabel: { fontSize: font.small, fontWeight: '700', color: colors.textMuted },
  rankBadge: { fontSize: font.small, fontWeight: '800', color: colors.primary },
  meterRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  meterPct: { fontSize: font.h2, fontWeight: '900', color: colors.primary },
  meterSub: { fontSize: font.small, color: colors.textFaint },
  streak: { fontSize: font.small, fontWeight: '800', color: colors.accentDark },

  toolGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space(2) },
  tool: {
    flexGrow: 1,
    flexBasis: '30%',
    minWidth: 100,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: space(3.5),
    paddingHorizontal: space(3.5),
    gap: 3,
    ...shadow.sm,
  },
  toolLabel: { fontSize: font.small, fontWeight: '800', color: colors.text },
  toolHint: { fontSize: font.tiny, color: colors.textFaint },

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
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1,
  },
  dayStatus: { fontSize: font.tiny, fontWeight: '700', color: colors.textMuted },
  dayTitle: { fontSize: font.h3, fontWeight: '800', color: colors.text },
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

  link: { paddingVertical: space(3), alignItems: 'center' },
  linkText: { fontSize: font.small, fontWeight: '700', color: colors.primary },

  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: space(1),
    paddingVertical: space(4),
  },
  footerLink: { fontSize: font.tiny, fontWeight: '700', color: colors.textMuted },
  footerDot: { fontSize: font.tiny, color: colors.textFaint },
});
