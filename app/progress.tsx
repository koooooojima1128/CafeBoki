import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PhoneFrame } from '@/components/PhoneFrame';
import { Card, ProgressBar } from '@/components/ui';
import { DAYS } from '@/data/days';
import {
  badgesFor,
  dayStars,
  overallStats,
  rankForCorrect,
  streakDays,
  wrongEventIds,
} from '@/score';
import { useGame } from '@/state/GameContext';
import { colors, ff, font, radius, shadow, space } from '@/theme';

type Tool = { label: string; href: string; hint: string; icon: string };

export default function Progress() {
  const { state } = useGame();

  if (!state.hydrated) {
    return (
      <PhoneFrame scroll={false} tab="progress">
        <View />
      </PhoneFrame>
    );
  }

  const stats = overallStats(state.answers, state.completedDays);
  const rank = rankForCorrect(stats.correct);
  const streak = streakDays(state.completedAt, state.lastPlayedAt);
  const badges = badgesFor(state.answers, state.completedDays);
  const wrongCount = wrongEventIds(state.answers).length;

  const tools: Tool[] = [
    { label: 'ふりかえる', href: '/review', hint: `まちがい ${wrongCount}問`, icon: '🔁' },
    { label: '仕訳日記帳', href: '/journal-book', hint: 'つくった仕訳', icon: '📓' },
    { label: '勘定科目じてん', href: '/reference', hint: '借方・貸方', icon: '📖' },
    { label: '学んだことノート', href: '/notes', hint: 'DAYごとの要点', icon: '✏️' },
    { label: '会社の現在地', href: '/status', hint: '累計 BS', icon: '🏬' },
    { label: '成績表・修了証', href: '/cert', hint: '称号・シェア', icon: '🎓' },
  ];

  return (
    <PhoneFrame tab="progress">
      <Text style={styles.h1}>進捗</Text>

      <Card>
        <View style={styles.rankTop}>
          <Text style={styles.rankName}>{rank.name}</Text>
          <Text style={styles.rankScore}>スコア {stats.score}点</Text>
        </View>
        <Text style={styles.rankNote}>{rank.note}</Text>
        <ProgressBar value={stats.score / 100} />
        <View style={styles.statRow}>
          <Stat value={`${Math.round(stats.rate * 100)}%`} label="一発正答率" />
          <Stat
            value={`${stats.completedDays}/${stats.totalDays}`}
            label="クリアDAY"
          />
          <Stat value={`${streak}`} label="連続学習日" />
        </View>
      </Card>

      <Text style={styles.sectionLabel}>DAYごとの成績</Text>
      <View style={styles.starGrid}>
        {DAYS.map((d) => {
          const s = dayStars(d, state.answers);
          const done = state.completedDays.includes(d.day);
          return (
            <View
              key={d.day}
              style={[styles.starCell, done && styles.starCellDone]}
            >
              <Text style={styles.starDay}>DAY {d.day}</Text>
              <Text style={styles.stars}>
                {s > 0 ? '★'.repeat(s) + '☆'.repeat(3 - s) : '・・・'}
              </Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.sectionLabel}>バッジ</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.badgeRow}
      >
        {badges.map((b) => (
          <View
            key={b.id}
            style={[styles.badge, b.got ? styles.badgeGot : styles.badgeOff]}
          >
            <Text style={[styles.badgeName, b.got && styles.badgeNameGot]}>
              {b.got ? '🏅 ' : ''}
              {b.name}
            </Text>
            <Text style={styles.badgeDesc} numberOfLines={2}>
              {b.desc}
            </Text>
          </View>
        ))}
      </ScrollView>

      <Text style={styles.sectionLabel}>学習ツール</Text>
      <View style={styles.toolGrid}>
        {tools.map((t) => (
          <Pressable
            key={t.href}
            style={({ pressed }) => [styles.tool, pressed && { opacity: 0.85 }]}
            onPress={() => router.push(t.href as never)}
          >
            <Text style={styles.toolIcon}>{t.icon}</Text>
            <Text style={styles.toolLabel}>{t.label}</Text>
            <Text style={styles.toolHint}>{t.hint}</Text>
          </Pressable>
        ))}
      </View>
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
  h1: { fontSize: font.h1, fontFamily: ff.bold, fontWeight: '900', color: colors.text },

  rankTop: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  rankName: { fontSize: font.h1, fontFamily: ff.bold, fontWeight: '900', color: colors.primary },
  rankScore: { fontSize: font.small, fontWeight: '800', color: colors.textMuted },
  rankNote: { fontSize: font.small, color: colors.textMuted },

  statRow: { flexDirection: 'row', gap: space(2), marginTop: space(1) },
  stat: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingVertical: space(3),
    alignItems: 'center',
    gap: 2,
  },
  statValue: { fontSize: font.h3, fontFamily: ff.bold, fontWeight: '900', color: colors.text },
  statLabel: { fontSize: font.tiny, color: colors.textMuted },

  sectionLabel: {
    fontSize: font.small,
    fontWeight: '800',
    color: colors.textMuted,
    marginTop: space(2),
  },

  starGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space(2) },
  starCell: {
    flexGrow: 1,
    flexBasis: '22%',
    minWidth: 74,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: space(2.5),
    alignItems: 'center',
    gap: 3,
    ...shadow.sm,
  },
  starCellDone: { borderColor: colors.correctBorder, backgroundColor: colors.correctBg },
  starDay: { fontSize: font.tiny, fontWeight: '800', color: colors.textMuted },
  stars: { fontSize: font.small, color: colors.accent, letterSpacing: 1 },

  badgeRow: { gap: space(2.5), paddingVertical: space(1) },
  badge: {
    width: 150,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: space(3),
    gap: 3,
  },
  badgeGot: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  badgeOff: { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
  badgeName: { fontSize: font.small, fontFamily: ff.bold, fontWeight: '900', color: colors.textMuted },
  badgeNameGot: { color: colors.primaryDark },
  badgeDesc: { fontSize: font.tiny, color: colors.textMuted, lineHeight: 15 },

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
    paddingHorizontal: space(3),
    gap: 3,
    ...shadow.sm,
  },
  toolIcon: { fontSize: 18 },
  toolLabel: { fontSize: font.small, fontFamily: ff.bold, fontWeight: '800', color: colors.text },
  toolHint: { fontSize: font.tiny, color: colors.textFaint },
});
