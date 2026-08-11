// Yhdistää tutkimustulokset data/clubs.json-tiedostoon.
// Käyttö: node scripts/merge-research.mjs <tulostiedosto.json> [...lisää]
// Tulostiedosto: JSON-taulukko osittaisia seuraobjekteja, joissa vähintään "id".
// Syväyhdistys: objektit yhdistetään kenttä kerrallaan, taulukot korvataan,
// null EI ylikirjoita olemassa olevaa ei-null-arvoa (tutkittua tietoa ei hävitetä),
// paitsi jos kentälle annetaan eksplisiittisesti uusi ei-null-arvo.
// Poikkeus: lähdelistat (sources, sale.sources, academy.notable_products)
// yhdistetään ja deduplikoidaan, koska useampi tutkimusagentti täydentää samaa
// seuraa eri kentistä — korvaaminen hävittäisi aiemmat lähdeviitteet.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const clubsFile = join(root, 'data', 'clubs.json')

function isObj(x) {
  return x && typeof x === 'object' && !Array.isArray(x)
}

// Listat, jotka yhdistetään korvaamisen sijaan (avainpolku juuresta)
const APPEND_LISTS = new Set(['sources', 'sale.sources', 'academy.notable_products'])

function mergeList(a = [], b = []) {
  const seen = new Set()
  const out = []
  for (const item of [...a, ...b]) {
    const key = isObj(item) ? `${item.field ?? ''}|${item.url ?? ''}` : String(item)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(item)
  }
  return out
}

function deepMerge(base, patch, path = '') {
  if (!isObj(base) || !isObj(patch)) return patch === null || patch === undefined ? base : patch
  const out = { ...base }
  for (const [k, v] of Object.entries(patch)) {
    if (v === null || v === undefined) continue // null ei ylikirjoita
    const keyPath = path ? `${path}.${k}` : k
    if (Array.isArray(v) && APPEND_LISTS.has(keyPath)) out[k] = mergeList(base[k], v)
    else if (isObj(v) && isObj(base[k])) out[k] = deepMerge(base[k], v, keyPath)
    else out[k] = v
  }
  return out
}

const files = process.argv.slice(2)
if (!files.length) {
  console.error('Käyttö: node scripts/merge-research.mjs <tulostiedosto.json> [...]')
  process.exit(1)
}

const clubs = JSON.parse(readFileSync(clubsFile, 'utf8'))
const byId = new Map(clubs.map((c) => [c.id, c]))
let merged = 0
let unknown = 0

for (const file of files) {
  const patches = JSON.parse(readFileSync(file, 'utf8'))
  for (const patch of Array.isArray(patches) ? patches : [patches]) {
    const target = byId.get(patch.id)
    if (!target) {
      console.warn(`  ! tuntematon id ohitettu: ${patch.id}`)
      unknown++
      continue
    }
    byId.set(patch.id, deepMerge(target, patch, ""))
    merged++
  }
}

writeFileSync(clubsFile, JSON.stringify([...byId.values()], null, 2) + '\n')
console.log(`Yhdistetty ${merged} seuraa (${unknown} tuntematonta id:tä ohitettu).`)
