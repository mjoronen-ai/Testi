/**
 * KATEGORIAT
 * Aiheen mukaan (eläinsadut, kansansadut, iltasadut, seikkailusadut, lyhyet)
 * ja ikäryhmän mukaan.
 */
import React from 'react';
import { AGE_GROUPS, ALL_STORIES, TOPIC_GROUPS } from '@/data/storyRepository';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/AppText';
import { GroupCard } from '@/components/GroupCard';
import { spacing } from '@/theme/theme';

export default function CategoriesScreen() {
  return (
    <Screen title="Kategoriat" subtitle="Valitse aihe tai ikä">
      {TOPIC_GROUPS.map((g) => (
        <GroupCard key={g.id} group={g} count={ALL_STORIES.filter(g.matches).length} />
      ))}

      <AppText variant="title" style={{ marginTop: spacing.md }} accessibilityRole="header">
        Ikäryhmän mukaan
      </AppText>
      {AGE_GROUPS.map((g) => (
        <GroupCard key={g.id} group={g} count={ALL_STORIES.filter(g.matches).length} />
      ))}
    </Screen>
  );
}
