/**
 * Sadun tietomalli.
 *
 * Tätä samaa mallia käyttävät sekä sovellus että tuontityökalu
 * (scripts/import-stories.ts), joten kentät pysyvät aina samoina.
 */

/** Kategoriat, jotka kirjoitetaan satutiedostoon. */
export const CATEGORY_IDS = [
  'elainsadut',
  'kansansadut',
  'suomalaiset',
  'iltasadut',
  'seikkailusadut',
  'joulusadut',
  'vuodenajat',
] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

/** Lisenssit, jotka tuontityökalu hyväksyy. Kaikki sallivat käytön sovelluksessa. */
export const ALLOWED_LICENSES = ['CC0 1.0', 'Public domain', 'CC BY 4.0', 'CC BY-SA 4.0', 'Oma teos'] as const;

export interface Story {
  /** Yksilöivä tunniste, esim. "kettu-ja-kurki". Tulee tiedostonimestä. */
  id: string;
  /** Sadun nimi. */
  title: string;
  /** Koko teksti. Kappaleet on erotettu tyhjällä rivillä ("\n\n"). */
  text: string;
  /** Kategoriat. Satu voi kuulua useaan kategoriaan. */
  categories: CategoryId[];
  /** Ikäsuositus: pienin suositeltu ikä vuosina (3 tarkoittaa "3+"). */
  ageMin: number;
  /** Arvioitu ääneen lukemisen aika minuutteina. Tuontityökalu laskee tämän. */
  readingMinutes: number;
  /** Hakusanat, joilla satu löytyy haussa. */
  keywords: string[];
  /** Mistä satu on peräisin, esim. "Kansansatu, uudelleen kirjoitettu". */
  source: string;
  /** Kuka tekstin on kirjoittanut tai kääntänyt. */
  author: string;
  /** Lisenssi, esim. "CC0 1.0". */
  license: string;
  /** Kortin taustaväri (vapaaehtoinen), esim. "#F6C9A8". */
  color?: string;
  /** Kortin kuvana näytettävä emoji (vapaaehtoinen), esim. "🦊". */
  emoji?: string;

  // --- Jatkokertomukset (vapaaehtoiset kentät) ---
  /** Jatkokertomuksen tunniste, sama kaikilla saman tarinan luvuilla, esim. "tahtilaiva-aalto". */
  series?: string;
  /** Jatkokertomuksen nimi, esim. "Tähtilaiva Aallon matka". */
  seriesTitle?: string;
  /** Luvun numero (1, 2, 3…). */
  chapter?: number;
}
