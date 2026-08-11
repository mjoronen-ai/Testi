// Muotoiluapurit — puuttuva tieto näytetään aina näkyvästi, ei tyhjänä.

export const EI_TIETOA = 'ei tietoa'

export function fmt(value, suffix = '') {
  if (value === null || value === undefined || value === '') return EI_TIETOA
  return `${value}${suffix}`
}

export function fmtNum(value, suffix = '') {
  if (value === null || value === undefined) return EI_TIETOA
  return `${Number(value).toLocaleString('fi-FI')}${suffix}`
}

export function fmtBool(value, yes = 'kyllä', no = 'ei') {
  if (value === null || value === undefined) return EI_TIETOA
  return value ? yes : no
}

export function fmtEur(value) {
  if (value === null || value === undefined) return EI_TIETOA
  if (value >= 1_000_000) return `${(value / 1_000_000).toLocaleString('fi-FI', { maximumFractionDigits: 1 })} M€`
  if (value >= 1_000) return `${(value / 1_000).toLocaleString('fi-FI', { maximumFractionDigits: 0 })} t€`
  return `${value.toLocaleString('fi-FI')} €`
}

export const SALE_LABELS = {
  for_sale: 'Myynnissä',
  seeking_investors: 'Hakee sijoittajia',
  recently_sold: 'Myyty hiljattain',
  not_for_sale: 'Ei myynnissä',
  unknown: 'Ei tiedossa',
}

export const OWNER_LABELS = {
  club: 'Seura',
  municipality: 'Kunta',
  association: 'Liitto/yhdistys',
  other: 'Muu',
  unknown: 'Ei tiedossa',
}

export const STRUCTURE_LABELS = {
  SAD: 'SAD (osakeyhtiö)',
  clube: 'Clube (yhdistys)',
  unknown: 'Ei tiedossa',
}

export const CONFIDENCE_LABELS = {
  high: 'korkea',
  medium: 'keskitaso',
  low: 'matala',
}

export const TIER_COLORS = {
  2: '#2563eb',
  3: '#059669',
  4: '#d97706',
}

export function leagueLabel(club) {
  return club.series ? `${club.league} — ${club.series}` : club.league
}
