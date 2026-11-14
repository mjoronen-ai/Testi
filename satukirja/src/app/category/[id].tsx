/**
 * KATEGORIA- TAI IKÄRYHMÄNÄKYMÄ
 * Osoite on esim. /category/elainsadut, /category/ika-pienet tai /category/kaikki
 *
 * Lista on FlatList, joka piirtää vain ruudulla näkyvät kortit, joten satojakin
 * satuja voi selata sujuvasti.
 */
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { getGroup, getStoriesInGroup } from '@/data/storyRepository';
import { useAppData } from '@/storage/AppDataContext';
import { AppText } from '@/components/AppText';
import { StoryCard } from '@/components/StoryCard';
import { EmptyState } from '@/components/EmptyState';
import { radius, shade, spacing } from '@/theme/theme';

const DARK_TEXT = '#2E2440';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useAppData();
  const group = getGroup(id);
  const stories = getStoriesInGroup(id);

  const header = group ? (
    <View style={styles.banner}>
      <LinearGradient
        colors={[shade(group.color, 0.3), group.color]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: radius.xl }]}
      />
      <AppText style={styles.emoji}>{group.emoji}</AppText>
      <View style={{ flex: 1 }}>
        {/* Pitkät otsikot pienemmällä fontilla, jotta sana ei katkea kesken */}
        <AppText variant={group.title.length > 14 ? 'title' : 'hero'} color={DARK_TEXT}>
          {group.title}
        </AppText>
        <AppText color={DARK_TEXT} style={{ opacity: 0.75 }}>
          {group.description} · {stories.length} {group.id === 'jatkokertomukset' ? 'lukua' : 'satua'}
        </AppText>
      </View>
    </View>
  ) : null;

  return (
    <>
      <Stack.Screen options={{ title: group?.title ?? 'Satuja' }} />
      <FlatList
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.content}
        data={stories}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => <StoryCard story={item} />}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListHeaderComponent={header ? <View style={{ marginBottom: spacing.lg }}>{header}</View> : undefined}
        ListEmptyComponent={
          <EmptyState emoji="📭" title="Täällä ei ole vielä satuja" text="Uusia satuja tulee pian." />
        }
        initialNumToRender={10}
        windowSize={7}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.md, paddingBottom: spacing.xxl, maxWidth: 720, width: '100%', alignSelf: 'center' },
  banner: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderRadius: radius.xl, padding: spacing.lg },
  emoji: { fontSize: 56, lineHeight: 66 },
});
