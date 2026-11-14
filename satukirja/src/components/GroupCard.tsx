/** GroupCard: värikäs liukuvärikortti kategorialle tai ikäryhmälle. */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import type { StoryGroup } from '@/data/storyRepository';
import { useAppData } from '@/storage/AppDataContext';
import { radius, shade, softShadow, spacing } from '@/theme/theme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

const DARK_TEXT = '#2E2440'; // kortit ovat aina vaaleita, joten teksti on aina tumma

/** compact = pieni neliökortti kahden sarakkeen ruudukkoon */
export function GroupCard({ group, count, compact }: { group: StoryGroup; count: number; compact?: boolean }) {
  const { colors } = useAppData();
  return (
    <PressableScale
      onPress={() => router.push(`/category/${group.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`${group.title}, ${count} satua`}
      outerStyle={compact ? { flex: 1 } : undefined}
      style={[compact ? styles.compact : styles.card, softShadow(colors.shadow, 0.6)]}
    >
      <LinearGradient
        colors={[shade(group.color, 0.3), group.color]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: radius.lg }]}
      />
      <AppText style={compact ? styles.emojiCompact : styles.emoji}>{group.emoji}</AppText>
      <View style={compact ? undefined : { flex: 1 }}>
        <AppText variant={compact ? 'subtitle' : 'title'} color={DARK_TEXT}>
          {group.title}
        </AppText>
        <AppText variant="caption" color={DARK_TEXT} style={{ opacity: 0.75 }}>
          {compact ? `${count} satua` : group.description}
        </AppText>
      </View>
      {!compact ? (
        <View style={styles.badge}>
          <AppText variant="caption" color={DARK_TEXT}>
            {count}
          </AppText>
        </View>
      ) : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    minHeight: 84,
  },
  compact: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  emoji: { fontSize: 38, lineHeight: 46 },
  emojiCompact: { fontSize: 34, lineHeight: 42 },
  badge: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
});
