/**
 * StoryCard: satukortti listoissa.
 * Vasemmalla värikäs "kansikuva" (väri + emoji), oikealla nimi, ikä ja lukuaika.
 * Koko kortti on iso kosketusalue, joka avaa sadun.
 */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import type { Story } from '@/types/story';
import { storyColor } from '@/data/storyRepository';
import { useAppData } from '@/storage/AppDataContext';
import { radius, spacing } from '@/theme/theme';
import { AppText } from './AppText';
import { FavoriteButton } from './FavoriteButton';

export function StoryCard({ story }: { story: Story }) {
  const { colors } = useAppData();
  return (
    <Pressable
      onPress={() => router.push(`/story/${story.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`${story.title}, ${story.readingMinutes} minuuttia, ${story.ageMin} vuotta ja yli`}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={[styles.cover, { backgroundColor: storyColor(story) }]}>
        <AppText style={styles.emoji}>{story.emoji ?? '📖'}</AppText>
      </View>
      <View style={styles.info}>
        <AppText variant="subtitle" numberOfLines={2}>
          {story.title}
        </AppText>
        <AppText variant="caption" muted>
          ⏱ {story.readingMinutes} min · {story.ageMin}+ v
        </AppText>
      </View>
      <FavoriteButton storyId={story.id} size={26} />
    </Pressable>
  );
}

export function StoryCardList({ stories }: { stories: Story[] }) {
  return (
    <View style={{ gap: spacing.md }}>
      {stories.map((s) => (
        <StoryCard key={s.id} story={s} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.sm,
    gap: spacing.md,
    minHeight: 96,
  },
  cover: {
    width: 76,
    height: 76,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 38, lineHeight: 46 },
  info: { flex: 1, gap: spacing.xs },
});
