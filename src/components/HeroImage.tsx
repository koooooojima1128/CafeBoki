import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { ff, font, space } from '@/theme';

const PHOTO = require('../../assets/hero-cafe.jpg');

/**
 * Photographic header for the home screen — café photo with a dark scrim
 * and the app title / tagline in white. Bleeds to the frame edges.
 */
export function HeroImage({
  title,
  tagline,
}: {
  title: string;
  tagline: string;
}) {
  return (
    <ImageBackground source={PHOTO} style={styles.photo} resizeMode="cover">
      <View style={styles.scrim} />
      <View style={styles.scrimTop} />
      <View style={styles.inner}>
        <Text style={styles.mark}>☕</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.tagline}>{tagline}</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  photo: {
    marginTop: -space(5),
    marginHorizontal: -space(5),
    minHeight: 300,
    justifyContent: 'flex-end',
    backgroundColor: '#20423C',
  },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,32,29,0.44)' },
  scrimTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 120,
    backgroundColor: 'rgba(15,32,29,0.35)',
  },
  inner: {
    paddingHorizontal: space(6),
    paddingTop: space(14),
    paddingBottom: space(9),
    gap: space(2),
  },
  mark: { fontSize: 30 },
  title: {
    fontSize: 34,
    fontFamily: ff.bold,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: font.body,
    fontFamily: ff.regular,
    color: 'rgba(255,255,255,0.92)',
    lineHeight: 23,
  },
});
