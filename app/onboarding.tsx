import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { PhoneFrame } from '@/components/PhoneFrame';
import { Button } from '@/components/ui';
import { colors, font, space } from '@/theme';

const SLIDES = [
  {
    emoji: '☕',
    title: 'あなたはカフェのオーナー',
    body: 'カフェ「MY CAFE」を開業します。仕入れて、売って、家賃や給料を払う。ふつうの商売をしていきます。',
  },
  {
    emoji: '🔍',
    title: 'まず「何が起きた？」を考える',
    body: 'それぞれの出来事で、会社の中で何が増えて何が減ったのかを選びます。暗記ではなく、イメージから入ります。',
  },
  {
    emoji: '🈺',
    title: 'それを簿記に翻訳する',
    body: '会社の変化を、借方・貸方の仕訳に置きかえます。最後に、1日分の取引をまとめて決算書（PL / BS）にします。',
  },
];

export default function Onboarding() {
  const [i, setI] = useState(0);
  const last = i === SLIDES.length - 1;
  const slide = SLIDES[i];

  const next = () => {
    if (last) router.replace('/play');
    else setI((n) => n + 1);
  };

  return (
    <PhoneFrame
      footer={
        <View style={{ gap: space(2) }}>
          <Button label={last ? 'カフェを始める' : 'つぎへ'} onPress={next} />
          <Button
            label="スキップ"
            variant="ghost"
            onPress={() => router.replace('/play')}
          />
          {last ? (
            <View style={styles.legalRow}>
              <Text style={styles.legalText}>続けると </Text>
              <Text
                style={styles.legalLink}
                onPress={() => router.push('/terms')}
              >
                利用規約
              </Text>
              <Text style={styles.legalText}> と </Text>
              <Text
                style={styles.legalLink}
                onPress={() => router.push('/privacy')}
              >
                プライバシーポリシー
              </Text>
              <Text style={styles.legalText}> に同意したものとみなされます。</Text>
            </View>
          ) : null}
        </View>
      }
    >
      <View style={styles.dots}>
        {SLIDES.map((_, n) => (
          <View key={n} style={[styles.dot, n === i && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.center}>
        <Text style={styles.emoji}>{slide.emoji}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.body}>{slide.body}</Text>
      </View>
    </PhoneFrame>
  );
}

const styles = StyleSheet.create({
  legalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: space(2),
  },
  legalText: { fontSize: font.tiny, color: colors.textFaint, lineHeight: 17 },
  legalLink: {
    fontSize: font.tiny,
    color: colors.primary,
    fontWeight: '700',
    lineHeight: 17,
  },
  dots: {
    flexDirection: 'row',
    gap: space(2),
    justifyContent: 'center',
    paddingTop: space(4),
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: { backgroundColor: colors.primary, width: 22 },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space(4),
    paddingVertical: space(10),
  },
  emoji: { fontSize: 64 },
  title: {
    fontSize: font.h1,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
  },
  body: {
    fontSize: font.body,
    color: colors.textMuted,
    lineHeight: 24,
    textAlign: 'center',
  },
});
