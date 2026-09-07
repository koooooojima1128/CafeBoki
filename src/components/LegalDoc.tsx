import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { PhoneFrame } from '@/components/PhoneFrame';
import { Button } from '@/components/ui';
import type { LegalDocContent } from '@/legal';
import { colors, font, space } from '@/theme';

export function LegalDoc({ doc }: { doc: LegalDocContent }) {
  return (
    <PhoneFrame
      footer={
        <Button label="もどる" variant="secondary" onPress={() => router.back()} />
      }
    >
      <View style={styles.head}>
        <Text style={styles.title}>{doc.title}</Text>
        <Text style={styles.updated}>最終更新：{doc.updated}</Text>
      </View>

      {doc.intro.map((t, i) => (
        <Text key={`intro-${i}`} style={styles.body}>
          {t}
        </Text>
      ))}

      {doc.sections.map((s) => (
        <View key={s.h} style={styles.section}>
          <Text style={styles.h}>{s.h}</Text>
          {s.p.map((t, i) => (
            <Text key={i} style={styles.body}>
              {t}
            </Text>
          ))}
        </View>
      ))}
    </PhoneFrame>
  );
}

const styles = StyleSheet.create({
  head: { gap: space(1), paddingTop: space(2) },
  title: { fontSize: font.h1, fontWeight: '900', color: colors.text },
  updated: { fontSize: font.small, color: colors.textFaint },
  section: { gap: space(1.5), marginTop: space(2) },
  h: { fontSize: font.h3, fontWeight: '800', color: colors.text },
  body: { fontSize: font.body, color: colors.textMuted, lineHeight: 23 },
});
