// Muotoilu suomalaisittain. Puuttuva tieto näytetään aina tekstinä, ei tyhjänä.

export const EI_TIETOA = 'ei tietoa'

export const CURRENCY_SUFFIX = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  CHF: 'CHF',
  PLN: 'zł',
  CZK: 'Kč',
  TRY: '₺',
  JPY: '¥',
  BRL: 'R$',
  MXN: 'MX$',
  RUB: '₽',
}

export function symbolFor(currency) {
  return CURRENCY_SUFFIX[currency] ?? currency
}

/** Kompakti raha: 1,4 M€ / 850 t€ / 420 €. */
export function money(value, currency = 'EUR') {
  if (value === null || value === undefined || !Number.isFinite(value)) return EI_TIETOA
  const s = symbolFor(currency)
  const abs = Math.abs(value)
  if (abs >= 1_000_000) return `${(value / 1_000_000).toLocaleString('fi-FI', { maximumFractionDigits: 2 })} M${s}`
  if (abs >= 10_000) return `${(value / 1_000).toLocaleString('fi-FI', { maximumFractionDigits: 0 })} t${s}`
  return `${value.toLocaleString('fi-FI', { maximumFractionDigits: 0 })} ${s}`
}

/** Täysi raha ilman lyhennystä — taulukkovientiin ja työkaluvihjeisiin. */
export function moneyExact(value, currency = 'EUR') {
  if (value === null || value === undefined || !Number.isFinite(value)) return EI_TIETOA
  return `${Math.round(value).toLocaleString('fi-FI')} ${symbolFor(currency)}`
}

export function num(value, digits = 0) {
  if (value === null || value === undefined || !Number.isFinite(value)) return EI_TIETOA
  return value.toLocaleString('fi-FI', { maximumFractionDigits: digits })
}

export function percent(value, digits = 0) {
  if (value === null || value === undefined || !Number.isFinite(value)) return EI_TIETOA
  return `${(value * 100).toLocaleString('fi-FI', { maximumFractionDigits: digits })} %`
}

export function ratio(value) {
  if (value === null || value === undefined || !Number.isFinite(value)) return EI_TIETOA
  return `${value.toLocaleString('fi-FI', { maximumFractionDigits: 1 })}×`
}

export function text(value) {
  const s = String(value ?? '').trim()
  return s === '' ? EI_TIETOA : s
}

export function fileSize(bytes) {
  if (!Number.isFinite(bytes)) return EI_TIETOA
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toLocaleString('fi-FI', { maximumFractionDigits: 1 })} MB`
  return `${Math.max(1, Math.round(bytes / 1024)).toLocaleString('fi-FI')} kB`
}
