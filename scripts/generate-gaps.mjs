// Generoi data/gaps.md suoraan datasta ja tutkimusajojen gap-kirjauksista.
// Käyttö: node scripts/generate-gaps.mjs [tutkimusajon-gaps.json ...]
// Argumenttitiedostot ovat listoja { club_id, field, reason } -objekteja
// (tutkimustyönkulun palauttama gaps-lista). Ilman argumentteja generoi
// pelkän datapohjaisen osuuden.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const clubs = JSON.parse(readFileSync(join(root, 'data', 'clubs.json'), 'utf8'))
const DATE = process.env.GAPS_DATE ?? '2026-08-11'

// Kentät, joiden täyttöastetta seurataan
const FIELDS = [
  ['city', 'Kaupunki', (c) => c.city != null],
  ['founded', 'Perustamisvuosi', (c) => c.founded != null],
  ['city_population', 'Kaupungin väkiluku', (c) => c.city_population != null],
  ['coords', 'Koordinaatit', (c) => c.coords?.lat != null],
  ['coastal', 'Rannikkostatus', (c) => c.coastal != null],
  ['stadium.name', 'Stadionin nimi', (c) => c.stadium?.name != null],
  ['stadium.capacity', 'Stadionin kapasiteetti', (c) => c.stadium?.capacity != null],
  ['stadium.owner', 'Stadionin omistus', (c) => (c.stadium?.owner ?? 'unknown') !== 'unknown'],
  ['attendance.average', 'Yleisökeskiarvo 2025-26', (c) => c.attendance?.average != null],
  ['academy.exists', 'Akatemian olemassaolo', (c) => c.academy?.exists != null],
  ['academy.fpf_certification', 'FPF-sertifiointi', (c) => c.academy?.fpf_certification != null],
  ['ownership.structure', 'Omistusrakenne (SAD/clube)', (c) => (c.ownership?.structure ?? 'unknown') !== 'unknown'],
  ['sale.status', 'Julkinen myyntisignaali', (c) => (c.sale?.status ?? 'unknown') !== 'unknown'],
]

// Kentät, joissa "unknown"/puuttuva on tavallinen ja odotettu lopputulos
const EXPECTED_UNKNOWN = new Set(['sale.status', 'academy.fpf_certification', 'attendance.average'])

const lines = []
const p = (s = '') => lines.push(s)

p('# Puuttuvat ja epävarmat tiedot (gaps)')
p()
p('Generoitu `scripts/generate-gaps.mjs`-skriptillä datasta ja tutkimusajojen')
p('kirjauksista. Sääntö: lukua ei koskaan keksitä — puuttuva tieto on `null`')
p('datassa ja kirjattuna tähän tiedostoon.')
p()
p(`Päivitetty: ${DATE} · ${clubs.length} seuraa`)
p()
p('## Täyttöasteet')
p()
p('| Kenttä | Täytetty | Puuttuu | Huom |')
p('|---|---|---|---|')
for (const [key, label, test] of FIELDS) {
  const n = clubs.filter(test).length
  const missing = clubs.length - n
  const note = EXPECTED_UNKNOWN.has(key)
    ? key === 'sale.status'
      ? '`unknown` on oletus — vain julkinen lähde nostaa statusta'
      : key === 'attendance.average'
        ? 'Transfermarkt estetty ajoympäristössä'
        : 'FPF:n oma lista ei ollut haettavissa'
    : ''
  p(`| ${label} | ${n}/${clubs.length} | ${missing} | ${note} |`)
}
p()

const conf = {}
for (const c of clubs) conf[c.confidence] = (conf[c.confidence] ?? 0) + 1
p(
  `Luotettavuus (confidence): korkea ${conf.high ?? 0}, keskitaso ${conf.medium ?? 0}, matala ${conf.low ?? 0}. ` +
    `Lähdeviitteitä yhteensä ${clubs.reduce((a, c) => a + (c.sources ?? []).length, 0)}.`,
)
p()

p('## Systemaattiset aukot')
p()
p('- **Yleisökeskiarvot** (`attendance.average`): Transfermarkt ja sen varalähteet')
p('  ovat estettyjä ajoympäristön egress-proxyssä (403), eikä yleisödataa saatu')
p('  haettua muualtakaan. Tasoilla 3–4 lukuja ei julkaista systemaattisesti.')
p('  Lukuja ei arvattu. Pisteytyksessä markkinaosuus lasketaan väkiluvun ja')
p('  suurkaupunkietäisyyden varassa, ja datakattavuus näytetään käyttäjälle.')
p('- **FPF Entidades Formadoras -sertifioinnit**: fpf.pt on estetty, joten')
p('  sertifioinnit löytyivät vain seurakohtaisista lähteistä (seurojen omat sivut,')
p('  aluejärjestöjen ja median uutiset). Puuttuva arvo ei tarkoita, ettei seuralla')
p('  olisi sertifiointia.')
p('- **Myyntistatus** (`sale.status`): oletus on `unknown`. Elokuussa 2026')
p('  uutisoitiin noin 29 portugalilaisseuran hakevan sijoittajia (Brands Capital')
p('  Sports), mutta listaukset ovat anonyymejä, joten yksittäisen seuran status jää')
p('  useimmiten tuntemattomaksi.')
p()

p('## Sarjakokoonpanot')
p()
p('- **CdP Série D, avoin paikka ("clube a designar")**: Liga 3:sta pudonneen')
p('  1.º Dezembron (Sintra) osallistuminen oli lohkoarvonnan (25.7.2026) hetkellä')
p('  auki osallistumisedellytysten vuoksi; Sacavenense on vaatinut paikkaa. Paikan')
p('  saajaa ei ollut julkistettu 11.8.2026 mennessä, joten Série D:ssä on datassa')
p('  13 seuraa. Lähteet: record.pt, abola.pt (24.7.2026).')
p('- **GD Fabril (Barreiro)**: tehtävänannossa mainittu tason 4 seurana, mutta ei')
p('  esiinny minkään CdP-lohkon 2026/27-listassa (kaksi riippumatonta hakua).')
p()

p('## Seurat, joilta puuttuu keskeisiä kenttiä')
p()
p('Keskeisiksi lasketaan stadionin kapasiteetti, stadionin omistus, väkiluku ja')
p('omistusrakenne. Yleisökeskiarvo ja FPF-sertifiointi on jätetty pois, koska ne')
p('puuttuvat systemaattisesti (ks. yllä).')
p()
const CORE = [
  ['stadium.capacity', (c) => c.stadium?.capacity != null],
  ['stadium.owner', (c) => (c.stadium?.owner ?? 'unknown') !== 'unknown'],
  ['city_population', (c) => c.city_population != null],
  ['ownership.structure', (c) => (c.ownership?.structure ?? 'unknown') !== 'unknown'],
]
let anyMissing = false
for (const c of clubs) {
  const missing = CORE.filter(([, test]) => !test(c)).map(([k]) => k)
  if (!missing.length) continue
  anyMissing = true
  p(`- **${c.name}** (taso ${c.tier}): puuttuu \`${missing.join('`, `')}\``)
}
if (!anyMissing) p('Ei yhtään seuraa, jolta puuttuisi keskeisiä kenttiä.')
p()

// Tutkimusajojen kirjaamat perustelut, ryhmiteltyinä kentän mukaan
const notes = []
for (const file of process.argv.slice(2)) {
  if (!existsSync(file)) continue
  const rows = JSON.parse(readFileSync(file, 'utf8'))
  for (const r of rows) notes.push(r)
}

if (notes.length) {
  // Jätetään pois rivit, jotka koskevat sittemmin täytettyjä kenttiä tai
  // keskitetysti hoidettua hinta-arviota
  const byId = new Map(clubs.map((c) => [c.id, c]))
  const stillOpen = notes.filter((n) => {
    if (n.club_id === '_pricebasis') return false
    if (n.field.startsWith('estimated_price_eur')) return false
    const c = byId.get(n.club_id)
    if (!c) return false
    const path = n.field.split(' ')[0]
    const val = path.split('.').reduce((o, k) => (o == null ? o : o[k]), c)
    if (path === 'sale.status' || path === 'ownership.structure' || path === 'stadium.owner')
      return val == null || val === 'unknown'
    return val == null || (Array.isArray(val) && val.length === 0)
  })

  p('## Tutkimusajojen kirjaamat perustelut')
  p()
  p(`Alla ${stillOpen.length} kirjausta kentistä, jotka ovat edelleen tyhjiä.`)
  p('Sittemmin täytetyt kentät ja keskitetysti hoidettu hinta-arvio on suodatettu pois.')
  p()
  const grouped = new Map()
  for (const n of stillOpen) {
    const key = n.field.split(' ')[0]
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key).push(n)
  }
  for (const [field, rows] of [...grouped.entries()].sort((a, b) => b[1].length - a[1].length)) {
    p(`### \`${field}\` (${rows.length})`)
    p()
    for (const r of rows) {
      const name = byId.get(r.club_id)?.name ?? r.club_id
      p(`- **${name}**: ${r.reason.replace(/\s+/g, ' ').trim()}`)
    }
    p()
  }
}

p('## Menetelmälliset rajoitteet')
p()
p('- Ajoympäristön egress-proxy estää suorat sivulataukset lähdesivustoille')
p('  (wikipedia.org, zerozero.pt, fpf.pt, transfermarkt, useat pt-uutissivustot).')
p('  Tutkimus nojaa siksi hakukonetulosten sisältöreferaatteihin. URL-lähteet on')
p('  kirjattu, mutta niiden sisältöä ei voitu avata uudelleen verifiointia varten.')
p('- Maantieteelliset kentät (`coords`, `coastal`, `coast_distance_km`,')
p('  `nearest_major_city`) ovat kartta- ja koordinaattipäättelyä, joka on')
p('  tehtävänannossa sallittu menetelmä. Ne eivät ole lähteistettyjä lukuja.')
p('- Kun lähteet olivat ristiriidassa (esim. stadionkapasiteetti), valittu arvo ja')
p('  ristiriita on kirjattu seuran `stadium.notes`-kenttään.')

writeFileSync(join(root, 'data', 'gaps.md'), lines.join('\n') + '\n')
console.log(`data/gaps.md kirjoitettu (${lines.length} riviä, ${notes.length} tutkimuskirjausta luettu).`)
