import { useMemo, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { PhoneFrame } from '@/components/PhoneFrame';
import { Button, Card } from '@/components/ui';
import { QuestionView, RevealView, JournalView } from '@/components/eventViews';
import { JournalTable } from '@/components/JournalTable';
import { AccountPicker } from '@/components/AccountPicker';
import { getEvent, reachedEvents } from '@/data/days';
import { ACCOUNTS } from '@/engine/accounts';
import type { BusinessEvent, JournalLine } from '@/engine/types';
import { wrongEventIds } from '@/score';
import { useGame } from '@/state/GameContext';
import { colors, font, space } from '@/theme';

type Mode = 'wrong' | 'random' | 'drill';
const DRILL_N = 10;

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

/* ============================================================ mode select */

export default function Review() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const { state } = useGame();

  const pool = useMemo(
    () => reachedEvents(state.completedDays, state.dayProgress),
    [state.completedDays, state.dayProgress],
  );
  const wrong = useMemo(
    () => wrongEventIds(state.answers).map(getEvent).filter(Boolean) as BusinessEvent[],
    [state.answers],
  );

  if (mode === 'wrong' || mode === 'random' || mode === 'drill') {
    const events =
      mode === 'wrong'
        ? wrong
        : shuffle(pool).slice(0, Math.min(DRILL_N, pool.length));
    if (events.length === 0) {
      return <EmptyState mode={mode} />;
    }
    return mode === 'drill' ? (
      <DrillRunner events={events} />
    ) : (
      <QuizRunner events={events} />
    );
  }

  return (
    <PhoneFrame
      footer={<Button label="もどる" variant="ghost" onPress={() => router.back()} />}
    >
      <View style={styles.head}>
        <Text style={styles.title}>ふりかえる</Text>
        <Text style={styles.sub}>
          解いた問題はここで解き直せます（成績には影響しません）。
        </Text>
      </View>

      <ModeCard
        title="まちがい直し"
        desc={`一発正解できなかった ${wrong.length} 問をもう一度`}
        disabled={wrong.length === 0}
        onPress={() => router.push('/review?mode=wrong')}
      />
      <ModeCard
        title="ランダム総復習"
        desc={`これまでの範囲から ${Math.min(DRILL_N, pool.length)} 問をシャッフル`}
        disabled={pool.length === 0}
        onPress={() => router.push('/review?mode=random')}
      />
      <ModeCard
        title="仕訳入力ドリル"
        desc="選択式ではなく、勘定科目と金額を自分で入力して仕訳をつくる"
        disabled={pool.length === 0}
        onPress={() => router.push('/review?mode=drill')}
      />
    </PhoneFrame>
  );
}

function ModeCard({
  title,
  desc,
  disabled,
  onPress,
}: {
  title: string;
  desc: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.modeCard,
        disabled && styles.modeCardDisabled,
        pressed && !disabled && { opacity: 0.85 },
      ]}
    >
      <Text style={styles.modeTitle}>{title}</Text>
      <Text style={styles.modeDesc}>{desc}</Text>
    </Pressable>
  );
}

function EmptyState({ mode }: { mode: Mode }) {
  return (
    <PhoneFrame
      footer={
        <Button label="もどる" variant="secondary" onPress={() => router.replace('/review')} />
      }
    >
      <View style={styles.center}>
        <Text style={styles.emptyEmoji}>{mode === 'wrong' ? '💯' : '📘'}</Text>
        <Text style={styles.emptyText}>
          {mode === 'wrong'
            ? 'まちがえた問題はありません。すばらしい！'
            : 'まだ復習できる問題がありません。DAY を進めましょう。'}
        </Text>
      </View>
    </PhoneFrame>
  );
}

/* ============================================================ quiz runner */

function QuizRunner({ events }: { events: BusinessEvent[] }) {
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<'q' | 'reveal' | 'journal' | 'done'>('q');
  const [selected, setSelected] = useState<string | null>(null);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);
  const correct = useRef(0);

  const event = events[i];
  const isLast = i === events.length - 1;

  if (phase === 'done') {
    return (
      <ResultScreen
        total={events.length}
        correct={correct.current}
        label="復習おわり"
      />
    );
  }

  const confirm = () => {
    if (!selected) return;
    const ok = selected === event.quiz.correctId;
    if (ok) correct.current += 1;
    setWasCorrect(ok);
    setPhase('reveal');
  };
  const next = () => {
    if (isLast) {
      setPhase('done');
      return;
    }
    setI(i + 1);
    setPhase('q');
    setSelected(null);
    setWasCorrect(null);
  };

  let footer: React.ReactNode;
  if (phase === 'q')
    footer = <Button label="答えを確認する" onPress={confirm} disabled={!selected} />;
  else if (phase === 'reveal')
    footer = <Button label="仕訳を見る" onPress={() => setPhase('journal')} />;
  else footer = <Button label={isLast ? '結果を見る' : '次へ'} onPress={next} />;

  return (
    <PhoneFrame footer={footer}>
      <Text style={styles.counter}>
        {i + 1} / {events.length}
      </Text>
      {phase === 'q' && (
        <QuestionView event={event} selected={selected} onSelect={setSelected} />
      )}
      {phase === 'reveal' && <RevealView event={event} wasCorrect={wasCorrect} />}
      {phase === 'journal' && <JournalView event={event} />}
    </PhoneFrame>
  );
}

/* =========================================================== drill runner */

type Entry = { accountId: string | null; amount: string };

function blankSide(lines: JournalLine[], side: 'debit' | 'credit'): Entry[] {
  const n = lines.filter((l) => l.side === side).length;
  return Array.from({ length: n }, () => ({ accountId: null, amount: '' }));
}

function gradeSide(entries: Entry[], lines: JournalLine[], side: 'debit' | 'credit') {
  const want = lines
    .filter((l) => l.side === side)
    .map((l) => `${l.accountId}:${l.amount}`)
    .sort();
  const got = entries
    .map((e) => `${e.accountId}:${Number(e.amount.replace(/[, ]/g, ''))}`)
    .sort();
  return want.length === got.length && want.every((w, k) => w === got[k]);
}

function DrillRunner({ events }: { events: BusinessEvent[] }) {
  const [i, setI] = useState(0);
  const [debit, setDebit] = useState<Entry[]>(() =>
    blankSide(events[0].journal, 'debit'),
  );
  const [credit, setCredit] = useState<Entry[]>(() =>
    blankSide(events[0].journal, 'credit'),
  );
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [picker, setPicker] = useState<
    { side: 'debit' | 'credit'; idx: number } | null
  >(null);
  const correct = useRef(0);
  const [done, setDone] = useState(false);

  const event = events[i];
  const isLast = i === events.length - 1;

  if (done) {
    return (
      <ResultScreen total={events.length} correct={correct.current} label="ドリルおわり" />
    );
  }

  const setEntry = (
    side: 'debit' | 'credit',
    idx: number,
    patch: Partial<Entry>,
  ) => {
    const upd = side === 'debit' ? [...debit] : [...credit];
    upd[idx] = { ...upd[idx], ...patch };
    (side === 'debit' ? setDebit : setCredit)(upd);
  };

  const check = () => {
    const ok =
      gradeSide(debit, event.journal, 'debit') &&
      gradeSide(credit, event.journal, 'credit');
    if (ok) correct.current += 1;
    setResult(ok);
    setChecked(true);
  };

  const next = () => {
    if (isLast) {
      setDone(true);
      return;
    }
    const n = i + 1;
    setI(n);
    setDebit(blankSide(events[n].journal, 'debit'));
    setCredit(blankSide(events[n].journal, 'credit'));
    setChecked(false);
    setResult(null);
  };

  const filled =
    debit.every((e) => e.accountId && e.amount) &&
    credit.every((e) => e.accountId && e.amount);

  return (
    <PhoneFrame
      footer={
        checked ? (
          <Button label={isLast ? '結果を見る' : '次へ'} onPress={next} />
        ) : (
          <Button label="答え合わせ" onPress={check} disabled={!filled} />
        )
      }
    >
      <Text style={styles.counter}>
        {i + 1} / {events.length}
      </Text>
      <Card>
        <Text style={styles.drillLabel}>{event.label} ・ {event.scene}</Text>
        <Text style={styles.drillNarr}>{event.narrative}</Text>
      </Card>
      <Text style={styles.drillPrompt}>この取引を仕訳しなさい。</Text>

      <SideEditor
        title="借方（かりかた）"
        entries={debit}
        onAccount={(idx) => setPicker({ side: 'debit', idx })}
        onAmount={(idx, v) => setEntry('debit', idx, { amount: v })}
        disabled={checked}
      />
      <SideEditor
        title="貸方（かしかた）"
        entries={credit}
        onAccount={(idx) => setPicker({ side: 'credit', idx })}
        onAmount={(idx, v) => setEntry('credit', idx, { amount: v })}
        disabled={checked}
      />

      {checked && (
        <>
          <View
            style={[
              styles.drillBanner,
              {
                backgroundColor: result ? colors.correctBg : colors.wrongBg,
                borderColor: result ? colors.correctBorder : colors.wrongBorder,
              },
            ]}
          >
            <Text style={styles.drillBannerText}>
              {result ? '正解！' : 'おしい！ 正しい仕訳はこちら'}
            </Text>
          </View>
          <JournalTable lines={event.journal} />
        </>
      )}

      <AccountPicker
        visible={picker !== null}
        onPick={(id) =>
          picker && setEntry(picker.side, picker.idx, { accountId: id })
        }
        onClose={() => setPicker(null)}
      />
    </PhoneFrame>
  );
}

function SideEditor({
  title,
  entries,
  onAccount,
  onAmount,
  disabled,
}: {
  title: string;
  entries: Entry[];
  onAccount: (idx: number) => void;
  onAmount: (idx: number, v: string) => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.side}>
      <Text style={styles.sideTitle}>{title}</Text>
      {entries.map((e, idx) => (
        <View key={idx} style={styles.entryRow}>
          <Pressable
            style={styles.acctBtn}
            onPress={() => onAccount(idx)}
            disabled={disabled}
          >
            <Text style={[styles.acctBtnText, !e.accountId && styles.acctPlaceholder]}>
              {e.accountId ? ACCOUNTS[e.accountId]?.name : '科目をえらぶ'}
            </Text>
          </Pressable>
          <TextInput
            value={e.amount}
            onChangeText={(v) => onAmount(idx, v.replace(/[^0-9]/g, ''))}
            editable={!disabled}
            keyboardType="number-pad"
            placeholder="金額"
            placeholderTextColor={colors.textFaint}
            style={styles.amtInput}
          />
        </View>
      ))}
    </View>
  );
}

/* ================================================================ result */

function ResultScreen({
  total,
  correct,
  label,
}: {
  total: number;
  correct: number;
  label: string;
}) {
  const pct = total ? Math.round((correct / total) * 100) : 0;
  return (
    <PhoneFrame
      footer={
        <View style={{ gap: space(2) }}>
          <Button label="ふりかえるトップへ" onPress={() => router.replace('/review')} />
          <Button label="ホームへ" variant="ghost" onPress={() => router.replace('/')} />
        </View>
      }
    >
      <View style={styles.center}>
        <Text style={styles.resultLabel}>{label}</Text>
        <Text style={styles.resultBig}>
          {correct} / {total}
        </Text>
        <Text style={styles.resultPct}>正解率 {pct}%</Text>
      </View>
    </PhoneFrame>
  );
}

const styles = StyleSheet.create({
  head: { gap: space(1), paddingTop: space(2) },
  title: { fontSize: font.h1, fontWeight: '900', color: colors.text },
  sub: { fontSize: font.small, color: colors.textMuted, lineHeight: 20 },
  counter: { fontSize: font.small, fontWeight: '800', color: colors.textMuted },

  modeCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: space(4),
    gap: space(1),
  },
  modeCardDisabled: { opacity: 0.45 },
  modeTitle: { fontSize: font.h3, fontWeight: '800', color: colors.text },
  modeDesc: { fontSize: font.small, color: colors.textMuted, lineHeight: 19 },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space(3),
    paddingVertical: space(10),
  },
  emptyEmoji: { fontSize: 52 },
  emptyText: {
    fontSize: font.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 23,
  },

  drillLabel: { fontSize: font.small, fontWeight: '900', color: colors.primary },
  drillNarr: { fontSize: font.h3, color: colors.text, lineHeight: 24 },
  drillPrompt: { fontSize: font.h3, fontWeight: '800', color: colors.text },
  side: { gap: space(2) },
  sideTitle: { fontSize: font.small, fontWeight: '800', color: colors.textMuted },
  entryRow: { flexDirection: 'row', gap: space(2) },
  acctBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: space(3),
    paddingVertical: space(3),
    justifyContent: 'center',
  },
  acctBtnText: { fontSize: font.body, fontWeight: '700', color: colors.text },
  acctPlaceholder: { color: colors.textFaint, fontWeight: '400' },
  amtInput: {
    width: 110,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: space(3),
    paddingVertical: space(3),
    fontSize: font.body,
    color: colors.text,
    textAlign: 'right',
  },
  drillBanner: { borderRadius: 12, borderWidth: 1, padding: space(3) },
  drillBannerText: { fontSize: font.body, fontWeight: '800', color: colors.text },

  resultLabel: { fontSize: font.h3, fontWeight: '800', color: colors.textMuted },
  resultBig: { fontSize: 44, fontWeight: '900', color: colors.primary },
  resultPct: { fontSize: font.body, color: colors.textMuted },
});
