// Numeroiden ja valuuttojen tulkinta vapaamuotoisesta CSV-solusta.
// Tukee: "1 234,56", "1,234.56", "1.234,56", "€ 45 000", "45k", "1,2 M€", "(500)", "-".

const CURRENCY_SYMBOLS = [
  ['€', 'EUR'],
  ['$', 'USD'],
  ['£', 'GBP'],
  ['₺', 'TRY'],
  ['zł', 'PLN'],
  ['kr', 'SEK'], // tarkennetaan koodilla, jos solussa on SEK/NOK/DKK
  ['¥', 'JPY'],
  ['₽', 'RUB'],
]

export const KNOWN_CURRENCIES = [
  'EUR',
  'USD',
  'GBP',
  'SEK',
  'NOK',
  'DKK',
  'CHF',
  'PLN',
  'CZK',
  'TRY',
  'JPY',
  'BRL',
  'MXN',
  'RUB',
]

/** Poimii valuuttakoodin solusta (symboli tai ISO-koodi). Palauttaa null jos ei löydy. */
export function detectCurrency(raw) {
  if (raw === null || raw === undefined) return null
  const s = String(raw)
  const upper = s.toUpperCase()

  for (const code of KNOWN_CURRENCIES) {
    if (new RegExp(`(^|[^A-Z])${code}([^A-Z]|$)`).test(upper)) return code
  }
  for (const [symbol, code] of CURRENCY_SYMBOLS) {
    if (s.includes(symbol)) return code
  }
  return null
}

const MULTIPLIERS = [
  [/(\bmilj\.?|\bmn\b|\bm\b|M(?![A-Za-z]))/, 1_000_000],
  [/(\btuh\.?|\bt\b|k(?![A-Za-z])|K(?![A-Za-z]))/, 1_000],
]

/**
 * Tulkitsee luvun. Palauttaa null, jos solu ei ole luku.
 * Desimaalierotin päätellään: jos molemmat . ja , esiintyvät, viimeisenä oleva on desimaali.
 */
export function parseNumber(raw) {
  if (raw === null || raw === undefined) return null
  let s = String(raw).trim()
  if (s === '' || s === '-' || s === '–' || s === 'n/a' || s.toLowerCase() === 'na') return null

  // Sulkeet = negatiivinen (kirjanpitotyyli)
  let negative = /^\(.*\)$/.test(s)
  if (negative) s = s.slice(1, -1)
  if (/^\s*-/.test(s)) negative = true

  // Kerroin (45k, 1,2 M€) — etsitään ennen kuin kirjaimet siivotaan pois.
  // Valuuttakoodit poistetaan ensin, ettei esim. SEK/NOK/DKK tulkitse K:ta tuhanneksi.
  let multiplier = 1
  let tail = s.replace(/[\d\s.,  -]/g, '') // jäljelle jää kirjaimet ja symbolit
  for (const code of KNOWN_CURRENCIES) tail = tail.replace(new RegExp(code, 'gi'), '')
  for (const [pattern, factor] of MULTIPLIERS) {
    if (pattern.test(tail)) {
      multiplier = factor
      break
    }
  }

  // Jätetään vain numerot ja erottimet.
  const digits = s.replace(/[^\d.,]/g, '')
  if (!/\d/.test(digits)) return null

  const lastDot = digits.lastIndexOf('.')
  const lastComma = digits.lastIndexOf(',')
  let normalized

  if (lastDot >= 0 && lastComma >= 0) {
    const decimalSep = lastDot > lastComma ? '.' : ','
    const groupSep = decimalSep === '.' ? ',' : '.'
    normalized = digits.split(groupSep).join('').replace(decimalSep, '.')
  } else if (lastDot >= 0 || lastComma >= 0) {
    const sep = lastDot >= 0 ? '.' : ','
    const parts = digits.split(sep)
    const decimals = parts[parts.length - 1].length
    // "1.234" / "12,000" = tuhaterotin, kun erotin esiintyy kerran ja perässä on 3 numeroa.
    const isGroup = parts.length > 2 || (parts.length === 2 && decimals === 3 && parts[0].length <= 3)
    normalized = isGroup ? parts.join('') : parts.join('.')
  } else {
    normalized = digits
  }

  const value = Number(normalized)
  if (!Number.isFinite(value)) return null
  return (negative ? -value : value) * multiplier
}

/** Tulkitsee luvun ja valuutan yhdellä kertaa. */
export function parseMoney(raw) {
  return { value: parseNumber(raw), currency: detectCurrency(raw) }
}

/** true, jos vähintään osuus `ratio` arvoista tulkittavissa luvuksi. */
export function looksNumeric(values, ratio = 0.6) {
  const nonEmpty = values.filter((v) => String(v ?? '').trim() !== '')
  if (nonEmpty.length === 0) return false
  const parsed = nonEmpty.filter((v) => parseNumber(v) !== null).length
  return parsed / nonEmpty.length >= ratio
}

/**
 * true, jos arvot ovat pelkkiä lukuja ilman sanoja ("50 000", "12,5 €").
 * "Team 1" on luvuksi tulkittavissa muttei pelkkä luku — tälle erotukselle on
 * käyttöä, kun arvataan mikä sarake on joukkue ja mikä numeerinen mittari.
 */
export function looksPlainNumeric(values, ratio = 0.6) {
  const nonEmpty = values.filter((v) => String(v ?? '').trim() !== '')
  if (nonEmpty.length === 0) return false
  const plain = nonEmpty.filter((v) => {
    const s = String(v)
    return !/\p{L}{2,}/u.test(s.replace(/(EUR|USD|GBP|SEK|NOK|DKK|CHF|PLN|CZK|TRY|JPY|BRL|MXN|RUB)/gi, '')) &&
      parseNumber(s) !== null
  }).length
  return plain / nonEmpty.length >= ratio
}
