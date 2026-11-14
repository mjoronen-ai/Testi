/**
 * LUKUNÄKYMÄ
 *  - Iso ja selkeä teksti, jonka kokoa voi säätää (A− / A+)
 *  - Yötila (kuu/aurinko-nappi)
 *  - Arvioitu lukuaika ja ikäsuositus
 *  - Sydän: lisää suosikkeihin
 *  - Ääneen luku (play/pause) ja luettavan kappaleen korostus
 *  - Muistaa lukukohdan ("Jatka lukemista")
 *  - Lopussa lähde, tekijä ja lisenssi
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  type ScrollViewInstance,
  StyleSheet,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { categoryTitle, getStory, paragraphs as splitParagraphs, storyColor } from '@/data/storyRepository';
import { useAppData } from '@/storage/AppDataContext';
import { useSpeech } from '@/hooks/useSpeech';
import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { FavoriteButton } from '@/components/FavoriteButton';
import { EmptyState } from '@/components/EmptyState';
import { FONT_SIZE, fonts, radius, spacing } from '@/theme/theme';

/** Takaisin edelliseen näkymään, tai etusivulle jos satu avattiin suoraan. */
function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

/** Kuinka usein lukukohta tallennetaan vierittäessä (millisekunteina). */
const SAVE_INTERVAL_MS = 1000;

export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const story = getStory(id);
  const app = useAppData();
  const { colors, fontSize, setFontSize, nightMode, toggleNightMode } = app;

  const paras = useMemo(() => (story ? splitParagraphs(story) : []), [story]);
  const speech = useSpeech(paras);

  // --- Vieritys ja lukukohta --------------------------------------------------
  const scrollRef = useRef<ScrollViewInstance>(null);
  const scrollY = useRef(0);
  const viewportH = useRef(0);
  const contentH = useRef(0);
  const lastSaved = useRef(0);
  const latestRatio = useRef(0);
  const restored = useRef(false);
  const [resumeInfo, setResumeInfo] = useState<number | null>(null);

  // Kappaleiden sijainnit (ääneen luvun automaattista vieritystä varten).
  const textBlockY = useRef(0);
  const paraY = useRef<number[]>([]);

  const savedRatio = story ? app.progress[story.id]?.ratio : undefined;

  const persist = useCallback(
    (ratio: number) => {
      if (!story) return;
      if (ratio >= 0.97) app.clearProgress(story.id); // luettu loppuun → seuraavalla kerralla alusta
      else if (ratio > 0.02) app.saveProgress(story.id, ratio);
    },
    [story?.id, app.clearProgress, app.saveProgress],
  );

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    scrollY.current = contentOffset.y;
    const max = contentSize.height - layoutMeasurement.height;
    if (max <= 0) return;
    latestRatio.current = contentOffset.y / max;
    const now = Date.now();
    if (restored.current && now - lastSaved.current > SAVE_INTERVAL_MS) {
      lastSaved.current = now;
      persist(latestRatio.current);
    }
  };

  // Tallennetaan viimeisin kohta, kun näkymästä poistutaan.
  const persistRef = useRef(persist);
  persistRef.current = persist;
  useEffect(() => () => {
    if (restored.current) persistRef.current(latestRatio.current);
  }, []);

  // Kun sisällön korkeus tiedetään ensimmäisen kerran, vieritetään tallennettuun kohtaan.
  const tryRestore = () => {
    if (restored.current || contentH.current === 0 || viewportH.current === 0) return;
    restored.current = true;
    if (savedRatio && savedRatio > 0.02) {
      const y = savedRatio * (contentH.current - viewportH.current);
      scrollRef.current?.scrollTo({ y, animated: false });
      latestRatio.current = savedRatio;
      setResumeInfo(Math.round(savedRatio * 100));
      setTimeout(() => setResumeInfo(null), 5000);
    }
  };

  // Ääneen luettaessa vieritetään luettava kappale näkyviin.
  useEffect(() => {
    if (speech.status !== 'playing') return;
    const y = paraY.current[speech.currentIndex];
    if (y !== undefined) {
      scrollRef.current?.scrollTo({ y: Math.max(0, textBlockY.current + y - 120), animated: true });
    }
  }, [speech.currentIndex, speech.status]);

  /** Play-nappi: aloittaa ensimmäisestä ruudulla näkyvästä kappaleesta. */
  const onPlayPress = () => {
    if (speech.status === 'playing') return speech.pause();
    if (speech.status === 'paused') return speech.play();
    const visibleTop = scrollY.current - textBlockY.current;
    let start = paraY.current.findIndex((y) => y >= visibleTop - 10);
    if (start < 0) start = 0;
    speech.play(start);
  };

  if (!story) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: colors.background, padding: spacing.md }]}>
        <EmptyState emoji="🤔" title="Satua ei löytynyt" text="Palaa takaisin ja valitse toinen satu." />
        <View style={{ height: spacing.md }} />
        <IconButton icon="arrow-back" onPress={goBack} accessibilityLabel="Takaisin" />
      </SafeAreaView>
    );
  }

  const lineHeight = Math.round(fontSize * 1.6);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {/* ---------- Yläpalkki ---------- */}
      <View style={[styles.toolbar, { borderBottomColor: colors.border }]}>
        <IconButton icon="arrow-back" onPress={goBack} accessibilityLabel="Takaisin" />
        <View style={{ flex: 1 }} />
        <IconButton
          label="A−"
          onPress={() => setFontSize(fontSize - FONT_SIZE.step)}
          disabled={fontSize <= FONT_SIZE.min}
          accessibilityLabel="Pienennä tekstiä"
        />
        <IconButton
          label="A+"
          onPress={() => setFontSize(fontSize + FONT_SIZE.step)}
          disabled={fontSize >= FONT_SIZE.max}
          accessibilityLabel="Suurenna tekstiä"
        />
        <IconButton
          icon={nightMode ? 'sunny' : 'moon'}
          onPress={toggleNightMode}
          accessibilityLabel={nightMode ? 'Vaihda päivätilaan' : 'Vaihda yötilaan'}
        />
        <FavoriteButton storyId={story.id} />
      </View>

      {/* ---------- Teksti ---------- */}
      <ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={32}
        onLayout={(e) => {
          viewportH.current = e.nativeEvent.layout.height;
          tryRestore();
        }}
        onContentSizeChange={(_, h) => {
          contentH.current = h;
          tryRestore();
        }}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.cover, { backgroundColor: storyColor(story) }]}>
          <AppText style={styles.coverEmoji}>{story.emoji ?? '📖'}</AppText>
        </View>
        <AppText variant="hero" style={styles.center} accessibilityRole="header">
          {story.title}
        </AppText>
        <AppText variant="caption" muted style={styles.center}>
          ⏱ noin {story.readingMinutes} min · {story.ageMin}+ v · {story.categories.map(categoryTitle).join(', ')}
        </AppText>

        <View
          style={styles.textBlock}
          onLayout={(e: LayoutChangeEvent) => {
            textBlockY.current = e.nativeEvent.layout.y;
          }}
        >
          {paras.map((p, i) => {
            const active = speech.status !== 'idle' && speech.currentIndex === i;
            return (
              <View
                key={i}
                onLayout={(e) => {
                  paraY.current[i] = e.nativeEvent.layout.y;
                }}
                style={[styles.paragraph, active && { backgroundColor: colors.highlight }]}
              >
                <AppText style={{ fontFamily: fonts.regular, fontSize, lineHeight }}>{p}</AppText>
              </View>
            );
          })}
        </View>

        <AppText variant="title" style={[styles.center, { marginTop: spacing.lg }]}>
          ✨ Loppu ✨
        </AppText>

        {/* ---------- Lähde, tekijä ja lisenssi (pelkkää tekstiä, ei linkkejä) ---------- */}
        <View style={[styles.sourceBox, { backgroundColor: colors.surfaceAlt }]}>
          <SourceRow label="Lähde" value={story.source} />
          <SourceRow label="Tekijä" value={story.author} />
          <SourceRow label="Lisenssi" value={story.license} />
        </View>
      </ScrollView>

      {/* ---------- "Jatkettiin..." -ilmoitus ---------- */}
      {resumeInfo !== null ? (
        <View style={[styles.toast, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <AppText variant="caption">Jatketaan siitä, mihin jäit</AppText>
          <Pressable
            onPress={() => {
              scrollRef.current?.scrollTo({ y: 0, animated: true });
              setResumeInfo(null);
            }}
            accessibilityRole="button"
            style={[styles.toastButton, { backgroundColor: colors.surfaceAlt }]}
          >
            <AppText variant="caption">Alusta</AppText>
          </Pressable>
        </View>
      ) : null}

      {/* ---------- Ääneen luku ---------- */}
      <SafeAreaView edges={['bottom']} style={[styles.speechBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <IconButton
          icon={speech.status === 'playing' ? 'pause' : 'play'}
          filled
          onPress={onPlayPress}
          accessibilityLabel={speech.status === 'playing' ? 'Tauko' : 'Lue ääneen'}
        />
        <AppText variant="subtitle" style={{ flex: 1 }}>
          {speech.status === 'playing' ? 'Luetaan ääneen…' : speech.status === 'paused' ? 'Tauolla' : 'Lue ääneen'}
        </AppText>
        {speech.status !== 'idle' ? (
          <IconButton icon="stop" onPress={speech.stop} accessibilityLabel="Lopeta ääneen luku" />
        ) : null}
      </SafeAreaView>
    </SafeAreaView>
  );
}

function SourceRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ gap: 2 }}>
      <AppText variant="caption" muted>
        {label.toUpperCase()}
      </AppText>
      <AppText>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  scrollContent: { padding: spacing.lg, paddingBottom: 48, gap: spacing.sm, maxWidth: 720, width: '100%', alignSelf: 'center' },
  cover: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  coverEmoji: { fontSize: 64, lineHeight: 76 },
  center: { textAlign: 'center' },
  textBlock: { marginTop: spacing.md, gap: spacing.sm },
  paragraph: { borderRadius: radius.md, paddingHorizontal: spacing.sm, paddingVertical: 4, marginHorizontal: -spacing.sm },
  sourceBox: { borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm, marginTop: spacing.md },
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 110,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingLeft: spacing.md,
    paddingRight: 4,
    paddingVertical: 4,
  },
  toastButton: { borderRadius: radius.pill, paddingHorizontal: spacing.md, minHeight: 44, justifyContent: 'center' },
  speechBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
