/** GroupCard: iso värikäs kortti kategorialle tai ikäryhmälle. */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import type { StoryGroup } from '@/data/storyRepository';
import { radius, spacing } from '@/theme/theme';
import { AppText } from './AppText';

const DARK_TEXT = '#3B2F2A'; // kortit ovat aina vaaleita, joten teksti on aina tumma

export function GroupCard({ group, count }: { group: StoryGroup; count: number }) {
  return (
    <Pressable
      onPress={() => router.push(`/category/${group.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`${group.title}, ${count} satua`}
      style={({ pressed }) => [styles.card, { backgroundColor: group.color, opacity: pressed ? 0.85 : 1 }]}
    >
      <AppText style={styles.emoji}>{group.emoji}</AppText>
      <View style={{ flex: 1 }}>
        <AppText variant="title" color={DARK_TEXT}>
          {group.title}
        </AppText>
        <AppText color={DARK_TEXT}>{group.description}</AppText>
      </View>
      <View style={styles.badge}>
        <AppText variant="caption" color={DARK_TEXT}>
          {count}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    minHeight: 88,
  },
  emoji: { fontSize: 40, lineHeight: 50 },
  badge: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
});
