/**
 * ETUSIVU
 *  - Päivän satu (iso kortti)
 *  - Jatka lukemista (jos jokin satu on kesken)
 *  - Kaikki sadut listana
 */
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ALL_STORIES, getStory, getStoryOfTheDay, storyColor } from '@/data/storyRepository';
import { useAppData } from '@/storage/AppDataContext';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/AppText';
import { StoryCardList } from '@/components/StoryCard';
import { IconButton } from '@/components/IconButton';
import { radius, spacing } from '@/theme/theme';

const DARK_TEXT = '#3B2F2A';

export default function HomeScreen() {
  const { progress, colors, nightMode, toggleNightMode } = useAppData();
  const storyOfTheDay = getStoryOfTheDay();

  // Viimeksi luettu keskeneräinen satu (ei aivan alussa eikä lopussa).
  const continueStory = useMemo(() => {
    const unfinished = Object.entries(progress)
      .filter(([, p]) => p.ratio > 0.02 && p.ratio < 0.97)
      .sort((a, b) => b[1].updatedAt - a[1].updatedAt);
    for (const [id, p] of unfinished) {
      const story = getStory(id);
      if (story) return { story, percent: Math.round(p.ratio * 100) };
    }
    return null;
  }, [progress]);

  return (
    <Screen
      title="Satukirja"
      subtitle="Mikä satu luetaan tänään?"
      headerRight={
        <IconButton
          icon={nightMode ? 'sunny' : 'moon'}
          onPress={toggleNightMode}
          accessibilityLabel={nightMode ? 'Vaihda päivätilaan' : 'Vaihda yötilaan'}
        />
      }
    >
      {storyOfTheDay ? (
        <Pressable
          onPress={() => router.push(`/story/${storyOfTheDay.id}`)}
          accessibilityRole="button"
          accessibilityLabel={`Päivän satu: ${storyOfTheDay.title}`}
          style={({ pressed }) => [
            styles.featured,
            { backgroundColor: storyColor(storyOfTheDay), opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <AppText variant="caption" color={DARK_TEXT} style={styles.featuredLabel}>
            ✨ PÄIVÄN SATU
          </AppText>
          <AppText style={styles.featuredEmoji}>{storyOfTheDay.emoji ?? '📖'}</AppText>
          <AppText variant="hero" color={DARK_TEXT}>
            {storyOfTheDay.title}
          </AppText>
          <AppText color={DARK_TEXT}>
            ⏱ {storyOfTheDay.readingMinutes} min · {storyOfTheDay.ageMin}+ v
          </AppText>
          <View style={styles.readButton}>
            <AppText variant="subtitle" color={DARK_TEXT}>
              Lue satu ›
            </AppText>
          </View>
        </Pressable>
      ) : null}

      {continueStory ? (
        <Pressable
          onPress={() => router.push(`/story/${continueStory.story.id}`)}
          accessibilityRole="button"
          accessibilityLabel={`Jatka lukemista: ${continueStory.story.title}`}
          style={({ pressed }) => [
            styles.continue,
            { backgroundColor: colors.surface, borderColor: colors.primary, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <AppText style={{ fontSize: 34, lineHeight: 42 }}>{continueStory.story.emoji ?? '📖'}</AppText>
          <View style={{ flex: 1, gap: 6 }}>
            <AppText variant="caption" color={colors.primary}>
              JATKA LUKEMISTA
            </AppText>
            <AppText variant="subtitle" numberOfLines={1}>
              {continueStory.story.title}
            </AppText>
            {/* Edistymispalkki */}
            <View style={[styles.progressTrack, { backgroundColor: colors.surfaceAlt }]}>
              <View
                style={[styles.progressFill, { width: `${continueStory.percent}%`, backgroundColor: colors.primary }]}
              />
            </View>
          </View>
        </Pressable>
      ) : null}

      <AppText variant="title" style={{ marginTop: spacing.sm }} accessibilityRole="header">
        Kaikki sadut
      </AppText>
      <StoryCardList stories={ALL_STORIES} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  featured: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  featuredLabel: { letterSpacing: 1 },
  featuredEmoji: { fontSize: 64, lineHeight: 76, marginVertical: spacing.xs },
  readButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
    justifyContent: 'center',
  },
  continue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 2,
    padding: spacing.md,
    minHeight: 88,
  },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4 },
});
