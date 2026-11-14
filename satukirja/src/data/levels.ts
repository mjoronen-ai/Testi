/**
 * Tarrakirjan tasot. Taso nousee kerättyjen tarrojen (loppuun luettujen satujen) määrän mukaan.
 * Tasoa ei voi menettää.
 */
export const LEVELS = [
  { min: 0, title: 'Satujen alkutaival', emoji: '🌱' },
  { min: 1, title: 'Satujen ystävä', emoji: '🌼' },
  { min: 5, title: 'Tarinankuuntelija', emoji: '🦉' },
  { min: 15, title: 'Satujen tutkija', emoji: '🧭' },
  { min: 35, title: 'Satulinnan ritari', emoji: '🏰' },
  { min: 70, title: 'Satumestari', emoji: '👑' },
  { min: 120, title: 'Satukirjan tähti', emoji: '🌟' },
];

export function levelFor(count: number) {
  let current = LEVELS[0];
  for (const l of LEVELS) if (count >= l.min) current = l;
  const next = LEVELS.find((l) => l.min > count);
  return { current, next };
}
