/**
 * ETUSIVU
 *
 * Rakenne perustuu siihen, mikä tekee sovelluksesta helpon palata käyttämään:
 *  1. Henkilökohtainen tervehdys kellonajan mukaan (tuttu rutiini, "iltasatuhetki").
 *  2. Yksi selkeä pääpainike: tämän päivän tai illan satu, luettavaksi tai kuunneltavaksi.
 *  3. "Jatka lukemista" heti näkyvissä (helpoin mahdollinen seuraava askel).
 *  4. Iän mukaan suositellut sadut ja aiheittaiset karusellit (löytämisen ilo).
 *  5. Tarrakirjan edistyminen (myönteinen palaute, ei painostavia "putkia").
 */
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ALL_STORIES,
  SHORT_STORY_MINUTES,
  getRecommended,
  getStory,
  getStoryOfTheDay,
  greeting,
  isChristmasSeason,
  ALL_SERIES,
  nextUnreadChapter,
  rotateDaily,
  ageGroupIdFor,
  storyColor,
} from '@/data/storyRepository';
import { useAppData } from '@/storage/AppDataContext';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { PressableScale } from '@/components/PressableScale';
import { StoryCover } from '@/components/StoryCover';
import { Carousel, Section } from '@/components/Section';
import { radius, shade, softShadow, spacing } from '@/theme/theme';

const DARK_TEXT = '#2E2440';

export default function HomeScreen() {
  const { progress, colors, nightMode, profile, completed } = useAppData();
  const completedIds = Object.keys(completed);
  const hello = greeting(profile.name);
  const isEvening = new Date().getHours() >= 17 || new Date().getHours() < 5;

  // Illalla nostetaan esiin iltasatu, päivällä päivän satu.
  const featured = useMemo(() => {
    const day = getStoryOfTheDay();
    if (!isEvening || !day) return day;
    const bedtime = getRecommended(profile.age, completedIds).filter((s) => s.categories.includes('iltasadut'));
    return bedtime.length > 0 ? bedtime[new Date().getDate() % bedtime.length] : day;
  }, [isEvening, profile.age]);

  // Viimeksi luettu keskeneräinen satu (ei aivan alussa eikä lopussa).
  const continueStory = useMemo(() => {
    const unfinished = Object.entries(progress)
      .filter(([, p]) => p.ratio > 0.02 && p.ratio < 0.97)
      .sort((a, b) => b[1].updatedAt - a[1].updatedAt);
    for (const [id, p] of unfinished) {
      const story = getStory(id);
      if (story) return { story, percent: Math.round(p.ratio * 100) };
    }
    return null;
  }, [progress]);

  const recommended = useMemo(
    () => getRecommended(profile.age, completedIds).filter((s) => s.id !== featured?.id),
    [profile.age, featured?.id, completed],
  );
  const pick = (pred: (s: (typeof ALL_STORIES)[number]) => boolean) =>
    rotateDaily(ALL_STORIES.filter((s) => (!s.series || s.chapter === 1) && pred(s)));
  const bedtime = pick((s) => s.categories.includes('iltasadut'));
  const short = pick((s) => s.readingMinutes < SHORT_STORY_MINUTES);
  const animals = pick((s) => s.categories.includes('elainsadut'));
  const adventures = pick((s) => s.categories.includes('seikkailusadut'));
  const finnish = pick((s) => s.categories.includes('suomalaiset'));
  const classics = pick((s) => s.categories.includes('kansansadut') && !s.categories.includes('suomalaiset'));
  const seasons = pick((s) => s.categories.includes('vuodenajat'));
  const christmas = pick((s) => s.categories.includes('joulusadut'));
  const christmasSeason = isChristmasSeason();
  // Jatkokertomuksista näytetään se luku, josta lukeminen jatkuu.
  const serials = ALL_SERIES.map((s) => nextUnreadChapter(s, completedIds));

  const stickerCount = completedIds.filter((id) => getStory(id)).length;

  return (
    <Screen
      overline={`${hello.emoji}  ${hello.text.split(',')[0]}`}
      title={profile.name || 'Satukirja'}
      headerRight={
        <IconButton icon="settings-outline" onPress={() => router.push('/settings')} accessibilityLabel="Asetukset" />
      }
    >
      {/* ---------- Pääkortti: Päivän / Illan satu ---------- */}
      {featured ? (
        <PressableScale
          onPress={() => router.push(`/story/${featured.id}`)}
          accessibilityRole="button"
          accessibilityLabel={`${isEvening ? 'Illan satu' : 'Päivän satu'}: ${featured.title}`}
          scaleTo={0.98}
          style={[styles.hero, softShadow(storyColor(featured), 1.6)]}
        >
          <LinearGradient
            colors={[shade(storyColor(featured), 0.25), shade(storyColor(featured), -0.15)]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius: radius.xl }]}
          />
          <View style={styles.heroTop}>
            <View style={styles.heroBadge}>
              <AppText variant="overline" color={DARK_TEXT}>
                {isEvening ? '🌙 Illan satu' : '✨ Päivän satu'}
              </AppText>
            </View>
            {completed[featured.id] ? (
              <View style={styles.heroBadge}>
                <AppText variant="overline" color={DARK_TEXT}>
                  ✓ Luettu
                </AppText>
              </View>
            ) : null}
          </View>
          <View style={styles.heroRow}>
            <View style={{ flex: 1, gap: spacing.xs }}>
              <AppText variant="hero" color={DARK_TEXT}>
                {featured.title}
              </AppText>
              <AppText color={DARK_TEXT} style={{ opacity: 0.75 }}>
                {featured.readingMinutes} min · {featured.ageMin}+ v
              </AppText>
            </View>
            <StoryCover story={featured} width={104} height={124} radius={radius.lg} style={styles.heroCover} />
          </View>
          <View style={styles.heroActions}>
            <PressableScale
              onPress={() => router.push(`/story/${featured.id}`)}
              accessibilityRole="button"
              style={styles.heroButton}
            >
              <AppText variant="subtitle" color={DARK_TEXT}>
                📖  Lue
              </AppText>
            </PressableScale>
            <PressableScale
              onPress={() => router.push(`/story/${featured.id}?autoplay=1`)}
              accessibilityRole="button"
              accessibilityLabel="Kuuntele satu ääneen luettuna"
              style={[styles.heroButton, styles.heroButtonGhost]}
            >
              <AppText variant="subtitle" color={DARK_TEXT}>
                🎧  Kuuntele
              </AppText>
            </PressableScale>
          </View>
        </PressableScale>
      ) : null}

      {/* ---------- Jatka lukemista ---------- */}
      {continueStory ? (
        <PressableScale
          onPress={() => router.push(`/story/${continueStory.story.id}`)}
          accessibilityRole="button"
          accessibilityLabel={`Jatka lukemista: ${continueStory.story.title}`}
          scaleTo={0.98}
          style={[styles.continue, { backgroundColor: colors.surface }, softShadow(colors.shadow, 0.7)]}
        >
          <StoryCover story={continueStory.story} width={64} height={64} radius={radius.md} emojiSize={32} />
          <View style={{ flex: 1, gap: 6 }}>
            <AppText variant="overline" color={colors.primary}>
              Jatka lukemista
            </AppText>
            <AppText variant="subtitle" numberOfLines={1}>
              {continueStory.story.title}
            </AppText>
            <View style={[styles.progressTrack, { backgroundColor: colors.surfaceAlt }]}>
              <View style={[styles.progressFill, { width: `${continueStory.percent}%`, backgroundColor: colors.primary }]} />
            </View>
          </View>
          <View style={[styles.playCircle, { backgroundColor: colors.primary }]}>
            <AppText variant="subtitle" color={colors.onPrimary}>
              ›
            </AppText>
          </View>
        </PressableScale>
      ) : null}

      {/* ---------- Tarrakirjan edistyminen ---------- */}
      <PressableScale
        onPress={() => router.push('/stickers')}
        accessibilityRole="button"
        accessibilityLabel={`Tarrakirja: ${stickerCount} / ${ALL_STORIES.length} tarraa`}
        scaleTo={0.98}
        style={[styles.stickerStrip, { backgroundColor: nightMode ? colors.surfaceAlt : '#FFF1D2' }]}
      >
        <AppText style={{ fontSize: 30, lineHeight: 36 }}>🏅</AppText>
        <View style={{ flex: 1, gap: 4 }}>
          <AppText variant="subtitle">
            {stickerCount === 0 ? 'Kerää ensimmäinen tarrasi!' : `${stickerCount} / ${ALL_STORIES.length} tarraa kerätty`}
          </AppText>
          <View style={[styles.progressTrack, { backgroundColor: nightMode ? colors.surface : '#FCE3A8' }]}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.max(4, (stickerCount / ALL_STORIES.length) * 100)}%`, backgroundColor: colors.accent },
              ]}
            />
          </View>
        </View>
        <AppText variant="caption" muted>
          ›
        </AppText>
      </PressableScale>

      {/* ---------- Karusellit ---------- */}
      <Section
        title="Sinulle sopivat"
        subtitle={`Valittu ${profile.age}${profile.age >= 9 ? '+' : ''}-vuotiaalle`}
        seeAllHref={`/category/${ageGroupIdFor(profile.age)}`}
      >
        <Carousel stories={recommended} />
      </Section>
      {christmasSeason && christmas.length > 0 ? (
        <Section title="🎄 Joulun odotukseen" subtitle="Tonttuja, poroja ja joulun taikaa" seeAllHref="/category/joulusadut">
          <Carousel stories={christmas} />
        </Section>
      ) : null}
      {serials.length > 0 ? (
        <Section title="Jatkokertomukset" subtitle="Yksi luku illassa – mitä seuraavaksi tapahtuu?" seeAllHref="/category/jatkokertomukset">
          <Carousel stories={serials} />
        </Section>
      ) : null}
      <Section title="Iltasadut" subtitle="Rauhoittumiseen ennen unta" seeAllHref="/category/iltasadut">
        <Carousel stories={bedtime} />
      </Section>
      <Section title="Lyhyet satuhetket" subtitle={`Alle ${SHORT_STORY_MINUTES} minuuttia`} seeAllHref="/category/lyhyet">
        <Carousel stories={short} />
      </Section>
      <Section title="Suomalaiset kansansadut" subtitle="Vanhoja tarinoita omasta maasta" seeAllHref="/category/suomalaiset">
        <Carousel stories={finnish} />
      </Section>
      <Section title="Maailman satuklassikot" subtitle="Grimm, Andersen, Aisopos ja muut" seeAllHref="/category/kansansadut">
        <Carousel stories={classics} />
      </Section>
      <Section title="Vuodenajat ja juhlat" seeAllHref="/category/vuodenajat">
        <Carousel stories={seasons} />
      </Section>
      <Section title="Eläinsadut" seeAllHref="/category/elainsadut">
        <Carousel stories={animals} />
      </Section>
      <Section title="Seikkailut isommille" seeAllHref="/category/seikkailusadut">
        <Carousel stories={adventures} />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md },
  heroTop: { flexDirection: 'row', gap: spacing.sm },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  heroCover: { transform: [{ rotate: '4deg' }], borderWidth: 3, borderColor: 'rgba(255,255,255,0.8)' },
  heroActions: { flexDirection: 'row', gap: spacing.sm },
  heroButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
    justifyContent: 'center',
  },
  heroButtonGhost: { backgroundColor: 'rgba(255,255,255,0.55)' },
  continue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    padding: 12,
  },
  playCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4 },
  stickerStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
});
