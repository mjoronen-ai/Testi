/**
 * SUOSIKIT
 * Sadut, joihin on painettu sydäntä. Uusin suosikki näkyy ylimpänä.
 */
import React from 'react';
import { getStory } from '@/data/storyRepository';
import { useAppData } from '@/storage/AppDataContext';
import { Screen } from '@/components/Screen';
import { StoryCardList } from '@/components/StoryCard';
import { EmptyState } from '@/components/EmptyState';
import type { Story } from '@/types/story';

export default function FavoritesScreen() {
  const { favorites } = useAppData();
  const stories = favorites.map(getStory).filter((s): s is Story => Boolean(s));

  return (
    <Screen title="Suosikit" subtitle={stories.length > 0 ? 'Omat lempisadut' : undefined}>
      {stories.length > 0 ? (
        <StoryCardList stories={stories} />
      ) : (
        <EmptyState
          emoji="💛"
          title="Ei vielä suosikkeja"
          text="Paina sadun kohdalla sydäntä, niin satu tallentuu tänne."
        />
      )}
    </Screen>
  );
}
