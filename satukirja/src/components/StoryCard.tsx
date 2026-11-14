/**
 * Satukortit kahdessa muodossa:
 *  - StoryTile: pysty kortti vaakasuuntaisiin karuselleihin (kuten suoratoistopalveluissa)
 *  - StoryCard: vaakarivi listoihin (haku, suosikit, kategoriat)
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import type { Story } from '@/types/story';
import { useAppData } from '@/storage/AppDataContext';
import { chapterLabel } from '@/data/storyRepository';
import { radius, softShadow, spacing } from '@/theme/theme';
import { AppText } from './AppText';
import { FavoriteButton } from './FavoriteButton';
import { PressableScale } from './PressableScale';
import { StoryCover } from './StoryCover';

const open = (story: Story) => router.push(`/story/${story.id}`);

function a11y(story: Story) {
  return `${story.title}, ${story.readingMinutes} minuuttia, ${story.ageMin} vuotta ja yli`;
}

export const TILE_WIDTH = 148;

export function StoryTile({ story }: { story: Story }) {
  const { completed } = useAppData();
  return (
    <PressableScale onPress={() => open(story)} accessibilityRole="button" accessibilityLabel={a11y(story)} style={{ width: TILE_WIDTH }}>
      <StoryCover story={story} width={TILE_WIDTH} height={180} radius={radius.lg} done={!!completed[story.id]} />
      <AppText variant="subtitle" numberOfLines={2} style={styles.tileTitle}>
        {story.title}
      </AppText>
      <AppText variant="caption" muted>
        {chapterLabel(story) ? `${chapterLabel(story)} · ` : ''}
        {story.readingMinutes} min · {story.ageMin}+ v
      </AppText>
    </PressableScale>
  );
}

export function StoryCard({ story }: { story: Story }) {
  const { colors, completed } = useAppData();
  const done = !!completed[story.id];
  return (
    <PressableScale
      onPress={() => open(story)}
      accessibilityRole="button"
      accessibilityLabel={a11y(story)}
      scaleTo={0.98}
      style={[styles.card, { backgroundColor: colors.surface }, softShadow(colors.shadow, 0.7)]}
    >
      <StoryCover story={story} width={84} height={84} radius={radius.md} emojiSize={40} />
      <View style={styles.info}>
        <AppText variant="subtitle" numberOfLines={2}>
          {story.title}
        </AppText>
        <View style={styles.metaRow}>
          {chapterLabel(story) ? <Pill text={`📖 ${chapterLabel(story)}`} strong /> : null}
          <Pill text={`⏱ ${story.readingMinutes} min`} />
          <Pill text={`${story.ageMin}+ v`} />
          {done ? <Pill text="✓ Luettu" strong /> : null}
        </View>
      </View>
      <FavoriteButton storyId={story.id} size={26} />
    </PressableScale>
  );
}

function Pill({ text, strong }: { text: string; strong?: boolean }) {
  const { colors } = useAppData();
  return (
    <View style={[styles.pill, { backgroundColor: strong ? colors.primarySoft : colors.surfaceAlt }]}>
      <AppText variant="caption" color={strong ? colors.primary : colors.textMuted}>
        {text}
      </AppText>
    </View>
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
  tileTitle: { marginTop: spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    padding: 10,
    gap: spacing.md,
  },
  info: { flex: 1, gap: 6 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
});
