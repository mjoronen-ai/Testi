// Ladatun tiedoston muuntaminen normalisoiduiksi pelaajariveiksi.
// Raakarivit säilytetään, joten sarakekartan tai valuutan muutos ei vaadi uutta latausta.

import { parseCsv } from './csv.js'
import { parseMoney, parseNumber } from './numbers.js'
import {
  PERIOD_FACTORS,
  detectMapping,
  detectPeriod,
  detectPeriodFromMapping,
} from './schema.js'

export const DEFAULT_RATES = {
  EUR: 1,
  USD: 0.92,
  GBP: 1.17,
  SEK: 0.088,
  NOK: 0.086,
  DKK: 0.134,
  CHF: 1.06,
  PLN: 0.23,
  CZK: 0.04,
  TRY: 0.028,
  JPY: 0.0059,
  BRL: 0.17,
  MXN: 0.05,
  RUB: 0.01,
}

let counter = 0
const nextId = () => `ds${Date.now().toString(36)}${(counter++).toString(36)}`

function baseName(fileName) {
  return String(fileName ?? 'data.csv').replace(/\.[^.]+$/, '')
}

/**
 * Rakentaa tietojoukon CSV-tekstistä. Sarakekartta ja oletukset ovat käyttäjän
 * muokattavissa jälkikäteen (ks. rebuildRows).
 */
export function buildDataset(fileName, text, options = {}) {
  const parsed = parseCsv(text, { delimiter: options.delimiter })
  const mapping = options.mapping ?? detectMapping(parsed.headers, parsed.rows)
  const period = options.period ?? detectPeriodFromMapping(parsed.headers, mapping) ?? 'year'

  return {
    id: options.id ?? nextId(),
    fileName: String(fileName ?? 'data.csv'),
    addedAt: options.addedAt ?? new Date().toISOString(),
    delimiter: parsed.delimiter,
    headers: parsed.headers,
    rows: parsed.rows,
    warnings: parsed.warnings,
    mapping,
    // Oletukset käytetään, kun tiedostossa ei ole vastaavaa saraketta.
    defaultLeague: options.defaultLeague ?? baseName(fileName),
    defaultCurrency: options.defaultCurrency ?? 'EUR',
    defaultPeriod: period,
    defaultSeason: options.defaultSeason ?? '',
  }
}

const cell = (row, index) => (index === undefined || index === null ? '' : (row[index] ?? '').trim())

/** Muuntaa yhden tietojoukon rivit normalisoiduiksi pelaajiksi. */
export function materialize(dataset, rates = DEFAULT_RATES, baseCurrency = 'EUR') {
  const { mapping, rows } = dataset
  const players = []
  const issues = { missingSalary: 0, missingTeam: 0, unknownCurrency: new Set() }

  rows.forEach((row, i) => {
    const rawSalary = cell(row, mapping.salary)
    const money = parseMoney(rawSalary)

    const currency =
      (cell(row, mapping.currency) || '').toUpperCase().match(/[A-Z]{3}/)?.[0] ||
      money.currency ||
      dataset.defaultCurrency ||
      'EUR'

    const period = detectPeriod(cell(row, mapping.period)) ?? dataset.defaultPeriod ?? 'year'
    const annual = money.value === null ? null : money.value * (PERIOD_FACTORS[period] ?? 1)

    const rate = rates[currency]
    if (rate === undefined) issues.unknownCurrency.add(currency)
    const baseRate = rates[baseCurrency] ?? 1
    const annualBase = annual === null || rate === undefined ? null : (annual * rate) / baseRate

    const team = cell(row, mapping.team) || 'Ei joukkuetta'
    const league = cell(row, mapping.league) || dataset.defaultLeague || 'Ei sarjaa'

    if (money.value === null) issues.missingSalary += 1
    if (!cell(row, mapping.team)) issues.missingTeam += 1

    players.push({
      id: `${dataset.id}:${i}`,
      datasetId: dataset.id,
      fileName: dataset.fileName,
      player: cell(row, mapping.player) || `Pelaaja ${i + 1}`,
      team,
      league,
      season: cell(row, mapping.season) || dataset.defaultSeason || '',
      position: cell(row, mapping.position) || '',
      nationality: cell(row, mapping.nationality) || '',
      age: parseNumber(cell(row, mapping.age)),
      contractEnd: cell(row, mapping.contract_end) || '',
      salaryRaw: money.value,
      currency,
      period,
      salaryAnnual: annual,
      salary: annualBase, // vuositasoinen, perusvaluutassa — kaikki tilastot käyttävät tätä
    })
  })

  return { players, issues: { ...issues, unknownCurrency: [...issues.unknownCurrency] } }
}

/** Kaikki tietojoukot yhdeksi pelaajalistaksi. */
export function materializeAll(datasets, rates = DEFAULT_RATES, baseCurrency = 'EUR') {
  const players = []
  const issues = {}
  for (const dataset of datasets) {
    const result = materialize(dataset, rates, baseCurrency)
    players.push(...result.players)
    issues[dataset.id] = result.issues
  }
  return { players, issues }
}

/** Kevyt versio tallennukseen: pudottaa lasketut kentät pois. */
export function serializeDataset(dataset) {
  const { id, fileName, addedAt, delimiter, headers, rows, warnings, mapping } = dataset
  return {
    id,
    fileName,
    addedAt,
    delimiter,
    headers,
    rows,
    warnings,
    mapping,
    defaultLeague: dataset.defaultLeague,
    defaultCurrency: dataset.defaultCurrency,
    defaultPeriod: dataset.defaultPeriod,
    defaultSeason: dataset.defaultSeason,
  }
}
