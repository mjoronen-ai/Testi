// Kuvaajien värit. Kategorinen järjestys on kiinteä (ei koskaan kierrätetä):
// väri seuraa sarjaa, ei sen sijoitusta, joten suodatus ei maalaa jäljelle jääviä uudelleen.
// Arvot validoitu vaaleaa pintaa vasten (ks. README, dataviz-menetelmä).

export const SURFACE = '#ffffff'
export const GRID = '#e5e7eb'
export const AXIS_TEXT = '#52525b'

// Yhden mittarin (suuruus) kuvaajat käyttävät yhtä sinistä sävyä.
export const SEQUENTIAL = '#2a78d6'
export const SEQUENTIAL_SOFT = '#9ec5f4'
export const MUTED = '#cbd5e1'

export const CATEGORICAL = [
  '#2a78d6', // sininen
  '#eb6834', // oranssi
  '#1baf7a', // turkoosi
  '#eda100', // keltainen
  '#e87ba4', // magenta
  '#008300', // vihreä
  '#4a3aa7', // violetti
  '#e34948', // punainen
]

export const OTHER_COLOR = '#94a3b8'
export const OTHER_LABEL = 'Muut'

/**
 * Pylvään sisään sijoitetun arvon väri: valkoinen tummalla täytöllä, muste vaalealla.
 * Vaaleat sävyt (keltainen, turkoosi, magenta) eivät kanna valkoista tekstiä.
 */
export function inkOn(color) {
  const hex = String(color).replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  return luminance > 0.35 ? '#1f2937' : '#ffffff'
}

/**
 * Kiinteä väri per avain. Yli kahdeksan avaimen jälkeen loput saavat neutraalin
 * "Muut"-värin — uusia sävyjä ei generoida (ne eivät erotu värinäkörajoitteiselle).
 */
export function colorScale(keys) {
  const map = new Map()
  keys.forEach((key, i) => {
    map.set(key, i < CATEGORICAL.length ? CATEGORICAL[i] : OTHER_COLOR)
  })
  return (key) => map.get(key) ?? OTHER_COLOR
}
