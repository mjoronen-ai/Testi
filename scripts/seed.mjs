// Luo data/clubs.json -rungon sarjakokoonpanoista.
// Ei ylikirjoita olemassa olevia seuratietoja: jos data/clubs.json on olemassa,
// skripti lisää vain puuttuvat seurat ja säilyttää aiemmin tutkitut kentät.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dataDir = join(root, 'data')
const outFile = join(dataDir, 'clubs.json')

// Sarjakokoonpanot 2026/27 (vahvistettava lähteistä ennen datan lukitsemista).
// B-joukkueet: acquirable = false.
const LIGA2 = [
  'Académica', 'AFS', 'Amarante FC', 'Benfica B', 'GD Chaves', 'SC Farense',
  'CD Feirense', 'FC Felgueiras 1932', 'Leixões SC', 'Lusitânia de Lourosa FC',
  'FC Penafiel', 'Portimonense SC', 'FC Porto B', 'Sporting CP B', 'CD Tondela',
  'SCU Torreense', 'União de Leiria', 'FC Vizela',
]

const LIGA3_A = [
  'AD Marco 09', 'Vitória de Guimarães B', 'FC Paços de Ferreira', 'Leça FC',
  'Varzim SC', 'AD Fafe', 'SC Vianense', 'CD Trofense', 'SC São João de Ver',
  'USC Paredes',
]

const LIGA3_B = [
  'CF Os Belenenses', 'Atlético CP', 'Caldas SC', 'CD Mafra', 'Louletano DC',
  'Sporting da Covilhã', 'UD Santarém', 'UD Oliveirense', 'GD Vitória de Sernache',
  'Lusitano GC',
]

// Campeonato de Portugal (taso 4) lisätään vaiheessa 2, kun lohkojaot on
// vahvistettu FPF:n/Wikipedian lähteistä (ks. data/cdp-groups.json kun se on luotu).

const B_TEAM = /( B)$|(^B-)/

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function emptyClub(name, tier, league, series) {
  return {
    id: slugify(name),
    name,
    tier,
    league,
    series,
    city: null,
    district: null,
    founded: null,
    acquirable: !B_TEAM.test(name),
    coastal: null,
    coast_distance_km: null,
    city_population: null,
    city_population_kind: null,
    nearest_major_city: null,
    coords: null,
    stadium: { name: null, capacity: null, owner: 'unknown', notes: '' },
    attendance: { season: '2025-26', average: null, source: '' },
    academy: { exists: null, fpf_certification: null, notes: '', notable_products: [] },
    competition: { same_or_higher_tier_within_30km: [], notes: '' },
    ownership: { structure: 'unknown', owners: '', foreign_investor: null, debt_or_insolvency_notes: '' },
    sale: { status: 'unknown', price_indication_eur: null, notes: '', sources: [] },
    estimated_price_eur: { low: null, high: null, basis: '' },
    investor_score: null,
    sources: [],
    last_updated: null,
    confidence: 'low',
  }
}

const seeds = [
  ...LIGA2.map((n) => emptyClub(n, 2, 'Liga Portugal 2', null)),
  ...LIGA3_A.map((n) => emptyClub(n, 3, 'Liga 3', 'A')),
  ...LIGA3_B.map((n) => emptyClub(n, 3, 'Liga 3', 'B')),
]

// CdP-lohkot luetaan erillisestä tiedostosta, jos vaihe 2 on tehty.
const cdpFile = join(dataDir, 'cdp-groups.json')
if (existsSync(cdpFile)) {
  const groups = JSON.parse(readFileSync(cdpFile, 'utf8'))
  for (const [serie, clubs] of Object.entries(groups.series ?? {})) {
    for (const n of clubs) seeds.push(emptyClub(n, 4, 'Campeonato de Portugal', serie))
  }
}

mkdirSync(dataDir, { recursive: true })
let existing = []
if (existsSync(outFile)) existing = JSON.parse(readFileSync(outFile, 'utf8'))
const byId = new Map(existing.map((c) => [c.id, c]))
for (const s of seeds) if (!byId.has(s.id)) byId.set(s.id, s)

const merged = [...byId.values()].sort(
  (a, b) => a.tier - b.tier || String(a.series ?? '').localeCompare(String(b.series ?? '')) || a.name.localeCompare(b.name),
)
writeFileSync(outFile, JSON.stringify(merged, null, 2) + '\n')
console.log(`data/clubs.json: ${merged.length} seuraa (${seeds.length} seed-riviä, ${existing.length} aiempaa)`)
