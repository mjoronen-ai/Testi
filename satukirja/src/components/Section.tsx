/**
 * Section: otsikollinen osio. Carousel: vaakasuunnassa vieritettävä rivi satuja.
 */
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, type Href } from 'expo-router';
import type { Story } from '@/types/story';
import { useAppData } from '@/storage/AppDataContext';
import { spacing } from '@/theme/theme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';
import { StoryTile } from './StoryCard';

interface SectionProps {
  title: string;
  subtitle?: string;
  /** Jos annettu, otsikon viereen tulee "Kaikki ›" -linkki. */
  seeAllHref?: Href;
  children: React.ReactNode;
}

export function Section({ title, subtitle, seeAllHref, children }: SectionProps) {
  const { colors } = useAppData();
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <AppText variant="title" accessibilityRole="header">
            {title}
          </AppText>
          {subtitle ? <AppText muted>{subtitle}</AppText> : null}
        </View>
        {seeAllHref ? (
          <PressableScale onPress={() => router.push(seeAllHref)} accessibilityRole="button" style={styles.seeAll}>
            <AppText variant="caption" color={colors.primary}>
              Kaikki ›
            </AppText>
          </PressableScale>
        ) : null}
      </View>
      {children}
    </View>
  );
}

/** Vaakasuuntainen satukaruselli. Ulottuu ruudun reunasta reunaan. */
export function Carousel({ stories }: { stories: Story[] }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carousel}
      style={styles.bleed}
    >
      {stories.map((s) => (
        <StoryTile key={s.id} story={s} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.sm + 4 },
  header: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  seeAll: { minHeight: 44, minWidth: 64, alignItems: 'flex-end', justifyContent: 'center' },
  bleed: { marginHorizontal: -spacing.md },
  carousel: { paddingHorizontal: spacing.md, gap: spacing.md },
});
