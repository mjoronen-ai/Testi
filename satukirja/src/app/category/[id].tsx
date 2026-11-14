/**
 * KATEGORIA- TAI IKÄRYHMÄNÄKYMÄ
 * Osoite on esim. /category/elainsadut tai /category/ika-pienet
 */
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { getGroup, getStoriesInGroup } from '@/data/storyRepository';
import { useAppData } from '@/storage/AppDataContext';
import { AppText } from '@/components/AppText';
import { StoryCardList } from '@/components/StoryCard';
import { EmptyState } from '@/components/EmptyState';
import { spacing } from '@/theme/theme';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useAppData();
  const group = getGroup(id);
  const stories = getStoriesInGroup(id);

  return (
    <>
      <Stack.Screen options={{ title: group ? `${group.emoji} ${group.title}` : 'Satuja' }} />
      <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.content}>
        {group ? <AppText muted>{group.description}</AppText> : null}
        {stories.length > 0 ? (
          <StoryCardList stories={stories} />
        ) : (
          <EmptyState emoji="📭" title="Täällä ei ole vielä satuja" text="Uusia satuja tulee pian." />
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xl },
});
