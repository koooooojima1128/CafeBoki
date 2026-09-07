import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, space } from '@/theme';

export interface CertCardProps {
  name: string;
  rankName: string;
  rankNote: string;
  score: number;
  ratePct: number;
  done: number;
  total: number;
  date: string;
  /** length === total; which day stamps are filled. */
  filledDays: boolean[];
  complete: boolean;
}

/** The shareable 修了証 / 成績表. Also the capture target for "画像として保存". */
export function CertCard(props: CertCardProps) {
  const {
    name,
    rankName,
    rankNote,
    score,
    ratePct,
    done,
    total,
    date,
    filledDays,
    complete,
  } = props;

  return (
    <View style={styles.card}>
      <View style={[styles.corner, styles.tl]} />
      <View style={[styles.corner, styles.tr]} />
      <View style={[styles.corner, styles.bl]} />
      <View style={[styles.corner, styles.br]} />

      <Text style={styles.brand}>☕ カフェ簿記</Text>
      <Text style={styles.kind}>{complete ? '修 了 証' : '成 績 表'}</Text>

      <Text style={styles.name}>{name || 'あなた'}　殿</Text>

      <Text style={styles.body}>
        {complete
          ? `あなたは「カフェ簿記」の全 ${total} DAY をやりきり、商売の出来事を簿記の言葉で記録できることを証します。`
          : `「カフェ簿記」を DAY ${done} まで進め、簿記の考え方を身につけつつあることを記録します。`}
      </Text>

      <View style={styles.stampWrap}>
        {filledDays.map((filled, i) => (
          <View key={i} style={[styles.stamp, filled && styles.stampOn]}>
            <Text style={[styles.stampText, filled && styles.stampTextOn]}>
              {filled ? '☕' : i + 1}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>称号</Text>
          <Text style={styles.statValue}>{rankName}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>スコア</Text>
          <Text style={styles.statValue}>{score}点</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>一発正答率</Text>
          <Text style={styles.statValue}>{ratePct}%</Text>
        </View>
      </View>

      <Text style={styles.rankNote}>{rankNote}</Text>
      <Text style={styles.date}>{date}　カフェ簿記シミュレーター</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FBF7EC',
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    padding: space(6),
    gap: space(3),
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderColor: colors.primary,
  },
  tl: { top: 8, left: 8, borderTopWidth: 2, borderLeftWidth: 2 },
  tr: { top: 8, right: 8, borderTopWidth: 2, borderRightWidth: 2 },
  bl: { bottom: 8, left: 8, borderBottomWidth: 2, borderLeftWidth: 2 },
  br: { bottom: 8, right: 8, borderBottomWidth: 2, borderRightWidth: 2 },

  brand: { fontSize: font.small, fontWeight: '800', color: colors.primary },
  kind: {
    fontSize: font.h1,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 2,
    marginTop: space(1),
  },
  name: {
    fontSize: font.h2,
    fontWeight: '800',
    color: colors.text,
    marginTop: space(2),
  },
  body: {
    fontSize: font.small,
    color: colors.textMuted,
    lineHeight: 21,
    textAlign: 'center',
  },

  stampWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: space(1.5),
    marginVertical: space(1),
  },
  stamp: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  stampOn: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  stampText: { fontSize: font.small, fontWeight: '800', color: colors.textFaint },
  stampTextOn: { color: colors.primaryDark },

  statsRow: {
    flexDirection: 'row',
    gap: space(3),
    marginTop: space(1),
  },
  stat: { alignItems: 'center', gap: 2 },
  statLabel: { fontSize: font.tiny, color: colors.textFaint, fontWeight: '700' },
  statValue: { fontSize: font.h3, fontWeight: '900', color: colors.primary },

  rankNote: { fontSize: font.small, color: colors.textMuted },
  date: { fontSize: font.tiny, color: colors.textFaint },
});
