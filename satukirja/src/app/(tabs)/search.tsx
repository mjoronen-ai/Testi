/**
 * HAKU
 * Hakee sadun nimestä, hakusanoista, tekijästä ja tekstistä.
 * Tulokset päivittyvät sitä mukaa kuin kirjoitat.
 */
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchStories } from '@/data/storyRepository';
import { useAppData } from '@/storage/AppDataContext';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/AppText';
import { StoryCardList } from '@/components/StoryCard';
import { EmptyState } from '@/components/EmptyState';
import { TOUCH_MIN, fonts, radius, spacing } from '@/theme/theme';

/** Valmiita hakusanoja, joita lapsi voi napauttaa. */
const SUGGESTIONS = ['kettu', 'kuu', 'kissa', 'metsä', 'meri', 'ystävä', 'uni'];

export default function SearchScreen() {
  const { colors } = useAppData();
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchStories(query), [query]);
  const hasQuery = query.trim().length > 0;

  return (
    <Screen title="Haku" scroll={false}>
      <View style={[styles.inputRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="search" size={24} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Kirjoita sadun nimi tai sana"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.text }]}
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Hae satuja"
        />
        {hasQuery ? (
          <Pressable
            onPress={() => setQuery('')}
            accessibilityLabel="Tyhjennä haku"
            hitSlop={10}
            style={styles.clear}
          >
            <Ionicons name="close-circle" size={26} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.xl }} keyboardShouldPersistTaps="handled">
        {!hasQuery ? (
          <>
            <AppText muted>Kokeile näitä:</AppText>
            <View style={styles.chips}>
              {SUGGESTIONS.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setQuery(s)}
                  accessibilityRole="button"
                  style={[styles.chip, { backgroundColor: colors.surfaceAlt }]}
                >
                  <AppText variant="subtitle">{s}</AppText>
                </Pressable>
              ))}
            </View>
          </>
        ) : results.length > 0 ? (
          <>
            <AppText muted>
              {results.length === 1 ? 'Löytyi 1 satu' : `Löytyi ${results.length} satua`}
            </AppText>
            <StoryCardList stories={results} />
          </>
        ) : (
          <EmptyState emoji="🔍" title="Ei löytynyt satuja" text="Kokeile toista sanaa, esimerkiksi eläimen nimeä." />
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 2,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    minHeight: 60,
  },
  input: { flex: 1, fontFamily: fonts.semibold, fontSize: 19, paddingVertical: spacing.sm },
  clear: { minWidth: 40, minHeight: TOUCH_MIN, alignItems: 'center', justifyContent: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    minHeight: TOUCH_MIN,
    justifyContent: 'center',
  },
});
