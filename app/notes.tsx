import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { PhoneFrame } from '@/components/PhoneFrame';
import { Button, Card } from '@/components/ui';
import { DAYS } from '@/data/days';
import { useGame } from '@/state/GameContext';
import { colors, font, space } from '@/theme';

/** 学んだことノート — every completed day's recap, in one place. */
export default function Notes() {
  const { state } = useGame();
  const done = DAYS.filter((d) => state.completedDays.includes(d.day));

  return (
    <PhoneFrame
      footer={
        <Button label="もどる" variant="secondary" onPress={() => router.back()} />
      }
    >
      <View style={styles.head}>
        <Text style={styles.title}>学んだことノート</Text>
        <Text style={styles.sub}>
          クリアした DAY の「今日わかったこと」がここにたまっていきます（
          {done.length} / {DAYS.length} DAY）。
        </Text>
      </View>

      {done.length === 0 ? (
        <Card tone="soft">
          <Text style={styles.empty}>
            まだクリアした DAY がありません。DAY 1 から始めましょう。
          </Text>
        </Card>
      ) : (
        done.map((d) => (
          <Card key={d.day}>
            <Text style={styles.dayLabel}>DAY {d.day}</Text>
            <Text style={styles.dayTitle}>{d.title}</Text>
            {d.recap.map((r) => (
              <View key={r} style={styles.row}>
                <Text style={styles.dot}>✓</Text>
                <Text style={styles.text}>{r}</Text>
              </View>
            ))}
          </Card>
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
  dayLabel: {
    fontSize: font.tiny,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1,
  },
  dayTitle: { fontSize: font.h3, fontWeight: '800', color: colors.text },
  row: { flexDirection: 'row', gap: space(2) },
  dot: { fontSize: font.body, color: colors.primary, fontWeight: '900' },
  text: { flex: 1, fontSize: font.body, color: colors.textMuted, lineHeight: 22 },
});
