/**
 * AppDataContext jakaa käyttäjän tiedot kaikille näkymille:
 * lapsen profiilin, suosikit, lukukohdat, tarrat ja asetukset.
 *
 * Toimintaperiaate:
 *  1. Sovelluksen käynnistyessä tiedot luetaan tietokannasta muistiin.
 *  2. Kun käyttäjä muuttaa jotain (esim. painaa sydäntä), muisti päivittyy heti,
 *     jolloin ruutu päivittyy viiveettä, ja muutos tallennetaan tietokantaan taustalla.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as db from './db';
import type { StoredData } from './types';
import { FONT_SIZE, NIGHT_HOURS, darkPalette, lightPalette, type Palette } from '@/theme/theme';

/** auto = yötila iltaisin automaattisesti, light = aina päivä, dark = aina yö */
export type ThemeMode = 'auto' | 'light' | 'dark';

export interface ChildProfile {
  name: string; // voi olla tyhjä
  age: number; // vuosina
}

interface AppData {
  ready: boolean;
  // --- Profiili ---
  onboarded: boolean;
  profile: ChildProfile;
  saveProfile: (p: ChildProfile) => void;
  // --- Suosikit ---
  favorites: string[];
  isFavorite: (storyId: string) => boolean;
  toggleFavorite: (storyId: string) => void;
  // --- Lukukohta ---
  progress: StoredData['progress'];
  saveProgress: (storyId: string, ratio: number) => void;
  clearProgress: (storyId: string) => void;
  // --- Tarrat (loppuun luetut sadut) ---
  completed: StoredData['completed'];
  /** Palauttaa true, jos tarra on uusi (satu luettiin loppuun ensimmäistä kertaa). */
  markCompleted: (storyId: string) => boolean;
  resetStickers: () => void;
  // --- Ulkoasu ---
  fontSize: number;
  setFontSize: (size: number) => void;
  themeMode: ThemeMode;
  setThemeMode: (m: ThemeMode) => void;
  /** Onko yötila juuri nyt päällä (huomioi automaattitilan kellonajan). */
  nightMode: boolean;
  toggleNightMode: () => void;
  /** Nykyisen tilan (päivä/yö) värit. */
  colors: Palette;
}

const AppDataContext = createContext<AppData | null>(null);

function isNightHour(d = new Date()) {
  const h = d.getHours();
  return h >= NIGHT_HOURS.start || h < NIGHT_HOURS.end;
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [profile, setProfile] = useState<ChildProfile>({ name: '', age: 4 });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [progress, setProgress] = useState<StoredData['progress']>({});
  const [completed, setCompleted] = useState<StoredData['completed']>({});
  const [fontSize, setFontSizeState] = useState(FONT_SIZE.default);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  const [nightHour, setNightHour] = useState(isNightHour());

  // 1. Luetaan tallennetut tiedot kerran käynnistyksessä.
  useEffect(() => {
    db.loadAll()
      .then((data) => {
        setFavorites(data.favorites);
        setProgress(data.progress);
        setCompleted(data.completed);
        const s = data.settings;
        const size = Number(s.fontSize);
        if (size >= FONT_SIZE.min && size <= FONT_SIZE.max) setFontSizeState(size);
        if (s.themeMode === 'light' || s.themeMode === 'dark' || s.themeMode === 'auto') setThemeModeState(s.themeMode);
        setOnboarded(s.onboarded === '1');
        const age = Number(s.childAge);
        setProfile({ name: s.childName ?? '', age: age > 0 ? age : 4 });
      })
      .catch((e) => console.warn('Tietojen lukeminen epäonnistui', e))
      .finally(() => setReady(true));
  }, []);

  // 2. Automaattista yötilaa varten tarkistetaan kellonaika minuutin välein.
  useEffect(() => {
    const t = setInterval(() => setNightHour(isNightHour()), 60_000);
    return () => clearInterval(t);
  }, []);

  const saveProfile = useCallback((p: ChildProfile) => {
    const clean = { name: p.name.trim().slice(0, 20), age: p.age };
    setProfile(clean);
    setOnboarded(true);
    db.saveSetting('childName', clean.name).catch(console.warn);
    db.saveSetting('childAge', String(clean.age)).catch(console.warn);
    db.saveSetting('onboarded', '1').catch(console.warn);
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const willBeFavorite = !prev.includes(id);
      db.setFavorite(id, willBeFavorite).catch(console.warn);
      return willBeFavorite ? [id, ...prev] : prev.filter((x) => x !== id);
    });
  }, []);

  const saveProgress = useCallback((id: string, ratio: number) => {
    const clamped = Math.max(0, Math.min(1, ratio));
    setProgress((prev) => ({ ...prev, [id]: { ratio: clamped, updatedAt: Date.now() } }));
    db.saveProgress(id, clamped).catch(console.warn);
  }, []);

  const clearProgress = useCallback((id: string) => {
    setProgress((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
    db.clearProgress(id).catch(console.warn);
  }, []);

  const markCompleted = useCallback(
    (id: string) => {
      const isNew = !completed[id];
      setCompleted((prev) => ({
        ...prev,
        [id]: { count: (prev[id]?.count ?? 0) + 1, firstAt: prev[id]?.firstAt ?? Date.now() },
      }));
      db.markCompleted(id).catch(console.warn);
      return isNew;
    },
    [completed],
  );

  const resetStickers = useCallback(() => {
    setCompleted({});
    db.resetCompleted().catch(console.warn);
  }, []);

  const setFontSize = useCallback((size: number) => {
    const clamped = Math.max(FONT_SIZE.min, Math.min(FONT_SIZE.max, size));
    setFontSizeState(clamped);
    db.saveSetting('fontSize', String(clamped)).catch(console.warn);
  }, []);

  const setThemeMode = useCallback((m: ThemeMode) => {
    setThemeModeState(m);
    db.saveSetting('themeMode', m).catch(console.warn);
  }, []);

  const nightMode = themeMode === 'dark' || (themeMode === 'auto' && nightHour);

  // Kuu/aurinko-nappi: vaihtaa suoraan päinvastaiseen tilaan.
  const toggleNightMode = useCallback(() => {
    setThemeMode(nightMode ? 'light' : 'dark');
  }, [nightMode, setThemeMode]);

  const value = useMemo<AppData>(
    () => ({
      ready,
      onboarded,
      profile,
      saveProfile,
      favorites,
      isFavorite,
      toggleFavorite,
      progress,
      saveProgress,
      clearProgress,
      completed,
      markCompleted,
      resetStickers,
      fontSize,
      setFontSize,
      themeMode,
      setThemeMode,
      nightMode,
      toggleNightMode,
      colors: nightMode ? darkPalette : lightPalette,
    }),
    [
      ready, onboarded, profile, saveProfile, favorites, isFavorite, toggleFavorite, progress, saveProgress,
      clearProgress, completed, markCompleted, resetStickers, fontSize, setFontSize, themeMode, setThemeMode,
      nightMode, toggleNightMode,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

/** Käytä tätä näkymissä: const { colors, toggleFavorite } = useAppData(); */
export function useAppData(): AppData {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData täytyy käyttää AppDataProviderin sisällä');
  return ctx;
}
