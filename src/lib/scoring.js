// Sijoittajapisteytys 0–100. Lasketaan vain seuroille, joilla acquirable: true.
// Puuttuva data ei nollaa pistettä hiljaisesti: osapiste on null ("ei dataa")
// ja kokonaispiste normalisoidaan saatavilla olevien osien painoilla.

export const DEFAULT_WEIGHTS = {
  academy: 30,
  market: 25,
  stadium: 20,
  competition: 15,
  acquirability: 10,
}

export const WEIGHT_LABELS = {
  academy: 'Akatemia & pelaajatuotanto',
  market: 'Markkina',
  stadium: 'Stadion',
  competition: 'Kilpailutilanne',
  acquirability: 'Ostettavuus',
}

const clamp01 = (x) => Math.max(0, Math.min(1, x))

// Painotettu keskiarvo signaaleista, joista osa voi puuttua (null).
// Palauttaa null jos yhtään signaalia ei ole.
function weightedAvailable(signals) {
  let sum = 0
  let wsum = 0
  for (const { value, weight } of signals) {
    if (value === null || value === undefined || Number.isNaN(value)) continue
    sum += value * weight
    wsum += weight
  }
  return wsum > 0 ? sum / wsum : null
}

export function academyScore(club) {
  const a = club.academy ?? {}
  let cert = null
  if (a.fpf_certification !== null && a.fpf_certification !== undefined) {
    const n = Number(a.fpf_certification)
    cert = Number.isFinite(n) ? clamp01(n / 5) : 0.5
  }
  const exists = a.exists === null || a.exists === undefined ? null : a.exists ? 0.7 : 0
  const products = (a.notable_products ?? []).length > 0 ? clamp01(a.notable_products.length / 4) : null
  return weightedAvailable([
    { value: cert, weight: 0.6 },
    { value: exists, weight: 0.15 },
    { value: products, weight: 0.25 },
  ])
}

export function marketScore(club) {
  const pop = club.city_population
  const popV = pop ? clamp01((Math.log10(pop) - 3.2) / 2.1) : null
  const att = club.attendance?.average
  const attV = att ? clamp01((Math.log10(att) - 1.9) / 1.8) : null
  const d = club.nearest_major_city?.distance_km
  const proxV = d === null || d === undefined ? null : clamp01(1 - d / 130)
  return weightedAvailable([
    { value: popV, weight: 0.4 },
    { value: attV, weight: 0.4 },
    { value: proxV, weight: 0.2 },
  ])
}

const OWNER_VALUE = { club: 1, municipality: 0.55, association: 0.35, other: 0.5 }

export function stadiumScore(club) {
  const s = club.stadium ?? {}
  const capV = s.capacity ? clamp01((Math.log10(s.capacity) - 2.6) / 1.55) : null
  const ownV = s.owner && s.owner !== 'unknown' ? (OWNER_VALUE[s.owner] ?? 0.5) : null
  return weightedAvailable([
    { value: capV, weight: 0.6 },
    { value: ownV, weight: 0.4 },
  ])
}

export function competitionScore(club) {
  const c = club.competition ?? {}
  if (!c.computed) return null
  const n = (c.same_or_higher_tier_within_30km ?? []).length
  return clamp01(1 - n * 0.16)
}

export function acquirabilityScore(club) {
  const o = club.ownership ?? {}
  const s = club.sale ?? {}
  const structV = o.structure === 'SAD' ? 0.85 : o.structure === 'clube' ? 0.45 : null
  const SALE_VALUE = { for_sale: 1, seeking_investors: 0.95, recently_sold: 0.15, not_for_sale: 0.05 }
  const saleV = s.status && s.status !== 'unknown' ? SALE_VALUE[s.status] : null
  let base = weightedAvailable([
    { value: structV, weight: 0.5 },
    { value: saleV, weight: 0.5 },
  ])
  if (base !== null && (o.debt_or_insolvency_notes ?? '').trim() !== '') base *= 0.5
  return base
}

export const COMPONENTS = {
  academy: academyScore,
  market: marketScore,
  stadium: stadiumScore,
  competition: competitionScore,
  acquirability: acquirabilityScore,
}

// Palauttaa { total, coverage, parts } — total on 0–100 tai null,
// coverage on käytettävissä olleiden painojen osuus (0–1),
// parts[key] = { score: 0–1 | null, weight }.
export function investorScore(club, weights = DEFAULT_WEIGHTS) {
  if (!club.acquirable) return { total: null, coverage: 0, parts: {} }
  const parts = {}
  let sum = 0
  let wsum = 0
  let wtotal = 0
  for (const [key, fn] of Object.entries(COMPONENTS)) {
    const w = Number(weights[key]) || 0
    const score = fn(club)
    parts[key] = { score, weight: w }
    wtotal += w
    if (score !== null) {
      sum += score * w
      wsum += w
    }
  }
  if (wsum === 0 || wtotal === 0) return { total: null, coverage: 0, parts }
  return {
    total: Math.round((sum / wsum) * 100),
    coverage: wsum / wtotal,
    parts,
  }
}
