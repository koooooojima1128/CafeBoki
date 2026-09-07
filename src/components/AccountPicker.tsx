import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ACCOUNTS,
  AccountType,
  CATEGORY_LABEL,
} from '@/engine/accounts';
import { colors, font, radius, space } from '@/theme';

const ORDER: AccountType[] = ['asset', 'liability', 'equity', 'revenue', 'expense'];

interface Props {
  visible: boolean;
  onPick: (accountId: string) => void;
  onClose: () => void;
}

export function AccountPicker({ visible, onPick, onClose }: Props) {
  const [q, setQ] = useState('');

  useEffect(() => {
    if (visible) setQ('');
  }, [visible]);

  const groups = useMemo(() => {
    const kw = q.trim();
    return ORDER.map((type) => ({
      type,
      label: CATEGORY_LABEL[type],
      rows: Object.values(ACCOUNTS)
        .filter((a) => a.type === type)
        .filter((a) => !kw || a.name.includes(kw)),
    })).filter((g) => g.rows.length);
  }, [q]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.wrap} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.title}>勘定科目をえらぶ</Text>
          <Pressable onPress={onClose} hitSlop={10}>
            <Text style={styles.close}>とじる</Text>
          </Pressable>
        </View>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="科目名で検索"
          placeholderTextColor={colors.textFaint}
          style={styles.search}
          autoFocus
        />
        <ScrollView contentContainerStyle={styles.list}>
          {groups.map((g) => (
            <View key={g.type} style={styles.group}>
              <Text style={styles.groupLabel}>{g.label}</Text>
              <View style={styles.chips}>
                {g.rows.map((a) => (
                  <Pressable
                    key={a.id}
                    style={styles.chip}
                    onPress={() => {
                      onPick(a.id);
                      onClose();
                    }}
                  >
                    <Text style={styles.chipText}>{a.name}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: space(4),
  },
  title: { fontSize: font.h2, fontWeight: '900', color: colors.text },
  close: { fontSize: font.body, fontWeight: '800', color: colors.primary },
  search: {
    marginHorizontal: space(4),
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: space(3.5),
    paddingVertical: space(3),
    fontSize: font.body,
    color: colors.text,
  },
  list: { padding: space(4), gap: space(3) },
  group: { gap: space(2) },
  groupLabel: { fontSize: font.small, fontWeight: '900', color: colors.textMuted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space(2) },
  chip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: space(3.5),
    paddingVertical: space(2),
  },
  chipText: { fontSize: font.small, fontWeight: '700', color: colors.text },
});
