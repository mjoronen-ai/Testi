// Palkkasovelluksen ytimen testit: CSV-jäsennys, lukujen tulkinta, sarakkeiden
// tunnistus, normalisointi ja tilastot. Ajo: npm test

import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'

import { parseCsv, sniffDelimiter, toCsv } from '../src/salaries/lib/csv.js'
import { detectCurrency, parseNumber } from '../src/salaries/lib/numbers.js'
import { detectMapping, detectPeriod } from '../src/salaries/lib/schema.js'
import { DEFAULT_RATES, buildDataset, materialize } from '../src/salaries/lib/dataset.js'
import { byLeague, byTeam, gini, histogram, median, percentile, summarize } from '../src/salaries/lib/stats.js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

let passed = 0
let failed = 0
function test(name, fn) {
  try {
    fn()
    passed += 1
  } catch (error) {
    failed += 1
    console.error(`FAIL  ${name}\n      ${error.message}`)
  }
}

// --- CSV -------------------------------------------------------------------

test('lainausmerkit, erottimet kentän sisällä ja rivinvaihdot', () => {
  const csv = 'a,b\n"Virtanen, Mikko","rivi1\nrivi2"\n"kaksi ""lainausta""",x'
  const { headers, rows } = parseCsv(csv, { delimiter: ',' })
  assert.deepEqual(headers, ['a', 'b'])
  assert.equal(rows[0][0], 'Virtanen, Mikko')
  assert.equal(rows[0][1], 'rivi1\nrivi2')
  assert.equal(rows[1][0], 'kaksi "lainausta"')
})

test('CRLF ja BOM', () => {
  const { headers, rows } = parseCsv('﻿a;b\r\n1;2\r\n')
  assert.deepEqual(headers, ['a', 'b'])
  assert.deepEqual(rows, [['1', '2']])
})

test('erottimen tunnistus', () => {
  assert.equal(sniffDelimiter('a;b;c\n1;2;3\n4;5;6'), ';')
  assert.equal(sniffDelimiter('a,b,c\n1,2,3'), ',')
  assert.equal(sniffDelimiter('a\tb\tc\n1\t2\t3'), '\t')
  // Puolipiste voittaa, vaikka arvoissa on pilkkuja desimaalierottimena.
  assert.equal(sniffDelimiter('nimi;palkka\nA;1,50\nB;2,50'), ';')
})

test('epätasaiset rivit täytetään ja raportoidaan', () => {
  const { rows, warnings } = parseCsv('a,b,c\n1,2\n1,2,3,4')
  assert.deepEqual(rows[0], ['1', '2', ''])
  assert.deepEqual(rows[1], ['1', '2', '3'])
  assert.equal(warnings.length, 1)
})

test('tyhjät rivit ja duplikaattiotsikot', () => {
  const { headers, rows } = parseCsv('a,a,\n1,2,3\n\n4,5,6\n')
  assert.deepEqual(headers, ['a', 'a_2', 'sarake_3'])
  assert.equal(rows.length, 2)
})

test('toCsv suojaa erottimet ja lainausmerkit', () => {
  const out = toCsv(['a', 'b'], [['x;y', 'sano "hei"']], ';')
  assert.equal(out, 'a;b\r\n"x;y";"sano ""hei"""')
})

// --- Luvut ja valuutat ------------------------------------------------------

test('lukujen tulkinta eri muodoissa', () => {
  assert.equal(parseNumber('145 000'), 145000)
  assert.equal(parseNumber('145 000'), 145000) // sitova välilyönti
  assert.equal(parseNumber('1,234.56'), 1234.56)
  assert.equal(parseNumber('1.234,56'), 1234.56)
  assert.equal(parseNumber('12,5'), 12.5)
  assert.equal(parseNumber('12,500'), 12500)
  assert.equal(parseNumber('1.234'), 1234)
  assert.equal(parseNumber('€ 45 000'), 45000)
  assert.equal(parseNumber('£45k'), 45000)
  assert.equal(parseNumber('1,2 M€'), 1200000)
  assert.equal(parseNumber('(500)'), -500)
  assert.equal(parseNumber('-500'), -500)
  assert.equal(parseNumber(''), null)
  assert.equal(parseNumber('ei tietoa'), null)
})

test('valuuttakoodi ei sekoitu tuhatkertoimeen', () => {
  assert.equal(parseNumber('45 000 SEK'), 45000)
  assert.equal(parseNumber('45 000 NOK'), 45000)
  assert.equal(parseNumber('45 000 DKK'), 45000)
  assert.equal(detectCurrency('45 000 SEK'), 'SEK')
  assert.equal(detectCurrency('£45,000'), 'GBP')
  assert.equal(detectCurrency('145 000 €'), 'EUR')
  assert.equal(detectCurrency('145000'), null)
})

test('palkkajakson tunnistus otsikosta', () => {
  assert.equal(detectPeriod('Weekly Wage'), 'week')
  assert.equal(detectPeriod('Månadslön'), 'month') // tarkkeet eivät saa estää tunnistusta
  assert.equal(detectPeriod('Kuukausipalkka'), 'month')
  assert.equal(detectPeriod('Viikkopalkka'), 'week')
  assert.equal(detectPeriod('Vuosipalkka'), 'year') // ei "kk" sanan keskeltä
  assert.equal(detectPeriod('Palkka'), null)
})

// --- Sarakkeiden tunnistus --------------------------------------------------

test('sarakkeet tunnistetaan suomeksi ja englanniksi', () => {
  const fi = detectMapping(['Pelaaja', 'Joukkue', 'Sarja', 'Pelipaikka', 'Ikä', 'Vuosipalkka'], [])
  assert.equal(fi.player, 0)
  assert.equal(fi.team, 1)
  assert.equal(fi.league, 2)
  assert.equal(fi.position, 3)
  assert.equal(fi.age, 4)
  assert.equal(fi.salary, 5)

  const en = detectMapping(['Player', 'Club', 'League', 'Position', 'Age', 'Weekly Wage'], [])
  assert.equal(en.player, 0)
  assert.equal(en.team, 1)
  assert.equal(en.salary, 5)
})

test('palkka ja joukkue päätellään datasta, jos otsikot ovat oudot', () => {
  const headers = ['nimi', 'kolonna B', 'summa X']
  const rows = [
    ['A', 'Team 1', '100000'],
    ['B', 'Team 1', '90000'],
    ['C', 'Team 2', '80000'],
    ['D', 'Team 2', '70000'],
  ]
  const mapping = detectMapping(headers, rows)
  assert.equal(mapping.salary, 2)
  assert.equal(mapping.team, 1)
})

// --- Normalisointi ----------------------------------------------------------

test('viikkopalkka punnissa muuttuu vuosipalkaksi euroissa', () => {
  const csv = 'Player,Club,League,Weekly Wage\nA,Club A,PL,"£10,000"\n'
  const dataset = buildDataset('pl.csv', csv)
  assert.equal(dataset.defaultPeriod, 'week')
  const { players } = materialize(dataset, DEFAULT_RATES, 'EUR')
  assert.equal(players[0].currency, 'GBP')
  assert.equal(players[0].salaryAnnual, 520000)
  assert.equal(Math.round(players[0].salary), Math.round(520000 * DEFAULT_RATES.GBP))
})

test('kuukausipalkka kruunuina: valuuttasarake ja oletusjakso', () => {
  const csv = 'Spelare;Lag;Liga;Månadslön;Valuta\nA;Lag 1;Ligan;50 000,50;SEK\n'
  const dataset = buildDataset('swe.csv', csv, { period: 'month' })
  const { players } = materialize(dataset, DEFAULT_RATES, 'EUR')
  assert.equal(players[0].currency, 'SEK')
  assert.equal(players[0].salaryAnnual, 50000.5 * 12)
  assert.equal(players[0].league, 'Ligan')
})

test('puuttuva sarjasarake korvautuu tiedoston nimellä', () => {
  const dataset = buildDataset('Veikkausliiga 2026.csv', 'Pelaaja,Joukkue,Palkka\nA,FC X,50000\n')
  const { players, issues } = materialize(dataset)
  assert.equal(players[0].league, 'Veikkausliiga 2026')
  assert.equal(issues.missingSalary, 0)
})

test('puuttuva palkka ei kaada laskentaa vaan raportoidaan', () => {
  const dataset = buildDataset('x.csv', 'Pelaaja,Joukkue,Palkka\nA,FC X,50000\nB,FC X,\n')
  const { players, issues } = materialize(dataset)
  assert.equal(issues.missingSalary, 1)
  assert.equal(players[1].salary, null)
  const stats = summarize(players)
  assert.equal(stats.count, 2)
  assert.equal(stats.countWithSalary, 1)
  assert.equal(stats.missing, 1)
  assert.equal(stats.total, 50000)
})

// --- Tilastot ---------------------------------------------------------------

test('mediaani, kvartiilit ja gini', () => {
  assert.equal(median([1, 2, 3]), 2)
  assert.equal(median([1, 2, 3, 4]), 2.5)
  assert.equal(median([]), null)
  assert.equal(percentile([0, 10], 0.5), 5)
  assert.equal(percentile([1, 2, 3, 4], 0.75), 3.25)
  assert.equal(gini([5, 5, 5, 5]), 0)
  assert.ok(gini([1, 1, 1, 100]) > 0.6)
})

test('sarja- ja joukkuetason yhteenvedot', () => {
  const players = [
    { league: 'A', team: 'X', player: 'p1', salary: 100 },
    { league: 'A', team: 'X', player: 'p2', salary: 200 },
    { league: 'A', team: 'Y', player: 'p3', salary: 50 },
    { league: 'B', team: 'X', player: 'p4', salary: 900 },
  ]
  const leagues = byLeague(players)
  assert.equal(leagues[0].league, 'B') // suurin palkkasumma ensin
  const a = leagues.find((l) => l.league === 'A')
  assert.equal(a.total, 350)
  assert.equal(a.teams, 2)
  assert.equal(a.max, 200)
  assert.equal(a.topEarner.player, 'p2')
  assert.equal(a.teamPayrollMedian, 175) // X 300, Y 50
  assert.equal(a.payrollSpread, 6)

  const teams = byTeam(players)
  // Sama joukkuenimi eri sarjoissa pysyy erillisenä.
  assert.equal(teams.length, 3)
  assert.equal(teams.filter((t) => t.team === 'X').length, 2)
})

test('histogrammi laskee kaikki arvot', () => {
  const { buckets } = histogram([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5)
  assert.equal(buckets.length, 5)
  assert.equal(buckets.reduce((sum, b) => sum + b.count, 0), 10)
})

// --- Esimerkkitiedostot päästä päähän ---------------------------------------

test('esimerkkitiedostot jäsentyvät ja normalisoituvat', () => {
  const files = [
    'esimerkkiliiga-fin-2026.csv',
    'exempelligan-swe-2026.csv',
    'example-league-eng-2026.csv',
  ]
  const all = []
  for (const file of files) {
    const text = readFileSync(resolve(ROOT, 'public/esimerkkidata', file), 'utf8')
    const dataset = buildDataset(file, text)
    assert.ok(dataset.mapping.salary !== undefined, `${file}: palkkasaraketta ei tunnistettu`)
    assert.ok(dataset.mapping.team !== undefined, `${file}: joukkuesaraketta ei tunnistettu`)
    const { players, issues } = materialize(dataset, DEFAULT_RATES, 'EUR')
    assert.equal(issues.missingSalary, 0, `${file}: palkkoja jäi tulkitsematta`)
    assert.equal(issues.unknownCurrency.length, 0, `${file}: tuntematon valuutta`)
    all.push(...players)
  }
  const leagues = byLeague(all)
  assert.equal(leagues.length, 3)
  for (const league of leagues) {
    assert.ok(league.teams >= 9)
    // Kaikki kolme tiedostoa ovat eri jaksossa ja valuutassa. Jos jakso jää
    // muuntamatta, mediaani putoaa väärään suuruusluokkaan — tämä raja nappaa sen.
    assert.ok(
      league.median > 20_000 && league.median < 5_000_000,
      `${league.league}: vuosipalkan mediaani epäuskottava (${Math.round(league.median)} EUR)`,
    )
  }
})

console.log(`\n${passed} testiä läpi, ${failed} epäonnistui`)
process.exit(failed === 0 ? 0 : 1)
