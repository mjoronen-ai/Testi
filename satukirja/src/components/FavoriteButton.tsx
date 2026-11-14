/**
 * FavoriteButton: sydännappi. Painallus lisää sadun suosikkeihin tai poistaa sen sieltä.
 */
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppData } from '@/storage/AppDataContext';
import { TOUCH_MIN } from '@/theme/theme';

export function FavoriteButton({ storyId, size = 30 }: { storyId: string; size?: number }) {
  const { isFavorite, toggleFavorite, colors } = useAppData();
  const fav = isFavorite(storyId);
  return (
    <Pressable
      onPress={() => toggleFavorite(storyId)}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={fav ? 'Poista suosikeista' : 'Lisää suosikkeihin'}
      accessibilityState={{ selected: fav }}
      style={({ pressed }) => [styles.button, { transform: [{ scale: pressed ? 0.9 : 1 }] }]}
    >
      <Ionicons name={fav ? 'heart' : 'heart-outline'} size={size} color={fav ? colors.heart : colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: TOUCH_MIN,
    minHeight: TOUCH_MIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
