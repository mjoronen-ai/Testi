// Täyttää estimated_price_eur-kentän sarjatasokohtaisella tyyppihaarukalla niille
// ostettavissa oleville seuroille, joilta ei löytynyt omaa hintaevidenssiä.
// Haarukat perustuvat julkisiin vertailukauppoihin — perusteet ja lähteet:
// data/price-basis.md. Seurakohtaista arviota EI koskaan ylikirjoiteta.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const clubsFile = join(root, 'data', 'clubs.json')

// SAD-enemmistö (70–90 %). Ks. data/price-basis.md "Yhteenveto".
const BANDS = {
  2: {
    low: 5_000_000,
    high: 10_000_000,
    note: 'Vertailukaupat: Tondela 2/2025 (80 % / 8 M€), Alverca 2–3/2025 (~77 % / 8–10 M€), Estrela da Amadora 9/2022 (90 % / 5 M€).',
    url: 'https://omirante.pt/desporto/2025-03-09-craque-do-real-madrid-compra-da-sad-do-alverca-por-oito-milhoes-de-euros-63d05ee1',
  },
  3: {
    low: 1_500_000,
    high: 3_000_000,
    note: 'Vertailukaupat: Trofense/TSC (80 % yht. 3,125 M€, josta osakkeita 1,8 M€), Brands Capital -listaus 2026 (85 % / pyyntihinta 2,5 M€). Lisäksi tyypillisesti 0,5–3 M€ velkojen ottoa.',
    url: 'https://www.onoticiasdatrofa.pt/assembleia-extraordinaria-do-trofense-aprova-venda-da-sad-a-novo-investidor/',
  },
  4: {
    low: 150_000,
    high: 600_000,
    note: 'Ohut aineisto: ainoa julkisesti hinnoiteltu tason 4 kauppa on SC Vila Real 4/2026 (25 % / 87 500 €, implisiittinen 100 % 500 000 € CdP-tasolla). Tukipiste: Torreense 2019 (70 % / 350 000 €).',
    url: 'https://www.avozdetrasosmontes.pt/sc-vila-real-com-luz-verde-para-criar-sad-e-vender-25-do-capital/',
  },
}

const BASIS_PREFIX = 'Sarjatason tyyppihaarukka'

const clubs = JSON.parse(readFileSync(clubsFile, 'utf8'))
let filled = 0
let kept = 0
let skipped = 0

for (const c of clubs) {
  if (!c.acquirable) {
    skipped++
    continue
  }
  const est = c.estimated_price_eur ?? {}
  const hasOwn = est.low != null || est.high != null
  const isBand = (est.basis ?? '').startsWith(BASIS_PREFIX)
  if (hasOwn && !isBand) {
    kept++ // seurakohtainen evidenssi säilyy koskemattomana
    continue
  }
  const band = BANDS[c.tier]
  if (!band) continue

  c.estimated_price_eur = {
    low: band.low,
    high: band.high,
    basis: `${BASIS_PREFIX} (SAD-enemmistö 70–90 %) julkisista vertailukaupoista 2019–2026 — seurakohtaista hintaevidenssiä ei löytynyt. ${band.note} Ks. data/price-basis.md.`,
  }
  c.sources = (c.sources ?? []).filter((s) => s.field !== 'estimated_price_eur')
  c.sources.push({
    field: 'estimated_price_eur',
    url: band.url,
    date: '2026-08-11',
    note: `Sarjatason ${c.tier} tyyppihaarukan keskeisin vertailukauppa; koko aineisto data/price-basis.md`,
  })
  filled++
}

writeFileSync(clubsFile, JSON.stringify(clubs, null, 2) + '\n')
console.log(
  `Sarjatasohaarukka lisätty ${filled} seuralle; seurakohtainen arvio säilytettiin ${kept} seuralla; ${skipped} B-joukkuetta ohitettu.`,
)
