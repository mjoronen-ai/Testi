/**
 * Satuvarasto: kaikki satuihin liittyvät haut ja suodatukset.
 *
 * Sadut tulevat tiedostosta stories.generated.json, jonka tuontityökalu luo
 * content/-kansion tiedostoista komennolla:  npm run import-stories
 * Älä muokkaa JSON-tiedostoa käsin, vaan muokkaa content/-kansion tiedostoja.
 */
import storiesJson from './stories.generated.json';
import type { CategoryId, Story } from '@/types/story';
import { categoryColors } from '@/theme/theme';

export const ALL_STORIES: Story[] = storiesJson as Story[];

/** Alle tämän minuuttimäärän sadut näkyvät "Lyhyet"-kategoriassa. */
export const SHORT_STORY_MINUTES = 5;

/** Kategoria tai ryhmä, joka näytetään Kategoriat-näkymässä. */
export interface StoryGroup {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  /** Kertoo, kuuluuko satu tähän ryhmään. */
  matches: (s: Story) => boolean;
}

const byCategory = (c: CategoryId) => (s: Story) => s.categories.includes(c);

/** Aiheen mukaiset kategoriat. */
export const TOPIC_GROUPS: StoryGroup[] = [
  { id: 'elainsadut', title: 'Eläinsadut', description: 'Kettuja, karhuja ja siilejä', emoji: '🦊', color: categoryColors.elainsadut, matches: byCategory('elainsadut') },
  { id: 'kansansadut', title: 'Kansansadut', description: 'Vanhoja tarinoita uusin sanoin', emoji: '🏡', color: categoryColors.kansansadut, matches: byCategory('kansansadut') },
  { id: 'suomalaiset', title: 'Suomalaiset kansansadut', description: 'Hölmöläisiä, kettuja ja Väinämöinen', emoji: '🇫🇮', color: categoryColors.suomalaiset, matches: byCategory('suomalaiset') },
  { id: 'iltasadut', title: 'Iltasadut', description: 'Rauhallisia tarinoita ennen unta', emoji: '🌙', color: categoryColors.iltasadut, matches: byCategory('iltasadut') },
  { id: 'seikkailusadut', title: 'Seikkailusadut', description: 'Jännitystä isommille', emoji: '🧭', color: categoryColors.seikkailusadut, matches: byCategory('seikkailusadut') },
  { id: 'joulusadut', title: 'Joulusadut', description: 'Tonttuja, poroja ja joulun taikaa', emoji: '🎄', color: categoryColors.joulusadut, matches: byCategory('joulusadut') },
  { id: 'vuodenajat', title: 'Vuodenajat ja juhlat', description: 'Kevättä, kesää, syksyä ja talvea', emoji: '🍂', color: categoryColors.vuodenajat, matches: byCategory('vuodenajat') },
  { id: 'lyhyet', title: 'Lyhyet', description: `Alle ${SHORT_STORY_MINUTES} minuuttia`, emoji: '⏱️', color: categoryColors.lyhyet, matches: (s) => s.readingMinutes < SHORT_STORY_MINUTES },
];

/** Ikäryhmät (perustuvat sadun ikäsuositukseen ageMin). */
export const AGE_GROUPS: StoryGroup[] = [
  { id: 'ika-pienet', title: 'Pienimmille', description: '2–3-vuotiaille', emoji: '🧸', color: '#F7D6D0', matches: (s) => s.ageMin <= 3 },
  { id: 'ika-leikki', title: 'Leikki-ikäisille', description: '4–5-vuotiaille', emoji: '🪁', color: '#D6E6C3', matches: (s) => s.ageMin >= 4 && s.ageMin <= 5 },
  { id: 'ika-isommat', title: 'Isommille', description: '6 vuotta ja yli', emoji: '📚', color: '#CFD8EE', matches: (s) => s.ageMin >= 6 },
];

/** Kaikki sadut yhtenä ryhmänä (Selaa → "Näytä kaikki"). */
const ALL_GROUP: StoryGroup = {
  id: 'kaikki', title: 'Kaikki sadut', description: 'Koko satukirjasto aakkosjärjestyksessä', emoji: '📚', color: '#F3D27A', matches: () => true,
};

const ALL_GROUPS = [...TOPIC_GROUPS, ...AGE_GROUPS, ALL_GROUP];

export function getGroup(id: string): StoryGroup | undefined {
  return ALL_GROUPS.find((g) => g.id === id);
}

export function getStoriesInGroup(groupId: string): Story[] {
  const group = getGroup(groupId);
  return group ? ALL_STORIES.filter(group.matches) : [];
}

export function getStory(id: string): Story | undefined {
  return ALL_STORIES.find((s) => s.id === id);
}

/** Kortin väri: sadun oma väri tai ensimmäisen kategorian väri. */
export function storyColor(story: Story): string {
  return story.color ?? categoryColors[story.categories[0]] ?? '#F3DFA2';
}

/** Kategorian nimi suomeksi, esim. "elainsadut" → "Eläinsadut". */
export function categoryTitle(id: CategoryId): string {
  return TOPIC_GROUPS.find((g) => g.id === id)?.title ?? id;
}

/**
 * Päivän satu: valitaan päivämäärän perusteella, joten se pysyy samana koko päivän
 * ja vaihtuu keskiyöllä. Ei vaadi verkkoyhteyttä.
 */
export function getStoryOfTheDay(date = new Date()): Story | undefined {
  if (ALL_STORIES.length === 0) return undefined;
  const dayNumber = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000,
  );
  // Kerrotaan alkuluvulla, jotta peräkkäisinä päivinä tulee vaihtelevasti eri satuja.
  return ALL_STORIES[(dayNumber * 7919) % ALL_STORIES.length];
}

/**
 * Haku otsikon, avainsanojen, tekijän ja tekstin perusteella.
 * Osumat järjestetään: otsikko > avainsana > tekijä/kategoria > teksti.
 */
export function searchStories(query: string): Story[] {
  const q = query.trim().toLocaleLowerCase('fi');
  if (q.length === 0) return [];

  const scored = ALL_STORIES.map((s) => {
    let score = 0;
    if (s.title.toLocaleLowerCase('fi').includes(q)) score += 100;
    if (s.keywords.some((k) => k.toLocaleLowerCase('fi').includes(q))) score += 50;
    if (s.author.toLocaleLowerCase('fi').includes(q)) score += 20;
    if (s.categories.some((c) => categoryTitle(c).toLocaleLowerCase('fi').includes(q))) score += 20;
    if (s.text.toLocaleLowerCase('fi').includes(q)) score += 5;
    return { s, score };
  });

  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.s.title.localeCompare(b.s.title, 'fi'))
    .map((x) => x.s);
}

/** Jaetaan teksti kappaleisiin (tyhjä rivi erottaa kappaleet). */
export function paragraphs(story: Story): string[] {
  return story.text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Suositukset lapsen iän mukaan: sadut, joiden ikäsuositus sopii (enintään lapsen ikä,
 * eikä liian vauvamainen). Lukemattomat ensin, jotta lapsi löytää aina uutta.
 */
export function getRecommended(age: number, completedIds: string[] = []): Story[] {
  const fits = ALL_STORIES.filter((s) => s.ageMin <= age && s.ageMin >= age - 3);
  const pool = fits.length > 0 ? fits : ALL_STORIES.filter((s) => s.ageMin <= age);
  const unread = pool.filter((s) => !completedIds.includes(s.id));
  const read = pool.filter((s) => completedIds.includes(s.id));
  return [...rotateDaily(unread), ...rotateDaily(read)];
}

/** Seuraava satu luettavaksi: ensimmäinen lukematon suositus (tai satunnainen muu). */
export function getNextStory(currentId: string, age: number, completedIds: string[]): Story | undefined {
  const rec = getRecommended(age, completedIds).filter((s) => s.id !== currentId);
  return rec.find((s) => !completedIds.includes(s.id)) ?? rec[0];
}

/**
 * Kiertää listaa päivän mukaan: karusellien alussa näkyy joka päivä eri satuja,
 * joten etusivu tuntuu tuoreelta ilman satunnaisuutta (järjestys pysyy saman päivän ajan).
 */
export function rotateDaily<T>(list: T[], date = new Date()): T[] {
  if (list.length < 2) return list;
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  const k = (day * 5) % list.length;
  return [...list.slice(k), ...list.slice(0, k)];
}

/** Ikäryhmän tunniste lapsen iän mukaan (etusivun "Kaikki"-linkkiä varten). */
export function ageGroupIdFor(age: number): string {
  return age <= 3 ? 'ika-pienet' : age <= 5 ? 'ika-leikki' : 'ika-isommat';
}

/** Onko joulun aika? Joulusadut nostetaan etusivulle 1.11.–6.1. */
export function isChristmasSeason(date = new Date()): boolean {
  const m = date.getMonth(); // 0 = tammikuu
  return m === 10 || m === 11 || (m === 0 && date.getDate() <= 6);
}

/** Tervehdys kellonajan mukaan, esim. "Hyvää iltaa, Eetu". */
export function greeting(name: string, date = new Date()): { text: string; emoji: string } {
  const h = date.getHours();
  const base =
    h < 5 ? { text: 'Hyvää yötä', emoji: '🌙' }
    : h < 10 ? { text: 'Hyvää huomenta', emoji: '🌤️' }
    : h < 17 ? { text: 'Hyvää päivää', emoji: '☀️' }
    : h < 21 ? { text: 'Hyvää iltaa', emoji: '🌆' }
    : { text: 'Hyvää yötä', emoji: '🌙' };
  return { text: name ? `${base.text}, ${name}` : base.text, emoji: base.emoji };
}
