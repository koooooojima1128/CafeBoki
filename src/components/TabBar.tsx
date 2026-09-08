import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors, ff, font, space } from '@/theme';

export type TabKey = 'home' | 'progress' | 'settings';

const TABS: { key: TabKey; label: string; icon: string; href: string }[] = [
  { key: 'home', label: 'ホーム', icon: '☕', href: '/' },
  { key: 'progress', label: '進捗', icon: '📈', href: '/progress' },
  { key: 'settings', label: '設定', icon: '⚙️', href: '/settings' },
];

/** Fixed bottom navigation for the three main screens. */
export function TabBar({ active }: { active: TabKey }) {
  return (
    <View style={styles.bar}>
      {TABS.map((t) => {
        const on = t.key === active;
        return (
          <Pressable
            key={t.key}
            style={styles.item}
            hitSlop={6}
            onPress={() => {
              if (!on) router.replace(t.href as never);
            }}
          >
            <Text style={[styles.icon, on ? styles.iconOn : styles.iconOff]}>
              {t.icon}
            </Text>
            <Text style={[styles.label, on && styles.labelOn]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    paddingTop: space(2),
    paddingBottom: space(2.5),
  },
  item: { flex: 1, alignItems: 'center', gap: 3 },
  icon: { fontSize: 20 },
  iconOn: { opacity: 1 },
  iconOff: { opacity: 0.4 },
  label: {
    fontSize: font.tiny,
    fontFamily: ff.bold,
    fontWeight: '800',
    color: colors.textFaint,
  },
  labelOn: { color: colors.primary },
});
