/**
 * KATEGORIA- TAI IKÄRYHMÄNÄKYMÄ
 * Osoite on esim. /category/elainsadut tai /category/ika-pienet
 */
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { getGroup, getStoriesInGroup } from '@/data/storyRepository';
import { useAppData } from '@/storage/AppDataContext';
import { AppText } from '@/components/AppText';
import { StoryCardList } from '@/components/StoryCard';
import { EmptyState } from '@/components/EmptyState';
import { radius, shade, spacing } from '@/theme/theme';

const DARK_TEXT = '#2E2440';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useAppData();
  const group = getGroup(id);
  const stories = getStoriesInGroup(id);

  return (
    <>
      <Stack.Screen options={{ title: group?.title ?? 'Satuja' }} />
      <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.content}>
        {group ? (
          <View style={styles.banner}>
            <LinearGradient
              colors={[shade(group.color, 0.3), group.color]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[StyleSheet.absoluteFill, { borderRadius: radius.xl }]}
            />
            <AppText style={styles.emoji}>{group.emoji}</AppText>
            <View style={{ flex: 1 }}>
              <AppText variant="hero" color={DARK_TEXT}>
                {group.title}
              </AppText>
              <AppText color={DARK_TEXT} style={{ opacity: 0.75 }}>
                {group.description} · {stories.length} satua
              </AppText>
            </View>
          </View>
        ) : null}
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
  content: { padding: spacing.md, gap: spacing.lg, paddingBottom: spacing.xxl, maxWidth: 720, width: '100%', alignSelf: 'center' },
  banner: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderRadius: radius.xl, padding: spacing.lg },
  emoji: { fontSize: 56, lineHeight: 66 },
});
