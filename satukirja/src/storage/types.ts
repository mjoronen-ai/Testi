/** Muoto, jossa tallennetut tiedot palautetaan tietokannasta. */
export interface StoredData {
  /** Suosikkisatujen id:t, uusin ensin. */
  favorites: string[];
  /** Lukukohta sadun id:n mukaan. ratio: 0 = alku, 1 = loppu. */
  progress: Record<string, { ratio: number; updatedAt: number }>;
  /** Loppuun luetut sadut (= ansaitut tarrat): montako kertaa ja milloin ensimmäisen kerran. */
  completed: Record<string, { count: number; firstAt: number }>;
  /** Asetukset tekstinä, esim. { fontSize: "22", themeMode: "auto", childName: "Eetu" }. */
  settings: Record<string, string>;
}
