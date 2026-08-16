// CSV-vienti: yhdistetty pelaajadata tai valmiiksi lasketut yhteenvedot.
// Erottimena puolipiste ja desimaalipilkku → aukeaa suomalaisessa Excelissä sellaisenaan.

import { toCsv } from './csv.js'

const dec = (value, digits = 2) =>
  value === null || value === undefined || !Number.isFinite(value)
    ? ''
    : value.toFixed(digits).replace('.', ',')

export function download(fileName, text) {
  // BOM eteen, jotta ääkköset näkyvät Excelissä oikein.
  const blob = new Blob(['﻿', text], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function playersCsv(players, baseCurrency) {
  const headers = [
    'Pelaaja', 'Joukkue', 'Sarja', 'Kausi', 'Pelipaikka', 'Kansallisuus', 'Ikä',
    'Sopimus päättyy', 'Palkka (alkuperäinen)', 'Valuutta', 'Palkkajakso',
    `Vuosipalkka (${baseCurrency})`, 'Lähdetiedosto',
  ]
  const rows = players.map((p) => [
    p.player, p.team, p.league, p.season, p.position, p.nationality, p.age ?? '',
    p.contractEnd, dec(p.salaryRaw), p.currency, p.period, dec(p.salary), p.fileName,
  ])
  return toCsv(headers, rows)
}

export function groupsCsv(groups, labelHeader, baseCurrency, extraLabel = null) {
  const headers = [
    labelHeader,
    ...(extraLabel ? [extraLabel] : []),
    'Pelaajia', 'Palkka tiedossa', 'Joukkueita',
    `Palkkasumma (${baseCurrency})`, `Keskiarvo (${baseCurrency})`, `Mediaani (${baseCurrency})`,
    `Alin (${baseCurrency})`, `Ylin (${baseCurrency})`, `Yläkvartiili p75 (${baseCurrency})`,
    'Gini', 'Top 3 -osuus', 'Suurituloisin',
  ]
  const rows = groups.map((g) => [
    g.label ?? g.league ?? g.team,
    ...(extraLabel ? [g.league ?? ''] : []),
    g.count, g.countWithSalary, g.teams,
    dec(g.total), dec(g.mean), dec(g.median), dec(g.min), dec(g.max), dec(g.p75),
    dec(g.gini, 3), dec(g.top3Share, 3),
    g.topEarner ? `${g.topEarner.player} (${Math.round(g.topEarner.salary)})` : '',
  ])
  return toCsv(headers, rows)
}
