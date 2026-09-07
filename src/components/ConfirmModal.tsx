import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, space } from '@/theme';
import { Button } from './ui';

interface Props {
  visible: boolean;
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  visible,
  title,
  body,
  confirmLabel = 'OK',
  cancelLabel = 'やめる',
  destructive,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>{title}</Text>
          {body ? <Text style={styles.body}>{body}</Text> : null}
          <View style={styles.actions}>
            <Button
              label={confirmLabel}
              variant={destructive ? 'accent' : 'primary'}
              onPress={onConfirm}
            />
            <Button label={cancelLabel} variant="ghost" onPress={onCancel} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(20,25,24,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: space(6),
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space(5),
    gap: space(3),
  },
  title: { fontSize: font.h3, fontWeight: '900', color: colors.text },
  body: { fontSize: font.body, color: colors.textMuted, lineHeight: 22 },
  actions: { gap: space(1.5), marginTop: space(1) },
});
