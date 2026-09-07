import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { PhoneFrame } from '@/components/PhoneFrame';
import { Button, Card } from '@/components/ui';
import { ConfirmModal } from '@/components/ConfirmModal';
import { decodeProgress, encodeProgress } from '@/transfer';
import { shareText } from '@/share';
import { useGame } from '@/state/GameContext';
import { colors, font, space } from '@/theme';

export default function Transfer() {
  const { state, importState } = useGame();
  const [paste, setPaste] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [pendingImport, setPendingImport] = useState<ReturnType<
    typeof decodeProgress
  > | null>(null);

  const code = useMemo(() => {
    const { hydrated: _drop, ...persist } = state;
    return encodeProgress(persist);
  }, [state]);

  const copy = async () => {
    setStatus(null);
    try {
      const out = await shareText('「カフェ簿記」の引き継ぎコード', code);
      setStatus(
        out === 'copied'
          ? 'コードをコピーしました'
          : out === 'shared'
            ? 'コードを共有しました'
            : 'コピーできませんでした。手動で選択してコピーしてください',
      );
    } catch {
      setStatus('コピーできませんでした。手動で選択してコピーしてください');
    }
  };

  const tryImport = () => {
    setStatus(null);
    const parsed = decodeProgress(paste);
    if (!parsed) {
      setStatus('コードが読み取れませんでした。全文が貼れているか確認してください');
      return;
    }
    setPendingImport(parsed);
  };

  const doImport = () => {
    if (pendingImport) importState(pendingImport);
    setPendingImport(null);
    router.replace('/');
  };

  return (
    <PhoneFrame
      footer={
        <Button label="もどる" variant="ghost" onPress={() => router.back()} />
      }
    >
      <View style={styles.head}>
        <Text style={styles.title}>進捗の引き継ぎ</Text>
        <Text style={styles.sub}>
          進捗はこの端末のブラウザ／アプリ内だけに保存されます。機種変更や
          データ消去の前に、コードを控えておいてください。
        </Text>
      </View>

      <Card>
        <Text style={styles.cardTitle}>あなたの引き継ぎコード</Text>
        <TextInput
          value={code}
          editable={false}
          multiline
          style={styles.codeBox}
          selectTextOnFocus
        />
        <Button label="コードをコピー" onPress={copy} />
      </Card>

      <Card>
        <Text style={styles.cardTitle}>コードを読み込む</Text>
        <Text style={styles.warn}>
          読み込むと、いまの端末の進捗は上書きされます。
        </Text>
        <TextInput
          value={paste}
          onChangeText={setPaste}
          multiline
          placeholder="ここにコードを貼り付け"
          placeholderTextColor={colors.textFaint}
          style={styles.pasteBox}
        />
        <Button
          label="読み込む"
          variant="secondary"
          onPress={tryImport}
          disabled={!paste.trim()}
        />
      </Card>

      {status ? <Text style={styles.status}>{status}</Text> : null}

      <ConfirmModal
        visible={pendingImport !== null}
        title="この進捗を読み込みますか？"
        body="いまの端末の進捗は上書きされます。元に戻せません。"
        confirmLabel="読み込む"
        destructive
        onConfirm={doImport}
        onCancel={() => setPendingImport(null)}
      />
    </PhoneFrame>
  );
}

const styles = StyleSheet.create({
  head: { gap: space(1), paddingTop: space(2) },
  title: { fontSize: font.h1, fontWeight: '900', color: colors.text },
  sub: { fontSize: font.small, color: colors.textMuted, lineHeight: 20 },
  cardTitle: { fontSize: font.h3, fontWeight: '800', color: colors.text },
  warn: { fontSize: font.small, color: colors.negative },
  codeBox: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    padding: space(3),
    fontSize: font.tiny,
    color: colors.textMuted,
    minHeight: 90,
  },
  pasteBox: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: space(3),
    fontSize: font.small,
    color: colors.text,
    minHeight: 90,
  },
  status: {
    fontSize: font.small,
    fontWeight: '700',
    color: colors.primaryDark,
    textAlign: 'center',
  },
});
