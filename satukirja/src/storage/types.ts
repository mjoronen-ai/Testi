/** Muoto, jossa tallennetut tiedot palautetaan tietokannasta. */
export interface StoredData {
  /** Suosikkisatujen id:t, uusin ensin. */
  favorites: string[];
  /** Lukukohta sadun id:n mukaan. ratio: 0 = alku, 1 = loppu. */
  progress: Record<string, { ratio: number; updatedAt: number }>;
  /** Asetukset tekstinä, esim. { fontSize: "22", nightMode: "1" }. */
  settings: Record<string, string>;
}
