import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { PhoneFrame } from '@/components/PhoneFrame';
import { Card } from '@/components/ui';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useGame } from '@/state/GameContext';
import { colors, ff, font, radius, shadow, space } from '@/theme';

type Row = { label: string; hint: string; href: string; icon: string };

const ROWS: Row[] = [
  { label: '進捗の引き継ぎ', hint: '機種変更・データ消去の前に', href: '/transfer', icon: '🔑' },
  { label: '使い方', hint: 'あそびかたをもう一度', href: '/onboarding', icon: '🧭' },
  { label: 'プライバシーポリシー', hint: '', href: '/privacy', icon: '🔒' },
  { label: '利用規約', hint: '', href: '/terms', icon: '📄' },
];

export default function Settings() {
  const { state, setName, resetAll } = useGame();
  const [name, setLocalName] = useState(state.name);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <PhoneFrame tab="settings">
      <Text style={styles.h1}>設定</Text>

      <Card>
        <Text style={styles.cardTitle}>なまえ</Text>
        <Text style={styles.cardSub}>
          修了証・成績表に載ります。この端末に保存されるだけです。
        </Text>
        <TextInput
          value={name}
          onChangeText={setLocalName}
          onBlur={() => setName(name.trim())}
          placeholder="なまえ（任意）"
          placeholderTextColor={colors.textFaint}
          style={styles.input}
          maxLength={20}
        />
      </Card>

      <View style={styles.list}>
        {ROWS.map((r) => (
          <Pressable
            key={r.href}
            style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
            onPress={() => router.push(r.href as never)}
          >
            <Text style={styles.rowIcon}>{r.icon}</Text>
            <View style={styles.rowBody}>
              <Text style={styles.rowLabel}>{r.label}</Text>
              {r.hint ? <Text style={styles.rowHint}>{r.hint}</Text> : null}
            </View>
            <Text style={styles.rowChev}>›</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={({ pressed }) => [styles.reset, pressed && { opacity: 0.85 }]}
        onPress={() => setConfirmReset(true)}
      >
        <Text style={styles.resetText}>はじめからやり直す</Text>
      </Pressable>

      <Text style={styles.credit}>
        カフェ簿記 v1 ・ 静的データのみで動作します{'\n'}
        ヘッダー写真：Unsplash（商用利用可）
      </Text>

      <ConfirmModal
        visible={confirmReset}
        title="最初からやり直しますか？"
        body="これまでの進捗・正答・称号がすべて消えます。元に戻せません。（引き継ぎコードは「進捗の引き継ぎ」で控えられます）"
        confirmLabel="やり直す"
        destructive
        onConfirm={() => {
          setConfirmReset(false);
          setLocalName('');
          resetAll();
          router.replace('/');
        }}
        onCancel={() => setConfirmReset(false)}
      />
    </PhoneFrame>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: font.h1, fontFamily: ff.bold, fontWeight: '900', color: colors.text },

  cardTitle: { fontSize: font.h3, fontFamily: ff.bold, fontWeight: '800', color: colors.text },
  cardSub: { fontSize: font.small, color: colors.textMuted, lineHeight: 19 },
  input: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: space(3.5),
    paddingVertical: space(3),
    fontSize: font.body,
    color: colors.text,
  },

  list: { gap: space(2.5) },
  row: {
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
  rowIcon: { fontSize: 20 },
  rowBody: { flex: 1, gap: 2 },
  rowLabel: { fontSize: font.body, fontFamily: ff.bold, fontWeight: '800', color: colors.text },
  rowHint: { fontSize: font.tiny, color: colors.textFaint },
  rowChev: { fontSize: font.h1, color: colors.textFaint, fontWeight: '300' },

  reset: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.wrongBorder,
    backgroundColor: colors.wrongBg,
    paddingVertical: space(3.5),
    alignItems: 'center',
    marginTop: space(2),
  },
  resetText: { fontSize: font.body, fontWeight: '800', color: colors.negative },

  credit: {
    fontSize: font.tiny,
    color: colors.textFaint,
    lineHeight: 16,
    textAlign: 'center',
    paddingTop: space(2),
  },
});
