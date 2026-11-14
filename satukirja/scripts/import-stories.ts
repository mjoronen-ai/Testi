/**
 * TUONTITYÖKALU: kokoaa sadut content/-kansiosta sovellukseen.
 *
 * Käyttö:   npm run import-stories
 *
 * Mitä se tekee:
 *  1. Lukee kaikki content/-kansion .md- ja .json-tiedostot.
 *  2. Tarkistaa, että jokaisessa sadussa on pakolliset tiedot
 *     (erityisesti lähde, tekijä ja lisenssi).
 *  3. Laskee arvioidun lukuajan sanamäärästä.
 *  4. Kirjoittaa kaiken tiedostoon src/data/stories.generated.json,
 *     jonka sovellus lukee.
 *
 * Markdown-tiedoston muoto (esim. content/kettu-ja-kurki.md):
 *
 *   ---
 *   title: Kettu ja kurki
 *   categories: [elainsadut, kansansadut]   (myös: suomalaiset, iltasadut, seikkailusadut, joulusadut)
 *   ageMin: 4
 *   keywords: [kettu, kurki, ystävyys]
 *   source: Kansansatu, teksti kirjoitettu tätä sovellusta varten
 *   author: Satukirjan tekijät
 *   license: CC0 1.0
 *   emoji: 🦊            (vapaaehtoinen)
 *   color: "#F6C9A8"     (vapaaehtoinen)
 *   readingMinutes: 4    (vapaaehtoinen, muuten lasketaan automaattisesti)
 *   ---
 *
 * Jatkokertomuksen luvussa on lisäksi:
 *   series: tahtilaiva-aalto              (sama kaikissa luvuissa)
 *   seriesTitle: Tähtilaiva Aallon matka  (sama kaikissa luvuissa)
 *   chapter: 1
 *   Olipa kerran...
 *
 *   Uusi kappale alkaa tyhjän rivin jälkeen.
 *
 * JSON-tiedostossa voi olla yksi satu tai lista satuja samoilla kentillä
 * (teksti kentässä "text"). Jos "id" puuttuu, se tehdään tiedostonimestä.
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { ALLOWED_LICENSES, CATEGORY_IDS, type CategoryId, type Story } from '../src/types/story';

const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const OUTPUT_FILE = path.join(ROOT, 'src', 'data', 'stories.generated.json');

/** Lapselle ääneen luettaessa noin 80 sanaa minuutissa (suomen sanat ovat pitkiä, ja iltasatu luetaan rauhassa). */
const WORDS_PER_MINUTE = 80;

type RawStory = Record<string, unknown>;

const errors: string[] = [];
const warnings: string[] = [];

/** Muuttaa tiedostonimen tunnisteeksi: "Kettu ja kurki.md" → "kettu-ja-kurki". */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/å/g, 'a')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
  if (typeof v === 'string') return v.split(',').map((x) => x.trim()).filter(Boolean);
  return [];
}

/** Tarkistaa yhden sadun ja palauttaa valmiin Story-olion, tai null jos tiedoissa on virhe. */
function validate(raw: RawStory, fileName: string, fallbackId: string): Story | null {
  const where = `${fileName}${raw.title ? ` (${raw.title})` : ''}`;
  const problems: string[] = [];

  const str = (key: string): string => {
    const v = raw[key];
    if (typeof v !== 'string' || v.trim() === '') {
      problems.push(`kenttä "${key}" puuttuu tai on tyhjä`);
      return '';
    }
    return v.trim();
  };

  const title = str('title');
  const text = str('text').replace(/\r\n/g, '\n');
  const source = str('source');
  const author = str('author');
  const license = str('license');

  if (license && !(ALLOWED_LICENSES as readonly string[]).includes(license)) {
    problems.push(`lisenssi "${license}" ei ole sallittu. Sallitut: ${ALLOWED_LICENSES.join(', ')}`);
  }

  const categories = asStringArray(raw.categories);
  if (categories.length === 0) problems.push('kenttä "categories" puuttuu');
  for (const c of categories) {
    if (!(CATEGORY_IDS as readonly string[]).includes(c)) {
      problems.push(`tuntematon kategoria "${c}". Sallitut: ${CATEGORY_IDS.join(', ')}`);
    }
  }

  const ageMin = Number(raw.ageMin);
  if (!Number.isInteger(ageMin) || ageMin < 0 || ageMin > 15) {
    problems.push('kenttä "ageMin" pitää olla kokonaisluku 0–15 (esim. 4)');
  }

  const keywords = asStringArray(raw.keywords);
  if (keywords.length === 0) warnings.push(`${where}: ei hakusanoja (keywords). Satu löytyy silti nimellä.`);

  const id = typeof raw.id === 'string' && raw.id ? slugify(raw.id) : fallbackId;

  if (problems.length > 0) {
    errors.push(`${where}:\n   - ${problems.join('\n   - ')}`);
    return null;
  }

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const computedMinutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
  const readingMinutes = Number(raw.readingMinutes) > 0 ? Number(raw.readingMinutes) : computedMinutes;

  const story: Story = {
    id,
    title,
    text,
    categories: categories as CategoryId[],
    ageMin,
    readingMinutes,
    keywords,
    source,
    author,
    license,
  };
  if (raw.series !== undefined) {
    const chapter = Number(raw.chapter);
    if (typeof raw.series !== 'string' || typeof raw.seriesTitle !== 'string' || !Number.isInteger(chapter) || chapter < 1) {
      errors.push(`${where}: jatkokertomuksessa pitää olla series (teksti), seriesTitle (teksti) ja chapter (1, 2, 3…)`);
      return null;
    }
    story.series = slugify(raw.series);
    story.seriesTitle = raw.seriesTitle.trim();
    story.chapter = chapter;
  }
  if (typeof raw.color === 'string') story.color = raw.color;
  if (typeof raw.emoji === 'string') story.emoji = raw.emoji;
  return story;
}

function readMarkdown(file: string): RawStory[] {
  const parsed = matter(fs.readFileSync(file, 'utf8'));
  return [{ ...parsed.data, text: parsed.content.trim() }];
}

function readJson(file: string): RawStory[] {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  return Array.isArray(data) ? data : [data];
}

function main() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`Kansiota ${CONTENT_DIR} ei löydy.`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => /\.(md|json)$/i.test(f) && !f.startsWith('_'))
    .sort();

  const stories: Story[] = [];
  for (const f of files) {
    const full = path.join(CONTENT_DIR, f);
    let raws: RawStory[];
    try {
      raws = f.toLowerCase().endsWith('.md') ? readMarkdown(full) : readJson(full);
    } catch (e) {
      errors.push(`${f}: tiedostoa ei voitu lukea (${(e as Error).message})`);
      continue;
    }
    const baseId = slugify(path.basename(f, path.extname(f)));
    raws.forEach((raw, i) => {
      const fallbackId = raws.length > 1 ? `${baseId}-${i + 1}` : baseId;
      const s = validate(raw, f, fallbackId);
      if (s) stories.push(s);
    });
  }

  // Sama id kahdesti aiheuttaisi sekaannusta.
  const seen = new Set<string>();
  for (const s of stories) {
    if (seen.has(s.id)) errors.push(`Sama id "${s.id}" löytyy useammasta sadusta. Nimeä toinen tiedosto uudelleen.`);
    seen.add(s.id);
  }

  // Jatkokertomusten luvut: numerot 1..n ilman aukkoja tai tuplia.
  const seriesMap = new Map<string, number[]>();
  for (const s of stories) if (s.series) seriesMap.set(s.series, [...(seriesMap.get(s.series) ?? []), s.chapter!]);
  for (const [sid, chapters] of seriesMap) {
    const sorted = [...chapters].sort((a, b) => a - b);
    if (sorted.some((c, i) => c !== i + 1)) errors.push(`Jatkokertomuksen "${sid}" luvut eivät ole 1..${sorted.length}: ${sorted.join(', ')}`);
  }

  warnings.forEach((w) => console.warn(`⚠️  ${w}`));

  if (errors.length > 0) {
    console.error(`\n❌ Tuonti keskeytyi, korjaa nämä virheet:\n`);
    errors.forEach((e) => console.error(` • ${e}`));
    process.exit(1);
  }

  // Aakkosjärjestys; saman jatkokertomuksen luvut pysyvät numerojärjestyksessä.
  stories.sort((a, b) =>
    a.series && a.series === b.series
      ? a.chapter! - b.chapter!
      : (a.seriesTitle ?? a.title).localeCompare(b.seriesTitle ?? b.title, 'fi'),
  );
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(stories, null, 2) + '\n', 'utf8');

  console.log(`\n✅ Tuotiin ${stories.length} satua → ${path.relative(ROOT, OUTPUT_FILE)}\n`);
  for (const s of stories) {
    console.log(`   ${s.emoji ?? '📖'}  ${s.title}  ·  ${s.ageMin}+ v  ·  ~${s.readingMinutes} min  ·  ${s.license}`);
  }
}

main();
