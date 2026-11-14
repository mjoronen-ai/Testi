/**
 * Tarrakirjan tasot. Taso nousee kerättyjen tarrojen (loppuun luettujen satujen) määrän mukaan.
 * Tasoa ei voi menettää.
 */
/** Tasot tarrojen määrän mukaan. */
export const LEVELS = [
  { min: 0, title: 'Satujen alkutaival', emoji: '🌱' },
  { min: 1, title: 'Satujen ystävä', emoji: '🌼' },
  { min: 4, title: 'Tarinankuuntelija', emoji: '🦉' },
  { min: 8, title: 'Satujen tutkija', emoji: '🧭' },
  { min: 12, title: 'Satumestari', emoji: '👑' },
];

export function levelFor(count: number) {
  let current = LEVELS[0];
  for (const l of LEVELS) if (count >= l.min) current = l;
  const next = LEVELS.find((l) => l.min > count);
  return { current, next };
}
