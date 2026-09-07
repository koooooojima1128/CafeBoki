import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { PhoneFrame } from '@/components/PhoneFrame';
import { Button, Card } from '@/components/ui';
import {
  ACCOUNTS,
  AccountType,
  CATEGORY_LABEL,
  accountNormalSide,
} from '@/engine/accounts';
import { ACCOUNT_NOTES } from '@/data/accountNotes';
import { colors, font, radius, space } from '@/theme';

const ORDER: AccountType[] = ['asset', 'liability', 'equity', 'revenue', 'expense'];

export default function Reference() {
  const [q, setQ] = useState('');

  const groups = useMemo(() => {
    const kw = q.trim();
    return ORDER.map((type) => ({
      type,
      label: CATEGORY_LABEL[type],
      rows: Object.values(ACCOUNTS)
        .filter((a) => a.type === type)
        .filter(
          (a) =>
            !kw ||
            a.name.includes(kw) ||
            (ACCOUNT_NOTES[a.id] ?? '').includes(kw),
        ),
    })).filter((g) => g.rows.length > 0);
  }, [q]);

  return (
    <PhoneFrame
      footer={
        <Button label="もどる" variant="secondary" onPress={() => router.back()} />
      }
    >
      <View style={styles.head}>
        <Text style={styles.title}>勘定科目じてん</Text>
        <Text style={styles.sub}>迷ったらここ。借方・貸方どちらでふえるかつき。</Text>
      </View>

      {/* cheat sheet */}
      <Card>
        <Text style={styles.cheatTitle}>借方（かりかた）と貸方（かしかた）</Text>
        <View style={styles.cheatRow}>
          <View style={[styles.cheatCol, styles.cheatDebit]}>
            <Text style={[styles.cheatSide, { color: colors.debitText }]}>
              借方（左）でふえる
            </Text>
            <Text style={styles.cheatItems}>資産 ・ 費用</Text>
            <Text style={styles.cheatHint}>残高も左に出る</Text>
          </View>
          <View style={[styles.cheatCol, styles.cheatCredit]}>
            <Text style={[styles.cheatSide, { color: colors.creditText }]}>
              貸方（右）でふえる
            </Text>
            <Text style={styles.cheatItems}>負債 ・ 純資産 ・ 収益</Text>
            <Text style={styles.cheatHint}>残高も右に出る</Text>
          </View>
        </View>
        <Text style={styles.cheatFoot}>
          「へる」ときは反対側。評価勘定（貸倒引当金・減価償却累計額）は資産だが貸方でふえる。
        </Text>
      </Card>

      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder="科目名・意味で検索"
        placeholderTextColor={colors.textFaint}
        style={styles.search}
      />

      {groups.map((g) => (
        <View key={g.type} style={styles.group}>
          <Text style={styles.groupLabel}>{g.label}</Text>
          {g.rows.map((a) => {
            const isDebit = accountNormalSide(a) === 'debit';
            return (
              <Pressable
                key={a.id}
                style={({ pressed }) => [styles.item, pressed && { opacity: 0.85 }]}
                onPress={() => router.push(`/ledger?acct=${a.id}` as never)}
              >
                <View style={styles.itemTop}>
                  <Text style={styles.itemName}>{a.name}</Text>
                  <View
                    style={[
                      styles.sideChip,
                      isDebit ? styles.sideDebit : styles.sideCredit,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sideChipText,
                        { color: isDebit ? colors.debitText : colors.creditText },
                      ]}
                    >
                      {isDebit ? '借方でふえる' : '貸方でふえる'}
                      {a.contra ? '（評価勘定）' : ''}
                    </Text>
                  </View>
                </View>
                <Text style={styles.itemNote}>{ACCOUNT_NOTES[a.id] ?? ''}</Text>
                <Text style={styles.itemLink}>T字（総勘定元帳）でみる ▸</Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </PhoneFrame>
  );
}

const styles = StyleSheet.create({
  head: { gap: space(1), paddingTop: space(2) },
  title: { fontSize: font.h1, fontWeight: '900', color: colors.text },
  sub: { fontSize: font.small, color: colors.textMuted },

  cheatTitle: { fontSize: font.h3, fontWeight: '800', color: colors.text },
  cheatRow: { flexDirection: 'row', gap: space(2) },
  cheatCol: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: space(3),
    gap: space(1),
  },
  cheatDebit: { backgroundColor: colors.debitBg, borderColor: colors.debitBorder },
  cheatCredit: { backgroundColor: colors.creditBg, borderColor: colors.creditBorder },
  cheatSide: { fontSize: font.small, fontWeight: '900' },
  cheatItems: { fontSize: font.body, fontWeight: '800', color: colors.text },
  cheatHint: { fontSize: font.tiny, color: colors.textFaint },
  cheatFoot: { fontSize: font.tiny, color: colors.textMuted, lineHeight: 17 },

  search: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: space(3.5),
    paddingVertical: space(3),
    fontSize: font.body,
    color: colors.text,
  },

  group: { gap: space(2) },
  groupLabel: {
    fontSize: font.small,
    fontWeight: '900',
    color: colors.textMuted,
    marginTop: space(1),
  },
  item: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: space(3.5),
    gap: space(1),
  },
  itemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space(2),
  },
  itemName: { fontSize: font.h3, fontWeight: '800', color: colors.text, flexShrink: 1 },
  sideChip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: space(2),
    paddingVertical: space(0.5),
  },
  sideDebit: { backgroundColor: colors.debitBg, borderColor: colors.debitBorder },
  sideCredit: { backgroundColor: colors.creditBg, borderColor: colors.creditBorder },
  sideChipText: { fontSize: font.tiny, fontWeight: '800' },
  itemNote: { fontSize: font.small, color: colors.textMuted, lineHeight: 19 },
  itemLink: { fontSize: font.tiny, fontWeight: '700', color: colors.primary },
});
