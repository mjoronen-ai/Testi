/**
 * TARRAKIRJA
 *
 * Jokaisesta loppuun luetusta sadusta saa tarran. Kerääminen antaa lapselle
 * myönteisen onnistumisen tunteen ja houkuttelee kokeilemaan uusia satuja.
 *
 * Tarkoituksella EI ole "putkia" (päiviä peräkkäin) eikä menetettäviä palkintoja:
 * lasten sovelluksissa ei pidä painostaa käyttämään sovellusta joka päivä.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ALL_STORIES, getRecommended, storyColor } from '@/data/storyRepository';
import { SecondaryButton } from '@/components/Buttons';
import { useAppData } from '@/storage/AppDataContext';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { radius, shade, softShadow, spacing } from '@/theme/theme';
import { levelFor } from '@/data/levels';

export default function StickersScreen() {
  const { completed, colors, profile } = useAppData();
  const earned = ALL_STORIES.filter((s) => completed[s.id]);
  const { current, next } = levelFor(earned.length);
  // Palkki näyttää edistymisen seuraavaan tasoon (ei koko kirjastoon, joka on iso).
  const pct = next ? (earned.length - current.min) / (next.min - current.min) : 1;

  // Ansaitut ensin (ansaintajärjestyksessä), sitten muutama ikään sopiva puuttuva tarra.
  const SUGGESTED = 9;
  const missing = getRecommended(profile.age, Object.keys(completed))
    .filter((s) => !completed[s.id])
    .slice(0, SUGGESTED);
  const ordered = [...earned.sort((a, b) => completed[a.id].firstAt - completed[b.id].firstAt), ...missing];
  const remaining = ALL_STORIES.length - earned.length - missing.length;

  return (
    <Screen title="Tarrakirja" subtitle="Lue satu loppuun, niin saat tarran!">
      {/* ---------- Taso ja edistyminen ---------- */}
      <View style={[styles.levelCard, softShadow('#B07A1E', 1.2)]}>
        <LinearGradient colors={['#FFD976', '#F4A93F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: radius.xl }]} />
        <View style={styles.levelRow}>
          <View style={styles.levelEmojiWrap}>
            <AppText style={{ fontSize: 40, lineHeight: 48 }}>{current.emoji}</AppText>
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="overline" color="#6B3E00">
              Tasosi
            </AppText>
            <AppText variant="hero" color="#3A2200">
              {current.title}
            </AppText>
          </View>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.max(3, pct * 100)}%` }]} />
        </View>
        <AppText variant="subtitle" color="#3A2200">
          {earned.length} / {ALL_STORIES.length} tarraa
          {next ? `  ·  Vielä ${next.min - earned.length} tasoon ${next.emoji}` : '  ·  Kaikki kerätty! 🎉'}
        </AppText>
      </View>

      {/* ---------- Tarraruudukko ---------- */}
      <View style={styles.grid}>
        {ordered.map((s) => {
          const has = !!completed[s.id];
          const base = storyColor(s);
          return (
            <PressableScale
              key={s.id}
              onPress={() => router.push(`/story/${s.id}`)}
              accessibilityRole="button"
              accessibilityLabel={has ? `Tarra: ${s.title}` : `Puuttuva tarra: ${s.title}. Lue satu.`}
              style={styles.slot}
            >
              {has ? (
                <View style={[styles.sticker, softShadow(base, 1)]}>
                  <LinearGradient colors={[shade(base, 0.35), base]} style={[StyleSheet.absoluteFill, { borderRadius: 999 }]} />
                  <AppText style={styles.stickerEmoji}>{s.emoji ?? '📖'}</AppText>
                </View>
              ) : (
                <View style={[styles.sticker, styles.missing, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}>
                  <AppText style={[styles.stickerEmoji, { opacity: 0.18 }]}>{s.emoji ?? '📖'}</AppText>
                </View>
              )}
              <AppText variant="caption" numberOfLines={2} muted={!has} style={styles.slotTitle}>
                {s.title}
              </AppText>
            </PressableScale>
          );
        })}
      </View>

      {remaining > 0 ? (
        <View style={{ gap: spacing.sm, alignItems: 'stretch' }}>
          <AppText muted style={{ textAlign: 'center' }}>
            …ja vielä {remaining} satua odottaa löytäjäänsä!
          </AppText>
          <SecondaryButton label="Etsi lisää satuja" icon="compass-outline" onPress={() => router.push('/explore')} />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  levelCard: { borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  levelEmojiWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: { height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.5)', overflow: 'hidden' },
  fill: { height: 12, borderRadius: 6, backgroundColor: '#FFFFFF' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.lg },
  slot: { width: 100, alignItems: 'center', gap: spacing.sm },
  sticker: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  missing: { borderStyle: 'dashed', borderWidth: 2 },
  stickerEmoji: { fontSize: 40, lineHeight: 48 },
  slotTitle: { textAlign: 'center' },
});
