// Laskee jokaiselle seuralle competition.same_or_higher_tier_within_30km
// koordinaateista. Ottaa huomioon myös Primeira Ligan seurat (data/primeira.json),
// jotka eivät ole clubs.json-datassa. Seurat ilman koordinaatteja jätetään
// laskematta (computed jää false ja UI näyttää "ei tietoa").
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const clubsFile = join(root, 'data', 'clubs.json')
const primeiraFile = join(root, 'data', 'primeira.json')

const clubs = JSON.parse(readFileSync(clubsFile, 'utf8'))
const primeira = existsSync(primeiraFile) ? JSON.parse(readFileSync(primeiraFile, 'utf8')) : []

const RADIUS_KM = 30

function haversineKm(a, b) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

// Kilpailijakandidaatit: kaikki datan seurat + Primeira Liga (tier 1)
const candidates = [
  ...clubs
    .filter((c) => c.coords?.lat != null)
    .map((c) => ({ name: c.name, tier: c.tier, coords: c.coords })),
  ...primeira
    .filter((c) => c.coords?.lat != null)
    .map((c) => ({ name: `${c.name} (Liga Portugal)`, tier: 1, coords: c.coords })),
]

let computed = 0
let skipped = 0
for (const club of clubs) {
  if (club.coords?.lat == null) {
    skipped++
    continue
  }
  const rivals = candidates
    .filter(
      (r) =>
        r.tier <= club.tier &&
        !(r.name === club.name) &&
        haversineKm(club.coords, r.coords) <= RADIUS_KM,
    )
    .map((r) => (r.tier < club.tier ? `${r.name} [taso ${r.tier}]` : r.name))
  club.competition = {
    ...club.competition,
    same_or_higher_tier_within_30km: rivals,
    computed: true,
  }
  computed++
}

writeFileSync(clubsFile, JSON.stringify(clubs, null, 2) + '\n')
console.log(`Kilpailutilanne laskettu ${computed} seuralle (${skipped} ilman koordinaatteja, primeira-seuroja mukana ${primeira.length}).`)
