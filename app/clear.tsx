import { useEffect } from 'react';
import { Redirect, router } from 'expo-router';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { PhoneFrame } from '@/components/PhoneFrame';
import { Button, Card, Divider } from '@/components/ui';
import { studyingUrl } from '@/config';
import { getDay, nextDay } from '@/data/days';
import { overallStats, rankForCorrect } from '@/score';
import { useGame } from '@/state/GameContext';
import { colors, font, space } from '@/theme';

/** DAY N CLEAR — score, recap, next-day handoff, スタディング導線. */
export default function Clear() {
  const { state, completeDay, openDay } = useGame();

  const day = state.currentDay;
  const dayDef = getDay(day);
  const hydrated = state.hydrated;

  useEffect(() => {
    if (hydrated && dayDef) completeDay(day);
  }, [hydrated, dayDef, day, completeDay]);

  if (!hydrated) {
    return (
      <PhoneFrame scroll={false}>
        <View />
      </PhoneFrame>
    );
  }
  if (!dayDef) return <Redirect href="/" />;

  const ids = dayDef.events.map((e) => e.id);
  const answered = ids.filter((id) => id in state.answers).length || ids.length;
  const correct = ids.filter((id) => state.answers[id]).length;
  const rate = Math.round((correct / answered) * 100);

  const upcoming = nextDay(day);
  const stats = overallStats(state.answers, state.completedDays);
  const rank = rankForCorrect(stats.correct);

  const goNext = () => {
    if (!upcoming) return;
    openDay(upcoming.day);
    router.replace('/play');
  };

  return (
    <PhoneFrame
      footer={
        <View style={{ gap: space(2.5) }}>
          {upcoming ? (
            <Button label={`DAY ${upcoming.day} へ進む`} onPress={goNext} />
          ) : null}
          <Button
            label="修了証・成績表を見る"
            variant={upcoming ? 'secondary' : 'primary'}
            onPress={() => router.push('/cert')}
          />
          <Button
            label="ホームにもどる"
            variant="ghost"
            onPress={() => router.replace('/')}
          />
        </View>
      }
    >
      <View style={styles.hero}>
        <Text style={styles.badge}>{dayDef.closing ? '🏆' : '🎉'}</Text>
        <Text style={styles.title}>
          {dayDef.closing ? 'ALL CLEAR!' : `DAY ${day} CLEAR!`}
        </Text>
        <Text style={styles.lead}>
          {dayDef.closing
            ? 'DAY 1〜14 をやりきり、簿記3級の範囲を「商売」で一周しました。'
            : `「${dayDef.title}」を、簿記の言葉でやりきりました。`}
        </Text>
      </View>

      <View style={styles.stats}>
        <Stat value={`${dayDef.events.length}`} label="つくった仕訳" />
        <Stat value={`${rate}%`} label="一発正解率" />
      </View>

      <View style={styles.rankRow}>
        <Text style={styles.rankRowLabel}>いまの称号</Text>
        <Text style={styles.rankRowValue}>
          {rank.name}（スコア {stats.score}点）
        </Text>
      </View>

      <Card tone="soft">
        <Text style={styles.recapTitle}>今日わかったこと</Text>
        {dayDef.recap.map((t) => (
          <View key={t} style={styles.recapRow}>
            <Text style={styles.recapDot}>✓</Text>
            <Text style={styles.recapText}>{t}</Text>
          </View>
        ))}
      </Card>

      {upcoming ? (
        <Card>
          <Text style={styles.nextLabel}>つぎは DAY {upcoming.day}</Text>
          <Text style={styles.nextTitle}>{upcoming.title}</Text>
          <Text style={styles.nextSub}>{upcoming.subtitle}</Text>
        </Card>
      ) : dayDef.closing ? (
        <Card tone="soft">
          <Text style={styles.nextTitle}>ここまでやったこと</Text>
          <Text style={styles.nextSub}>
            開業・仕入・売上・掛け取引・手形・預金・固定資産・株式会社・税金・
            決算整理・帳簿の締めまで。DAY 1 の「現金 100万 / 資本金 100万」から、
            繰越利益剰余金が積み上がるまでの1年ぶんです。
          </Text>
        </Card>
      ) : (
        <Card tone="soft">
          <Text style={styles.nextTitle}>ここまでで公開分はおしまい</Text>
          <Text style={styles.nextSub}>この先の DAY は準備中です。</Text>
        </Card>
      )}

      <Divider />

      <Card>
        <Text style={styles.adLabel}>広告（アフィリエイト）</Text>
        <Text style={styles.ctaTitle}>次は「解く量」を増やそう</Text>
        <Text style={styles.ctaBody}>
          このアプリで簿記の“考え方”はつかめました。仕訳を体に定着させるには演習量が要ります。
          講義と問題集で3級を仕上げるなら、スタディングが定番です。
        </Text>
        <Button
          label="スタディングで簿記3級を学ぶ"
          variant="accent"
          onPress={() => Linking.openURL(studyingUrl(`clear_day${day}`))}
        />
        <Text style={styles.ctaNote}>
          外部サイト（スタディング）に移動します。当アプリはリンク経由の登録・購入で
          紹介料を受け取ることがあります。
        </Text>
      </Card>
    </PhoneFrame>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    gap: space(2),
    paddingTop: space(6),
    paddingBottom: space(2),
  },
  badge: { fontSize: 52 },
  title: { fontSize: 30, fontWeight: '900', color: colors.text },
  lead: {
    fontSize: font.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 23,
  },

  stats: { flexDirection: 'row', gap: space(3) },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: space(4),
    alignItems: 'center',
    gap: space(1),
  },
  statValue: { fontSize: font.h1, fontWeight: '900', color: colors.primary },
  statLabel: { fontSize: font.small, color: colors.textMuted },

  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    paddingVertical: space(2.5),
    paddingHorizontal: space(4),
  },
  rankRowLabel: { fontSize: font.small, fontWeight: '700', color: colors.primaryDark },
  rankRowValue: { fontSize: font.body, fontWeight: '900', color: colors.primaryDark },

  recapTitle: { fontSize: font.h3, fontWeight: '800', color: colors.text },
  recapRow: { flexDirection: 'row', gap: space(2) },
  recapDot: { fontSize: font.body, color: colors.primary, fontWeight: '900' },
  recapText: { flex: 1, fontSize: font.body, color: colors.textMuted, lineHeight: 22 },

  nextLabel: { fontSize: font.tiny, fontWeight: '900', color: colors.primary, letterSpacing: 1 },
  nextTitle: { fontSize: font.h3, fontWeight: '800', color: colors.text },
  nextSub: { fontSize: font.small, color: colors.textMuted, lineHeight: 20 },

  adLabel: {
    fontSize: font.tiny,
    fontWeight: '800',
    color: colors.textFaint,
    letterSpacing: 1,
  },
  ctaTitle: { fontSize: font.h3, fontWeight: '800', color: colors.text },
  ctaBody: { fontSize: font.body, color: colors.textMuted, lineHeight: 23 },
  ctaNote: { fontSize: font.tiny, color: colors.textFaint, lineHeight: 16 },
});
