/**
 * AppDataContext jakaa käyttäjän tiedot kaikille näkymille:
 * suosikit, lukukohdat ja asetukset.
 *
 * Toimintaperiaate:
 *  1. Sovelluksen käynnistyessä tiedot luetaan tietokannasta muistiin.
 *  2. Kun käyttäjä muuttaa jotain (esim. painaa sydäntä), muisti päivittyy heti,
 *     jolloin ruutu päivittyy viiveettä, ja muutos tallennetaan tietokantaan taustalla.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as db from './db';
import type { StoredData } from './types';
import { FONT_SIZE, darkPalette, lightPalette, type Palette } from '@/theme/theme';

interface AppData {
  ready: boolean;
  favorites: string[];
  isFavorite: (storyId: string) => boolean;
  toggleFavorite: (storyId: string) => void;
  progress: StoredData['progress'];
  saveProgress: (storyId: string, ratio: number) => void;
  clearProgress: (storyId: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  nightMode: boolean;
  toggleNightMode: () => void;
  /** Nykyisen tilan (päivä/yö) värit. */
  colors: Palette;
}

const AppDataContext = createContext<AppData | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [progress, setProgress] = useState<StoredData['progress']>({});
  const [fontSize, setFontSizeState] = useState(FONT_SIZE.default);
  const [nightMode, setNightMode] = useState(false);

  // 1. Luetaan tallennetut tiedot kerran käynnistyksessä.
  useEffect(() => {
    db.loadAll()
      .then((data) => {
        setFavorites(data.favorites);
        setProgress(data.progress);
        const size = Number(data.settings.fontSize);
        if (size >= FONT_SIZE.min && size <= FONT_SIZE.max) setFontSizeState(size);
        setNightMode(data.settings.nightMode === '1');
      })
      .catch((e) => console.warn('Tietojen lukeminen epäonnistui', e))
      .finally(() => setReady(true));
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
      const next = { ...prev };
      delete next[id];
      return next;
    });
    db.clearProgress(id).catch(console.warn);
  }, []);

  const setFontSize = useCallback((size: number) => {
    const clamped = Math.max(FONT_SIZE.min, Math.min(FONT_SIZE.max, size));
    setFontSizeState(clamped);
    db.saveSetting('fontSize', String(clamped)).catch(console.warn);
  }, []);

  const toggleNightMode = useCallback(() => {
    setNightMode((prev) => {
      db.saveSetting('nightMode', prev ? '0' : '1').catch(console.warn);
      return !prev;
    });
  }, []);

  const value = useMemo<AppData>(
    () => ({
      ready,
      favorites,
      isFavorite,
      toggleFavorite,
      progress,
      saveProgress,
      clearProgress,
      fontSize,
      setFontSize,
      nightMode,
      toggleNightMode,
      colors: nightMode ? darkPalette : lightPalette,
    }),
    [ready, favorites, isFavorite, toggleFavorite, progress, saveProgress, clearProgress, fontSize, setFontSize, nightMode, toggleNightMode],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

/** Käytä tätä näkymissä: const { colors, toggleFavorite } = useAppData(); */
export function useAppData(): AppData {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData täytyy käyttää AppDataProviderin sisällä');
  return ctx;
}
