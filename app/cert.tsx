import { useMemo, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { PhoneFrame } from '@/components/PhoneFrame';
import { Button } from '@/components/ui';
import { CertCard } from '@/components/CertCard';
import { DAYS } from '@/data/days';
import { useGame } from '@/state/GameContext';
import {
  certLink,
  decodeCert,
  shareMessage,
  type CertPayload,
} from '@/cert';
import { overallStats, rankById, rankForCorrect } from '@/score';
import { shareImage, shareText, type ShareOutcome } from '@/share';
import { colors, font, space } from '@/theme';

const today = () => new Date().toISOString().slice(0, 10);

const OUTCOME_MSG: Record<ShareOutcome, string> = {
  shared: 'シェアしました',
  copied: '結果をクリップボードにコピーしました',
  saved: '画像を保存しました',
  cancelled: 'キャンセルしました',
  unsupported: 'この環境では未対応です（テキストでシェアしてください）',
};

export default function Cert() {
  const { d } = useLocalSearchParams<{ d?: string }>();
  const guest = d ? decodeCert(String(d)) : null;

  if (guest) return <GuestCert payload={guest} />;
  return <OwnCert />;
}

/* --------------------------------------------------------------- own mode */

function OwnCert() {
  const { state, setName } = useGame();
  const shotRef = useRef<View>(null);
  const [status, setStatus] = useState<string | null>(null);

  const stats = useMemo(
    () => overallStats(state.answers, state.completedDays),
    [state.answers, state.completedDays],
  );
  const rank = rankForCorrect(stats.correct);
  const complete = stats.totalDays > 0 && stats.completedDays >= stats.totalDays;

  const dates = Object.values(state.completedAt).sort();
  const date = dates.length ? dates[dates.length - 1] : today();

  const payload: CertPayload = {
    name: state.name,
    score: stats.score,
    done: stats.completedDays,
    total: stats.totalDays,
    rankId: rank.id,
    date,
    rate: stats.rate,
  };
  const filledDays = DAYS.map((day) => state.completedDays.includes(day.day));

  if (!state.hydrated) {
    return (
      <PhoneFrame scroll={false}>
        <View />
      </PhoneFrame>
    );
  }

  const onShareText = async () => {
    setStatus(null);
    try {
      const out = await shareText(shareMessage(payload, rank.name), certLink(payload));
      setStatus(OUTCOME_MSG[out]);
    } catch {
      setStatus(OUTCOME_MSG.unsupported);
    }
  };
  const onSaveImage = async () => {
    setStatus(null);
    try {
      const out = await shareImage(shotRef, 'shobo-kara-boki.png');
      setStatus(OUTCOME_MSG[out]);
    } catch {
      setStatus(OUTCOME_MSG.unsupported);
    }
  };

  return (
    <PhoneFrame
      footer={
        <View style={{ gap: space(2.5) }}>
          <Button label="結果をシェアする" onPress={onShareText} />
          <Button label="画像として保存する" variant="secondary" onPress={onSaveImage} />
          <Button
            label="もどる"
            variant="ghost"
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          />
        </View>
      }
    >
      <Text style={styles.h1}>{complete ? '修了証' : 'いまの成績表'}</Text>
      <Text style={styles.sub}>
        名前を入れると修了証に載ります（この端末に保存されるだけです）。
      </Text>

      <TextInput
        value={state.name}
        onChangeText={(t) => setName(t.slice(0, 24))}
        placeholder="なまえ（任意）"
        placeholderTextColor={colors.textFaint}
        style={styles.input}
        maxLength={24}
      />

      <View ref={shotRef} collapsable={false} style={styles.shot}>
        <CertCard
          name={state.name}
          rankName={rank.name}
          rankNote={rank.note}
          score={stats.score}
          ratePct={Math.round(stats.rate * 100)}
          done={stats.completedDays}
          total={stats.totalDays}
          date={date}
          filledDays={filledDays}
          complete={complete}
        />
      </View>

      {status ? <Text style={styles.status}>{status}</Text> : null}

      <Text style={styles.note}>
        ※シェアされる修了証は自己申告のカードです（公的な資格の証明ではありません）。
      </Text>
    </PhoneFrame>
  );
}

/* ------------------------------------------------------------- guest mode */

function GuestCert({ payload }: { payload: CertPayload }) {
  const rank = rankById(payload.rankId);
  const complete = payload.total > 0 && payload.done >= payload.total;
  const filledDays = Array.from({ length: payload.total }, (_, i) => i < payload.done);

  return (
    <PhoneFrame
      footer={
        <Button label="自分もやってみる" onPress={() => router.replace('/')} />
      }
    >
      <Text style={styles.h1}>{payload.name || 'だれか'} さんの{complete ? '修了証' : '成績表'}</Text>
      <Text style={styles.sub}>「カフェ簿記」で受け取った記録です。</Text>

      <View style={styles.shot}>
        <CertCard
          name={payload.name}
          rankName={rank.name}
          rankNote={rank.note}
          score={payload.score}
          ratePct={Math.round(payload.rate * 100)}
          done={payload.done}
          total={payload.total}
          date={payload.date}
          filledDays={filledDays}
          complete={complete}
        />
      </View>
    </PhoneFrame>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: font.h1, fontWeight: '900', color: colors.text, paddingTop: space(2) },
  sub: { fontSize: font.small, color: colors.textMuted, lineHeight: 20 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: space(3.5),
    paddingVertical: space(3),
    fontSize: font.body,
    color: colors.text,
  },
  shot: { backgroundColor: colors.bg, paddingVertical: space(2) },
  status: {
    fontSize: font.small,
    fontWeight: '700',
    color: colors.primaryDark,
    textAlign: 'center',
  },
  note: { fontSize: font.tiny, color: colors.textFaint, lineHeight: 16 },
});
