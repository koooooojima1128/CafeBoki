import React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabBar, type TabKey } from './TabBar';
import { colors, PHONE_MAX_WIDTH, radius, space } from '@/theme';

interface Props {
  children: React.ReactNode;
  /** Sticky footer area (usually the primary CTA). */
  footer?: React.ReactNode;
  scroll?: boolean;
  /** When set, shows the bottom tab navigation with this tab active. */
  tab?: TabKey;
}

/**
 * Centered phone-width column. On web it gets a soft card frame so the
 * mobile-first layout reads correctly on a desktop browser.
 */
export function PhoneFrame({ children, footer, scroll = true, tab }: Props) {
  return (
    <View style={styles.outer}>
      <SafeAreaView style={styles.frame} edges={['top', 'bottom']}>
        {scroll ? (
          <ScrollView
            style={styles.body}
            contentContainerStyle={[
              styles.bodyContent,
              tab ? styles.bodyContentTabbed : null,
            ]}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.body, styles.bodyContent]}>{children}</View>
        )}
        {footer ? <View style={styles.footer}>{footer}</View> : null}
        {tab ? <TabBar active={tab} /> : null}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#E7E0D2' : colors.bg,
    alignItems: 'center',
  },
  frame: {
    flex: 1,
    width: '100%',
    maxWidth: PHONE_MAX_WIDTH,
    backgroundColor: colors.bg,
    ...Platform.select({
      web: {
        marginVertical: 16,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.borderStrong,
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
      },
      default: {},
    }),
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: space(5),
    paddingBottom: space(8),
    gap: space(4),
  },
  bodyContentTabbed: {
    paddingBottom: space(12),
  },
  footer: {
    padding: space(4),
    paddingTop: space(3),
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
    gap: space(2.5),
  },
});
