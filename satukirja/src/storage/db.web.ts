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
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoredData>;
      return { favorites: [], progress: {}, settings: {}, ...parsed, completed: parsed.completed ?? {} };
    }
  } catch {
    // Selaimen tallennus ei ole käytettävissä, joten aloitetaan tyhjästä.
  }
  return { favorites: [], progress: {}, completed: {}, settings: {} };
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

export async function markCompleted(storyId: string) {
  const d = read();
  const prev = d.completed[storyId];
  d.completed[storyId] = { count: (prev?.count ?? 0) + 1, firstAt: prev?.firstAt ?? Date.now() };
  write(d);
}

export async function resetCompleted() {
  const d = read();
  d.completed = {};
  write(d);
}

export async function saveSetting(key: string, value: string) {
  const d = read();
  d.settings[key] = value;
  write(d);
}
