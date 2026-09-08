import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, font, space } from '@/theme';
import type { BusinessEvent } from '@/engine/types';
import { formatYen } from '@/engine/ledger';
import { shuffleOptions } from '@/engine/shuffle';
import { Card, Divider } from './ui';
import { ChangeList } from './ChangeList';
import { JournalTable } from './JournalTable';
import { OptionList } from './OptionList';

/** Phase 1 — the narrative + 「何が起きた？」 multiple choice. */
export function QuestionView({
  event,
  selected,
  onSelect,
}: {
  event: BusinessEvent;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const options = React.useMemo(
    () => shuffleOptions(event.id, event.quiz.options),
    [event.id],
  );
  return (
    <>
      <Card>
        <Text style={styles.eventLabel}>{event.label}</Text>
        <Text style={styles.narrative}>{event.narrative}</Text>
      </Card>
      <Text style={styles.question}>{event.quiz.question}</Text>
      <OptionList options={options} selectedId={selected} onSelect={onSelect} />
    </>
  );
}

/** Phase 2 — 正解／おしい + 会社の変化. */
export function RevealView({
  event,
  wasCorrect,
}: {
  event: BusinessEvent;
  wasCorrect: boolean | null;
}) {
  return (
    <>
      <View
        style={[
          styles.banner,
          {
            backgroundColor: wasCorrect ? colors.correctBg : colors.wrongBg,
            borderColor: wasCorrect ? colors.correctBorder : colors.wrongBorder,
          },
        ]}
      >
        <Text style={styles.bannerTitle}>{wasCorrect ? '正解！' : 'おしい！'}</Text>
        <Text style={styles.bannerBody}>
          {wasCorrect ? event.quiz.correctFeedback : event.quiz.wrongFeedback}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>会社の中で起きたこと</Text>
      <Card tone="soft">
        <Text style={styles.plain}>「{event.plainSummary}」</Text>
      </Card>
      <ChangeList changes={event.changes} />

      <Card tone="soft">
        <Text style={styles.toJournal}>これを簿記の言葉で表現すると…？</Text>
      </Card>
    </>
  );
}

/** Phase 3 — the 仕訳 + why + PL/BS impact. `cash` optional. */
export function JournalView({
  event,
  cash,
}: {
  event: BusinessEvent;
  cash?: number;
}) {
  return (
    <>
      <Text style={styles.sectionTitle}>簿記に翻訳すると</Text>
      <JournalTable lines={event.journal} />

      <Card>
        <Text style={styles.whyTitle}>なぜこうなる？</Text>
        {event.why.map((w, n) => (
          <View key={n} style={styles.whyRow}>
            <Text style={styles.whyDot}>・</Text>
            <Text style={styles.whyText}>{w}</Text>
          </View>
        ))}
      </Card>

      <View style={styles.impactRow}>
        <Text style={styles.impactHead}>財務諸表への影響</Text>
        {event.statementImpact.pl ? (
          <View style={[styles.impact, styles.impactPl]}>
            <Text style={[styles.impactText, { color: colors.debitText }]}>
              {event.statementImpact.pl}
            </Text>
          </View>
        ) : null}
        {event.statementImpact.bs ? (
          <View style={[styles.impact, styles.impactBs]}>
            <Text style={[styles.impactText, { color: colors.creditText }]}>
              {event.statementImpact.bs}
            </Text>
          </View>
        ) : null}
      </View>

      {cash !== undefined ? (
        <>
          <Divider />
          <Text style={styles.cashNote}>
            いまの現金：
            <Text style={styles.cashValue}>{formatYen(cash)}</Text>
          </Text>
        </>
      ) : null}
    </>
  );
}

export const styles = StyleSheet.create({
  eventLabel: {
    fontSize: font.small,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1,
  },
  narrative: { fontSize: font.h3, color: colors.text, lineHeight: 25 },
  question: { fontSize: font.h3, fontWeight: '800', color: colors.text },

  banner: { borderRadius: 16, borderWidth: 1, padding: space(4), gap: space(2) },
  bannerTitle: { fontSize: font.h2, fontWeight: '900', color: colors.text },
  bannerBody: { fontSize: font.body, color: colors.text, lineHeight: 23 },

  sectionTitle: { fontSize: font.h2, fontWeight: '900', color: colors.text },
  plain: { fontSize: font.h3, fontWeight: '700', color: colors.text, lineHeight: 24 },
  toJournal: {
    fontSize: font.body,
    fontWeight: '700',
    color: colors.primaryDark,
    textAlign: 'center',
  },

  whyTitle: { fontSize: font.h3, fontWeight: '800', color: colors.text },
  whyRow: { flexDirection: 'row', gap: space(1) },
  whyDot: { fontSize: font.body, color: colors.textMuted },
  whyText: { flex: 1, fontSize: font.body, color: colors.textMuted, lineHeight: 22 },

  impactRow: { gap: space(2) },
  impactHead: { fontSize: font.small, fontWeight: '800', color: colors.textMuted },
  impact: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: space(2.5),
    paddingHorizontal: space(3),
  },
  impactPl: { backgroundColor: colors.debitBg, borderColor: colors.debitBorder },
  impactBs: { backgroundColor: colors.creditBg, borderColor: colors.creditBorder },
  impactText: { fontSize: font.small, fontWeight: '700', lineHeight: 20 },

  cashNote: { fontSize: font.small, color: colors.textMuted },
  cashValue: { fontSize: font.h3, fontWeight: '900', color: colors.text },
});
