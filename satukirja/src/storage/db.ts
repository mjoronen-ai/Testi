/**
 * Paikallinen tietokanta (SQLite) puhelimessa.
 *
 * Tänne tallennetaan vain käyttäjän omat tiedot:
 *  - suosikit
 *  - lukukohta ("Jatka lukemista")
 *  - loppuun luetut sadut (tarrakirja)
 *  - asetukset (lapsen nimi ja ikä, fonttikoko, yötila)
 *
 * Itse sadut ovat sovelluksen mukana JSON-tiedostossa, joten niitä ei tarvitse tallentaa tänne.
 * Kaikki toimii ilman verkkoyhteyttä.
 *
 * Huom: selainversiossa käytetään tiedostoa db.web.ts (localStorage), jolla on samat funktiot.
 */
import * as SQLite from 'expo-sqlite';
import type { StoredData } from './types';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/** Avaa tietokannan kerran ja luo taulut, jos niitä ei vielä ole. */
function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('satukirja.db');
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS favorites (
          story_id   TEXT PRIMARY KEY NOT NULL,
          created_at INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS reading_progress (
          story_id   TEXT PRIMARY KEY NOT NULL,
          ratio      REAL NOT NULL,      -- 0 = alku, 1 = loppu
          updated_at INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS completed (
          story_id TEXT PRIMARY KEY NOT NULL,
          count    INTEGER NOT NULL,     -- montako kertaa luettu loppuun
          first_at INTEGER NOT NULL      -- milloin tarra ansaittiin
        );
        CREATE TABLE IF NOT EXISTS settings (
          key   TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL
        );
      `);
      return db;
    })();
  }
  return dbPromise;
}

/** Lukee kaikki tallennetut tiedot kerralla sovelluksen käynnistyessä. */
export async function loadAll(): Promise<StoredData> {
  const db = await getDb();
  const favs = await db.getAllAsync<{ story_id: string }>(
    'SELECT story_id FROM favorites ORDER BY created_at DESC',
  );
  const progressRows = await db.getAllAsync<{ story_id: string; ratio: number; updated_at: number }>(
    'SELECT story_id, ratio, updated_at FROM reading_progress',
  );
  const completedRows = await db.getAllAsync<{ story_id: string; count: number; first_at: number }>(
    'SELECT story_id, count, first_at FROM completed',
  );
  const settingRows = await db.getAllAsync<{ key: string; value: string }>('SELECT key, value FROM settings');

  const progress: StoredData['progress'] = {};
  for (const row of progressRows) {
    progress[row.story_id] = { ratio: row.ratio, updatedAt: row.updated_at };
  }
  const completed: StoredData['completed'] = {};
  for (const row of completedRows) {
    completed[row.story_id] = { count: row.count, firstAt: row.first_at };
  }
  const settings: Record<string, string> = {};
  for (const row of settingRows) settings[row.key] = row.value;

  return { favorites: favs.map((f) => f.story_id), progress, completed, settings };
}

export async function setFavorite(storyId: string, isFavorite: boolean): Promise<void> {
  const db = await getDb();
  if (isFavorite) {
    await db.runAsync('INSERT OR REPLACE INTO favorites (story_id, created_at) VALUES (?, ?)', storyId, Date.now());
  } else {
    await db.runAsync('DELETE FROM favorites WHERE story_id = ?', storyId);
  }
}

export async function saveProgress(storyId: string, ratio: number): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'INSERT OR REPLACE INTO reading_progress (story_id, ratio, updated_at) VALUES (?, ?, ?)',
    storyId,
    ratio,
    Date.now(),
  );
}

export async function clearProgress(storyId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM reading_progress WHERE story_id = ?', storyId);
}

/** Merkitsee sadun luetuksi loppuun (antaa tarran ensimmäisellä kerralla). */
export async function markCompleted(storyId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO completed (story_id, count, first_at) VALUES (?, 1, ?)
     ON CONFLICT(story_id) DO UPDATE SET count = count + 1`,
    storyId,
    Date.now(),
  );
}

/** Tyhjentää tarrakirjan (asetuksista). */
export async function resetCompleted(): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM completed');
}

export async function saveSetting(key: string, value: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', key, value);
}
