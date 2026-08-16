// Sarakkeiden automaattinen tunnistus. Otsikot voivat olla suomeksi, englanniksi
// tai ruotsiksi/espanjaksi — tunnistus on aina vain ehdotus, jonka käyttäjä voi ohittaa.

import { looksNumeric, looksPlainNumeric, parseNumber } from './numbers.js'

export const FIELDS = [
  { key: 'player', label: 'Pelaaja', required: false },
  { key: 'team', label: 'Joukkue', required: true },
  { key: 'league', label: 'Sarja', required: false },
  { key: 'salary', label: 'Palkka', required: true },
  { key: 'currency', label: 'Valuutta', required: false },
  { key: 'period', label: 'Palkkajakso', required: false },
  { key: 'position', label: 'Pelipaikka', required: false },
  { key: 'nationality', label: 'Kansallisuus', required: false },
  { key: 'age', label: 'Ikä', required: false },
  { key: 'season', label: 'Kausi', required: false },
  { key: 'contract_end', label: 'Sopimus päättyy', required: false },
]

export const FIELD_LABELS = Object.fromEntries(FIELDS.map((f) => [f.key, f.label]))

const ALIASES = {
  player: [
    'pelaaja', 'pelaajan nimi', 'nimi', 'player', 'player name', 'name', 'full name',
    'spelare', 'jugador', 'nome', 'nome jogador', 'jogador', 'sukunimi etunimi',
  ],
  team: [
    'joukkue', 'seura', 'klubi', 'team', 'club', 'team name', 'club name', 'lag',
    'equipo', 'clube', 'squad',
  ],
  league: [
    'sarja', 'sarjataso', 'liiga', 'divisioona', 'league', 'division', 'competition',
    'comp', 'kilpailu', 'liga', 'serie', 'tier',
  ],
  salary: [
    'palkka', 'palkka eur', 'vuosipalkka', 'kuukausipalkka', 'viikkopalkka', 'bruttopalkka',
    'nettopalkka', 'palkkakulu', 'salary', 'annual salary', 'gross salary', 'net salary',
    'wage', 'wages', 'weekly wage', 'weekly salary', 'yearly salary', 'pay', 'earnings',
    'compensation', 'lön', 'lon', 'manadslon', 'månadslön', 'årslön', 'veckolön',
    'salario', 'salario anual', 'ansiot',
  ],
  currency: ['valuutta', 'currency', 'cur', 'ccy', 'valuta', 'moneda'],
  period: [
    'palkkajakso', 'jakso', 'maksujakso', 'maksuvali', 'maksuväli', 'period', 'frequency',
    'freq', 'interval', 'palkkakausi',
  ],
  position: ['pelipaikka', 'paikka', 'asema', 'rooli', 'position', 'pos', 'role', 'posicion'],
  nationality: ['kansallisuus', 'maa', 'kotimaa', 'nationality', 'country', 'nat', 'nationalitet'],
  age: ['ika', 'ikä', 'age', 'alder', 'ålder', 'edad'],
  season: ['kausi', 'season', 'vuosi', 'year', 'sasong', 'säsong', 'temporada'],
  contract_end: [
    'sopimus paattyy', 'sopimus päättyy', 'sopimuksen paattyminen', 'sopimus', 'contract',
    'contract end', 'contract until', 'contract expiry', 'expires', 'kontrakt',
  ],
}

/** Otsikon normalisointi vertailua varten: pienet kirjaimet, välimerkit väleiksi. */
export function normalizeHeader(header) {
  return String(header ?? '')
    .toLowerCase()
    .replace(/[_\-.\/\\()[\]]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function scoreHeader(header, field) {
  const norm = normalizeHeader(header)
  if (norm === '') return 0
  let best = 0
  for (const alias of ALIASES[field] ?? []) {
    if (norm === alias) best = Math.max(best, 100)
    else if (norm.startsWith(`${alias} `) || norm.endsWith(` ${alias}`)) best = Math.max(best, 70)
    // Osumaa keskeltä sanaa haetaan vain pitkille aliaksille: lyhyt "lön" osuisi
    // muuten sanaan "kolonna" ja "pos" sanaan "postinumero".
    else if (alias.length >= 5 && norm.includes(alias)) best = Math.max(best, 45 + alias.length)
  }
  return best
}

export const PERIODS = [
  { key: 'year', label: 'Vuosi / kausi', factor: 1 },
  { key: 'month', label: 'Kuukausi', factor: 12 },
  { key: 'week', label: 'Viikko', factor: 52 },
  { key: 'day', label: 'Päivä', factor: 365 },
]

export const PERIOD_FACTORS = Object.fromEntries(PERIODS.map((p) => [p.key, p.factor]))
export const PERIOD_LABELS = Object.fromEntries(PERIODS.map((p) => [p.key, p.label]))

/** Tunnistaa palkkajakson vapaasta tekstistä (otsikosta tai solusta). */
export function detectPeriod(text) {
  const norm = normalizeHeader(text)
  if (!norm) return null
  // Tarkistetaan myös ilman tarkkeita, jotta "Månadslön" ja "Vecka" osuvat.
  const folded = norm.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const has = (pattern) => pattern.test(norm) || pattern.test(folded)

  // Lyhenteet vaativat sanarajan: "Vuosipalkka" ei ole kuukausipalkka, vaikka
  // sanan keskellä on kk-kirjainpari.
  if (has(/(viikko|weekly|week|veck|\bvko\b)/)) return 'week'
  if (has(/(kuukausi|monthly|month|mensual|manad|manedlig|\bkk\b)/)) return 'month'
  if (has(/(paiva|daily|\bday\b)/)) return 'day'
  if (has(/(vuosi|vuotuinen|annual|yearly|year|arslon|kausi|season)/)) return 'year'
  return null
}

/**
 * Ehdottaa sarakekartan otsikoiden ja näytedatan perusteella.
 * Yksi sarake voi vastata vain yhtä kenttää (paras pistemäärä voittaa).
 */
export function detectMapping(headers, rows = []) {
  const candidates = []
  for (const field of Object.keys(ALIASES)) {
    headers.forEach((header, index) => {
      const score = scoreHeader(header, field)
      if (score > 0) candidates.push({ field, index, score })
    })
  }
  candidates.sort((a, b) => b.score - a.score)

  const mapping = {}
  const usedColumns = new Set()
  for (const c of candidates) {
    if (mapping[c.field] !== undefined || usedColumns.has(c.index)) continue
    mapping[c.field] = c.index
    usedColumns.add(c.index)
  }

  const columnValues = (index) => rows.map((r) => r[index])

  // Palkkasarake on pakollinen: jos otsikosta ei löytynyt, otetaan numeerisista
  // sarakkeista se, jonka arvot ovat suurimpia (palkat ovat isompia kuin ikä tai numero).
  if (mapping.salary === undefined) {
    let best = null
    headers.forEach((_, index) => {
      if (usedColumns.has(index)) return
      const values = columnValues(index)
      if (!looksNumeric(values)) return
      const nums = values.map(parseNumber).filter((n) => n !== null)
      if (nums.length === 0) return
      const mean = nums.reduce((a, b) => a + b, 0) / nums.length
      if (mean > 1000 && (best === null || mean > best.mean)) best = { index, mean }
    })
    if (best) {
      mapping.salary = best.index
      usedColumns.add(best.index)
    }
  }

  // Joukkue on pakollinen: jos ei löytynyt, otetaan tekstisarake, jossa on
  // järkevä määrä toistuvia arvoja (joukkueita on vähemmän kuin pelaajia).
  if (mapping.team === undefined && rows.length > 0) {
    let best = null
    headers.forEach((_, index) => {
      if (usedColumns.has(index)) return
      const values = columnValues(index).filter((v) => String(v ?? '').trim() !== '')
      if (values.length === 0 || looksPlainNumeric(values)) return
      const unique = new Set(values).size
      const ratio = unique / values.length
      if (ratio < 0.6 && unique > 1 && (best === null || ratio < best.ratio)) {
        best = { index, ratio }
      }
    })
    if (best) {
      mapping.team = best.index
      usedColumns.add(best.index)
    }
  }

  return mapping
}

/** Palkkajakso otsikon perusteella (esim. "Weekly wage" → week). */
export function detectPeriodFromMapping(headers, mapping) {
  if (mapping.salary === undefined) return null
  return detectPeriod(headers[mapping.salary])
}
