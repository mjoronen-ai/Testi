/**
 * StoryCover: sadun "kansikuva".
 *
 * Kuvitusta ei tarvita: kansi piirretään sadun väristä tehdyllä liukuvärillä,
 * isolla emojilla ja muutamalla koristetähdellä. Tähtien paikat lasketaan sadun
 * id:stä, joten jokaisella sadulla on oma, aina samanlainen kansi.
 */
import React, { useMemo } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Story } from '@/types/story';
import { storyColor } from '@/data/storyRepository';
import { shade } from '@/theme/theme';

interface Props {
  story: Story;
  width: number | `${number}%`;
  height: number;
  emojiSize?: number;
  radius?: number;
  /** Näytä pieni "luettu"-merkki kulmassa. */
  done?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Yksinkertainen toistettava "satunnaisluku" merkkijonosta. */
function seeded(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function StoryCover({ story, width, height, emojiSize, radius = 20, done, style }: Props) {
  const base = storyColor(story);
  const size = emojiSize ?? Math.round(height * 0.42);

  // Koristeet: muutama pehmeä ympyrä ja tähti.
  const decor = useMemo(() => {
    const rnd = seeded(story.id);
    const stars = Array.from({ length: 5 }, () => ({
      left: `${Math.round(rnd() * 85 + 5)}%` as const,
      top: `${Math.round(rnd() * 80 + 5)}%` as const,
      size: 8 + Math.round(rnd() * 10),
      opacity: 0.35 + rnd() * 0.4,
    }));
    return { stars, bubbleLeft: rnd() > 0.5 };
  }, [story.id]);

  return (
    <View style={[{ width, height, borderRadius: radius, overflow: 'hidden' }, style]}>
      <LinearGradient
        colors={[shade(base, 0.25), base, shade(base, -0.2)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Isot pehmeät "kuplat" taustalla */}
      <View
        style={[
          styles.bubble,
          { width: height * 0.9, height: height * 0.9, borderRadius: height, top: -height * 0.35 },
          decor.bubbleLeft ? { left: -height * 0.3 } : { right: -height * 0.3 },
        ]}
      />
      <View
        style={[
          styles.bubble,
          { width: height * 0.6, height: height * 0.6, borderRadius: height, bottom: -height * 0.25 },
          decor.bubbleLeft ? { right: -height * 0.15 } : { left: -height * 0.15 },
        ]}
      />
      {decor.stars.map((s, i) => (
        <Text
          key={i}
          style={[styles.star, { left: s.left, top: s.top, fontSize: s.size, lineHeight: s.size + 2, opacity: s.opacity }]}
        >
          ✦
        </Text>
      ))}
      <View style={styles.center}>
        <Text style={[styles.emoji, { fontSize: size, lineHeight: size * 1.2 }]}>{story.emoji ?? '📖'}</Text>
      </View>
      {done ? (
        <View style={styles.done}>
          <Text style={styles.doneText}>✓</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.22)' },
  star: { position: 'absolute', color: '#FFFFFF' },
  center: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  emoji: {
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  done: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneText: { color: '#3E9B5F', fontWeight: '900', fontSize: 15 },
});
