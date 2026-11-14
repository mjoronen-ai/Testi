/**
 * SELAA
 * Ylhäällä haku. Kun hakukenttä on tyhjä, näytetään aiheet, ikäryhmät ja kaikki sadut.
 * Haku kohdistuu nimeen, hakusanoihin, tekijään ja tekstiin, ja tulokset päivittyvät kirjoittaessa.
 */
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SecondaryButton } from '@/components/Buttons';
import { AGE_GROUPS, ALL_STORIES, TOPIC_GROUPS, searchStories } from '@/data/storyRepository';
import { useAppData } from '@/storage/AppDataContext';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/AppText';
import { StoryCardList } from '@/components/StoryCard';
import { EmptyState } from '@/components/EmptyState';
import { GroupCard } from '@/components/GroupCard';
import { PressableScale } from '@/components/PressableScale';
import { TOUCH_MIN, fonts, radius, softShadow, spacing } from '@/theme/theme';

/** Valmiita hakusanoja, joita lapsi voi napauttaa. */
const SUGGESTIONS = ['🦊 kettu', '🌙 kuu', '🐈 kissa', '🌲 metsä', '🌊 meri', '🤝 ystävä'];

export default function ExploreScreen() {
  const { colors } = useAppData();
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchStories(query), [query]);
  const hasQuery = query.trim().length > 0;
  const count = (g: (typeof TOPIC_GROUPS)[number]) => ALL_STORIES.filter(g.matches).length;

  // Aiheet kahden sarakkeen ruudukkona.
  const rows: (typeof TOPIC_GROUPS)[] = [];
  for (let i = 0; i < TOPIC_GROUPS.length; i += 2) rows.push(TOPIC_GROUPS.slice(i, i + 2));

  return (
    <Screen title="Selaa" subtitle="Etsi satu nimellä, aiheella tai iällä">
      <View style={[styles.inputRow, { backgroundColor: colors.surface }, softShadow(colors.shadow, 0.6)]}>
        <Ionicons name="search" size={24} color={colors.primary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Hae satuja…"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.text }]}
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Hae satuja"
        />
        {hasQuery ? (
          <Pressable onPress={() => setQuery('')} accessibilityLabel="Tyhjennä haku" hitSlop={10} style={styles.clear}>
            <Ionicons name="close-circle" size={26} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {hasQuery ? (
        results.length > 0 ? (
          <View style={{ gap: spacing.md }}>
            <AppText muted>{results.length === 1 ? 'Löytyi 1 satu' : `Löytyi ${results.length} satua`}</AppText>
            <StoryCardList stories={results} />
          </View>
        ) : (
          <EmptyState emoji="🔍" title="Ei löytynyt satuja" text="Kokeile toista sanaa, esimerkiksi eläimen nimeä." />
        )
      ) : (
        <>
          <View style={styles.chips}>
            {SUGGESTIONS.map((s) => (
              <PressableScale
                key={s}
                onPress={() => setQuery(s.split(' ')[1])}
                accessibilityRole="button"
                style={[styles.chip, { backgroundColor: colors.surfaceAlt }]}
              >
                <AppText variant="subtitle" style={{ fontSize: 16 }}>
                  {s}
                </AppText>
              </PressableScale>
            ))}
          </View>

          <View style={{ gap: spacing.sm + 4 }}>
            <AppText variant="title" accessibilityRole="header">
              Aiheet
            </AppText>
            {rows.map((row, i) => (
              <View key={i} style={styles.gridRow}>
                {row.map((g) => (
                  <GroupCard key={g.id} group={g} count={count(g)} compact />
                ))}
                {row.length === 1 ? <View style={{ flex: 1 }} /> : null}
              </View>
            ))}
          </View>

          <View style={{ gap: spacing.sm + 4 }}>
            <AppText variant="title" accessibilityRole="header">
              Ikäryhmät
            </AppText>
            {AGE_GROUPS.map((g) => (
              <GroupCard key={g.id} group={g} count={count(g)} />
            ))}
          </View>

          <View style={{ gap: spacing.sm + 4 }}>
            <AppText variant="title" accessibilityRole="header">
              Kaikki sadut ({ALL_STORIES.length})
            </AppText>
            <StoryCardList stories={ALL_STORIES.slice(0, 8)} />
            <SecondaryButton
              label={`Näytä kaikki ${ALL_STORIES.length} satua`}
              icon="library-outline"
              onPress={() => router.push('/category/kaikki')}
            />
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md + 4,
    minHeight: 60,
  },
  input: { flex: 1, fontFamily: fonts.semibold, fontSize: 19, paddingVertical: spacing.sm },
  clear: { minWidth: 40, minHeight: TOUCH_MIN, alignItems: 'center', justifyContent: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { borderRadius: radius.pill, paddingHorizontal: spacing.md, minHeight: 46, justifyContent: 'center' },
  gridRow: { flexDirection: 'row', gap: spacing.sm + 4 },
});
