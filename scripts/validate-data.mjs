// Kevyt validointi data/clubs.json-tiedostolle: pakolliset kentät, enum-arvot,
// tyypit, duplikaatti-id:t ja lähdevaatimus ei-triviaaleille kentille.
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const clubs = JSON.parse(readFileSync(join(root, 'data', 'clubs.json'), 'utf8'))

const errors = []
const warnings = []
const ids = new Set()

const SALE = ['for_sale', 'seeking_investors', 'recently_sold', 'not_for_sale', 'unknown']
const OWNER = ['club', 'municipality', 'association', 'other', 'unknown']
const STRUCT = ['SAD', 'clube', 'unknown']
const CONF = ['high', 'medium', 'low']

for (const c of clubs) {
  const where = c.id ?? c.name ?? '???'
  if (!c.id || !c.name || !c.tier || !c.league) errors.push(`${where}: pakollinen kenttä puuttuu`)
  if (ids.has(c.id)) errors.push(`${where}: duplikaatti-id`)
  ids.add(c.id)
  if (![2, 3, 4].includes(c.tier)) errors.push(`${where}: virheellinen tier ${c.tier}`)
  if (typeof c.acquirable !== 'boolean') errors.push(`${where}: acquirable ei ole boolean`)
  if (!SALE.includes(c.sale?.status)) errors.push(`${where}: virheellinen sale.status`)
  if (!OWNER.includes(c.stadium?.owner)) errors.push(`${where}: virheellinen stadium.owner`)
  if (!STRUCT.includes(c.ownership?.structure)) errors.push(`${where}: virheellinen ownership.structure`)
  if (!CONF.includes(c.confidence)) errors.push(`${where}: virheellinen confidence`)
  if (c.coords && (typeof c.coords.lat !== 'number' || typeof c.coords.lng !== 'number'))
    errors.push(`${where}: virheelliset koordinaatit`)
  if (c.coords && (c.coords.lat < 32 || c.coords.lat > 43 || c.coords.lng < -32 || c.coords.lng > -6))
    errors.push(`${where}: koordinaatit Portugalin (ml. saaret) ulkopuolella`)

  // Ei-triviaali luku ilman lähdettä -> varoitus
  const sourceFields = new Set((c.sources ?? []).map((s) => s.field))
  const needsSource = [
    ['stadium.capacity', c.stadium?.capacity],
    ['city_population', c.city_population],
    ['attendance', c.attendance?.average],
    ['academy.fpf_certification', c.academy?.fpf_certification],
  ]
  for (const [field, value] of needsSource) {
    if (value != null && !sourceFields.has(field) && !sourceFields.has(field.split('.')[0]))
      warnings.push(`${where}: ${field}=${value} ilman lähdeviitettä (sources[].field)`)
  }
  if (['for_sale', 'seeking_investors', 'recently_sold'].includes(c.sale?.status) && (c.sale?.sources ?? []).length === 0)
    warnings.push(`${where}: sale.status=${c.sale.status} ilman sale.sources-lähdettä`)
}

console.log(`${clubs.length} seuraa tarkistettu.`)
if (errors.length) {
  console.error(`\nVIRHEET (${errors.length}):`)
  for (const e of errors) console.error('  - ' + e)
}
if (warnings.length) {
  console.warn(`\nVaroitukset (${warnings.length}):`)
  for (const w of warnings) console.warn('  - ' + w)
}
if (!errors.length && !warnings.length) console.log('Ei virheitä eikä varoituksia.')
process.exit(errors.length ? 1 : 0)
