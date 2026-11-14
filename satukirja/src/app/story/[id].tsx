/**
 * LUKUNÄKYMÄ
 *  - Iso kansikuva ja selkeä, säädettävä teksti (A− / A+)
 *  - Yötila (kuu/aurinko-nappi)
 *  - Arvioitu lukuaika ja ikäsuositus
 *  - Sydän: lisää suosikkeihin
 *  - Ääneen luku (play/pause) ja luettavan kappaleen korostus
 *  - Muistaa lukukohdan ("Jatka lukemista")
 *  - Sadun lopussa juhlistus ja tarra tarrakirjaan
 *  - Lopussa lähde, tekijä ja lisenssi
 *
 * Osoite: /story/<id>. Lisäämällä ?autoplay=1 ääneen luku alkaa heti ("Kuuntele"-nappi).
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
import { Ionicons } from '@expo/vector-icons';
import {
  ALL_STORIES,
  categoryTitle,
  getNextStory,
  getStory,
  paragraphs as splitParagraphs,
} from '@/data/storyRepository';
import { useAppData } from '@/storage/AppDataContext';
import { useSpeech } from '@/hooks/useSpeech';
import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { FavoriteButton } from '@/components/FavoriteButton';
import { EmptyState } from '@/components/EmptyState';
import { StoryCover } from '@/components/StoryCover';
import { Celebration } from '@/components/Celebration';
import { PrimaryButton } from '@/components/Buttons';
import { PressableScale } from '@/components/PressableScale';
import { FONT_SIZE, fonts, radius, softShadow, spacing } from '@/theme/theme';
import { successFeedback } from '@/utils/haptics';

/** Takaisin edelliseen näkymään, tai etusivulle jos satu avattiin suoraan. */
function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

/** Kuinka usein lukukohta tallennetaan vierittäessä (millisekunteina). */
const SAVE_INTERVAL_MS = 1000;

export default function StoryScreen() {
  const { id, autoplay } = useLocalSearchParams<{ id: string; autoplay?: string }>();
  const story = getStory(id);
  const app = useAppData();
  const { colors, fontSize, setFontSize, nightMode, toggleNightMode } = app;

  // --- Juhlistus sadun lopussa ---------------------------------------------------
  const [celebration, setCelebration] = useState<{ isNew: boolean; count: number } | null>(null);
  const celebrated = useRef(false);

  const finishStory = useCallback(() => {
    if (!story || celebrated.current) return;
    celebrated.current = true;
    const isNew = app.markCompleted(story.id);
    const before = Object.keys(app.completed).filter((cid) => getStory(cid)).length;
    app.clearProgress(story.id);
    successFeedback();
    setCelebration({ isNew, count: before + (isNew ? 1 : 0) });
  }, [story, app]);

  const paras = useMemo(() => (story ? splitParagraphs(story) : []), [story]);
  const speech = useSpeech(paras, finishStory);

  // --- Vieritys ja lukukohta --------------------------------------------------
  const scrollRef = useRef<ScrollViewInstance>(null);
  const scrollY = useRef(0);
  const viewportH = useRef(0);
  const contentH = useRef(0);
  const lastSaved = useRef(0);
  const latestRatio = useRef(0);
  const restored = useRef(false);
  const [resumeInfo, setResumeInfo] = useState(false);

  // Kappaleiden sijainnit (ääneen luvun automaattista vieritystä varten).
  const textBlockY = useRef(0);
  const paraY = useRef<number[]>([]);

  const savedRatio = story ? app.progress[story.id]?.ratio : undefined;

  const persist = useCallback(
    (ratio: number) => {
      if (!story || celebrated.current) return;
      if (ratio > 0.02 && ratio < 0.97) app.saveProgress(story.id, ratio);
    },
    [story, app],
  );

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    scrollY.current = contentOffset.y;
    const max = contentSize.height - layoutMeasurement.height;
    if (max <= 0) return;
    latestRatio.current = contentOffset.y / max;
    if (!restored.current) return;
    // Vieritetty aivan loppuun → satu luettu!
    if (latestRatio.current >= 0.985 && speech.status === 'idle') finishStory();
    const now = Date.now();
    if (now - lastSaved.current > SAVE_INTERVAL_MS) {
      lastSaved.current = now;
      persist(latestRatio.current);
    }
  };

  // Tallennetaan viimeisin kohta, kun näkymästä poistutaan.
  const persistRef = useRef(persist);
  persistRef.current = persist;
  useEffect(
    () => () => {
      if (restored.current) persistRef.current(latestRatio.current);
    },
    [],
  );

  // Kun sisällön korkeus tiedetään ensimmäisen kerran, vieritetään tallennettuun kohtaan.
  const tryRestore = () => {
    if (restored.current || contentH.current === 0 || viewportH.current === 0) return;
    restored.current = true;
    if (savedRatio && savedRatio > 0.02 && autoplay !== '1') {
      const y = savedRatio * (contentH.current - viewportH.current);
      scrollRef.current?.scrollTo({ y, animated: false });
      latestRatio.current = savedRatio;
      setResumeInfo(true);
      setTimeout(() => setResumeInfo(false), 5000);
    }
  };

  // "Kuuntele"-napista tultaessa ääneen luku alkaa heti.
  const autoplayed = useRef(false);
  useEffect(() => {
    if (autoplay === '1' && story && !autoplayed.current) {
      autoplayed.current = true;
      const t = setTimeout(() => speech.play(0), 500);
      return () => clearTimeout(t);
    }
  }, [autoplay, story]);

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
  const completedIds = Object.keys(app.completed);
  const nextStory = getNextStory(story.id, app.profile.age, completedIds);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {/* ---------- Yläpalkki ---------- */}
      <View style={styles.toolbar}>
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
        <StoryCover
          story={story}
          width="100%"
          height={210}
          radius={radius.xl}
          emojiSize={96}
          done={!!app.completed[story.id]}
          style={softShadow(colors.shadow, 1)}
        />
        <AppText variant="display" style={[styles.center, { marginTop: spacing.md }]} accessibilityRole="header">
          {story.title}
        </AppText>
        <View style={styles.metaRow}>
          <Meta text={`⏱ ${story.readingMinutes} min`} />
          <Meta text={`${story.ageMin}+ vuotta`} />
          {story.categories.map((c) => (
            <Meta key={c} text={categoryTitle(c)} />
          ))}
        </View>

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
                <AppText style={{ fontFamily: fonts.regular, fontSize, lineHeight }}>
                  {/* Ensimmäisen kappaleen alkukirjain isona, kuten satukirjoissa */}
                  {i === 0 ? (
                    <AppText style={{ fontFamily: fonts.black, fontSize: fontSize * 1.5, color: colors.primary }}>
                      {p.charAt(0)}
                    </AppText>
                  ) : null}
                  {i === 0 ? p.slice(1) : p}
                </AppText>
              </View>
            );
          })}
        </View>

        <View style={styles.endMark}>
          <AppText variant="hero" style={styles.center}>
            ✨ Loppu ✨
          </AppText>
          {!app.completed[story.id] ? (
            <PrimaryButton label="Luin sadun! Hae tarra 🏅" onPress={finishStory} />
          ) : null}
        </View>

        {/* ---------- Lähde, tekijä ja lisenssi (pelkkää tekstiä, ei linkkejä) ---------- */}
        <View style={[styles.sourceBox, { backgroundColor: colors.surfaceAlt }]}>
          <SourceRow label="Lähde" value={story.source} />
          <SourceRow label="Tekijä" value={story.author} />
          <SourceRow label="Lisenssi" value={story.license} />
        </View>
      </ScrollView>

      {/* ---------- "Jatketaan..." -ilmoitus ---------- */}
      {resumeInfo ? (
        <View style={[styles.toast, { backgroundColor: colors.surface }, softShadow(colors.shadow, 1)]}>
          <AppText variant="caption">📍 Jatketaan siitä, mihin jäit</AppText>
          <Pressable
            onPress={() => {
              scrollRef.current?.scrollTo({ y: 0, animated: true });
              setResumeInfo(false);
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
        <PressableScale
          onPress={onPlayPress}
          accessibilityRole="button"
          accessibilityLabel={speech.status === 'playing' ? 'Tauko' : 'Lue ääneen'}
          style={[styles.playButton, { backgroundColor: colors.primary }, softShadow(colors.primary, 1)]}
        >
          <Ionicons
            name={speech.status === 'playing' ? 'pause' : 'play'}
            size={30}
            color={colors.onPrimary}
            style={speech.status === 'playing' ? undefined : { marginLeft: 4 }}
          />
        </PressableScale>
        <View style={{ flex: 1 }}>
          <AppText variant="subtitle">
            {speech.status === 'playing' ? 'Luetaan ääneen…' : speech.status === 'paused' ? 'Tauolla' : 'Kuuntele satu'}
          </AppText>
          <AppText variant="caption" muted>
            {speech.status === 'idle' ? 'Satu luetaan ääneen suomeksi' : `Kappale ${speech.currentIndex + 1} / ${paras.length}`}
          </AppText>
        </View>
        {speech.status !== 'idle' ? (
          <IconButton icon="stop" onPress={speech.stop} accessibilityLabel="Lopeta ääneen luku" />
        ) : null}
      </SafeAreaView>

      {celebration ? (
        <Celebration
          visible
          story={story}
          isNewSticker={celebration.isNew}
          stickerCount={celebration.count}
          totalStories={ALL_STORIES.length}
          nextStory={nextStory}
          onNext={() => {
            setCelebration(null);
            if (nextStory) router.replace(`/story/${nextStory.id}`);
          }}
          onClose={() => {
            setCelebration(null);
            goBack();
          }}
        />
      ) : null}
    </SafeAreaView>
  );
}

function Meta({ text }: { text: string }) {
  const { colors } = useAppData();
  return (
    <View style={[styles.meta, { backgroundColor: colors.surfaceAlt }]}>
      <AppText variant="caption" muted>
        {text}
      </AppText>
    </View>
  );
}

function SourceRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ gap: 2 }}>
      <AppText variant="overline" muted>
        {label}
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
  },
  scrollContent: { padding: spacing.md, paddingBottom: 48, gap: spacing.sm, maxWidth: 720, width: '100%', alignSelf: 'center' },
  center: { textAlign: 'center' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6 },
  meta: { borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 4 },
  textBlock: { marginTop: spacing.lg, gap: spacing.sm, paddingHorizontal: spacing.sm },
  paragraph: { borderRadius: radius.md, paddingHorizontal: spacing.sm, paddingVertical: 4, marginHorizontal: -spacing.sm },
  endMark: { gap: spacing.md, marginTop: spacing.xl, marginBottom: spacing.md },
  sourceBox: { borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm, marginTop: spacing.md },
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 110,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
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
    paddingTop: spacing.sm + 2,
    paddingBottom: spacing.sm + 2,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  playButton: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
});
