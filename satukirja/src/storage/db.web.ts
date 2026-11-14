/**
 * Selainversion tallennus (localStorage). Samat funktiot kuin db.ts:ssä.
 * Tätä käytetään vain, kun sovellusta kokeillaan selaimessa (npm run web).
 * Puhelimessa käytetään aina SQLiteä (db.ts).
 */
import type { StoredData } from './types';

const KEY = 'satukirja-data';

function read(): StoredData {
  try {
    const raw = globalThis.localStorage?.getItem(KEY);
    if (raw) return JSON.parse(raw) as StoredData;
  } catch {
    // Selaimen tallennus ei ole käytettävissä, joten aloitetaan tyhjästä.
  }
  return { favorites: [], progress: {}, settings: {} };
}

function write(data: StoredData) {
  try {
    globalThis.localStorage?.setItem(KEY, JSON.stringify(data));
  } catch {
    // ei haittaa
  }
}

export async function loadAll(): Promise<StoredData> {
  return read();
}

export async function setFavorite(storyId: string, isFavorite: boolean) {
  const d = read();
  d.favorites = d.favorites.filter((id) => id !== storyId);
  if (isFavorite) d.favorites.unshift(storyId);
  write(d);
}

export async function saveProgress(storyId: string, ratio: number) {
  const d = read();
  d.progress[storyId] = { ratio, updatedAt: Date.now() };
  write(d);
}

export async function clearProgress(storyId: string) {
  const d = read();
  delete d.progress[storyId];
  write(d);
}

export async function saveSetting(key: string, value: string) {
  const d = read();
  d.settings[key] = value;
  write(d);
}
