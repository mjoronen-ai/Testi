// Tilastot ja ryhmittelyt. Kaikki laskenta käyttää normalisoitua vuosipalkkaa
// perusvaluutassa (player.salary). Rivit, joilta palkka puuttuu, lasketaan mukaan
// pelaajamäärään mutta ei palkkatilastoihin — ja puuttuvien määrä raportoidaan.

export function median(sorted) {
  if (sorted.length === 0) return null
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

export function percentile(sorted, p) {
  if (sorted.length === 0) return null
  if (sorted.length === 1) return sorted[0]
  const pos = (sorted.length - 1) * p
  const low = Math.floor(pos)
  const high = Math.ceil(pos)
  if (low === high) return sorted[low]
  return sorted[low] + (sorted[high] - sorted[low]) * (pos - low)
}

/** Gini-kerroin 0–1: 0 = kaikilla sama palkka, lähellä 1 = kaikki yhdellä. */
export function gini(sorted) {
  const n = sorted.length
  if (n < 2) return null
  const total = sorted.reduce((a, b) => a + b, 0)
  if (total <= 0) return null
  let weighted = 0
  for (let i = 0; i < n; i += 1) weighted += (i + 1) * sorted[i]
  return (2 * weighted) / (n * total) - (n + 1) / n
}

/** Yhden joukon palkkatilastot. */
export function summarize(players) {
  const withSalary = players.filter((p) => typeof p.salary === 'number' && Number.isFinite(p.salary))
  const values = withSalary.map((p) => p.salary).sort((a, b) => a - b)
  const total = values.reduce((a, b) => a + b, 0)

  const topEarner = withSalary.reduce(
    (best, p) => (best === null || p.salary > best.salary ? p : best),
    null,
  )
  const top3 = [...values].slice(-3).reduce((a, b) => a + b, 0)

  return {
    count: players.length,
    countWithSalary: values.length,
    missing: players.length - values.length,
    total: values.length ? total : null,
    mean: values.length ? total / values.length : null,
    median: median(values),
    min: values.length ? values[0] : null,
    max: values.length ? values[values.length - 1] : null,
    p25: percentile(values, 0.25),
    p75: percentile(values, 0.75),
    p90: percentile(values, 0.9),
    gini: gini(values),
    top3Share: values.length >= 3 && total > 0 ? top3 / total : null,
    topEarner: topEarner ? { player: topEarner.player, team: topEarner.team, salary: topEarner.salary } : null,
    teams: new Set(players.map((p) => p.team)).size,
    values,
  }
}

export function groupBy(items, keyFn) {
  const map = new Map()
  for (const item of items) {
    const key = keyFn(item)
    const bucket = map.get(key)
    if (bucket) bucket.push(item)
    else map.set(key, [item])
  }
  return map
}

/** Sarjakohtaiset tunnusluvut, suurin palkkasumma ensin. */
export function byLeague(players) {
  const groups = groupBy(players, (p) => p.league)
  const out = []
  for (const [league, list] of groups) {
    const stats = summarize(list)
    const teamGroups = groupBy(list, (p) => p.team)
    const payrolls = []
    for (const [, teamPlayers] of teamGroups) {
      const s = summarize(teamPlayers)
      if (s.total !== null) payrolls.push(s.total)
    }
    payrolls.sort((a, b) => a - b)
    out.push({
      key: league,
      league,
      ...stats,
      teamPayrollMedian: median(payrolls),
      teamPayrollMax: payrolls.length ? payrolls[payrolls.length - 1] : null,
      teamPayrollMin: payrolls.length ? payrolls[0] : null,
      // Kilpailullinen tasapaino: suurimman ja pienimmän joukkuebudjetin suhde.
      payrollSpread:
        payrolls.length >= 2 && payrolls[0] > 0 ? payrolls[payrolls.length - 1] / payrolls[0] : null,
    })
  }
  return out.sort((a, b) => (b.total ?? 0) - (a.total ?? 0))
}

/** Joukkuekohtaiset tunnusluvut. Sama joukkuenimi eri sarjoissa pidetään erillään. */
export function byTeam(players) {
  const groups = groupBy(players, (p) => `${p.league} :: ${p.team}`)
  const out = []
  for (const [key, list] of groups) {
    out.push({ key, team: list[0].team, league: list[0].league, ...summarize(list) })
  }
  return out.sort((a, b) => (b.total ?? 0) - (a.total ?? 0))
}

/** Yleinen ryhmittely mille tahansa kentälle (pelipaikka, kansallisuus, kausi). */
export function byField(players, field) {
  const groups = groupBy(players, (p) => (p[field] === '' || p[field] === null ? 'Ei tietoa' : String(p[field])))
  const out = []
  for (const [key, list] of groups) out.push({ key, label: key, ...summarize(list) })
  return out.sort((a, b) => (b.total ?? 0) - (a.total ?? 0))
}

/** Osuus sarjan palkkasummasta — käytetään joukkuetaulukossa. */
export function withLeagueShare(teams, leagues) {
  const totals = new Map(leagues.map((l) => [l.league, l.total]))
  return teams.map((t) => {
    const leagueTotal = totals.get(t.league)
    return {
      ...t,
      leagueShare: leagueTotal && t.total !== null ? t.total / leagueTotal : null,
    }
  })
}

/** Jakauma histogrammia varten: bucketCount pylvästä min..max. */
export function histogram(values, bucketCount = 12) {
  const nums = values.filter((v) => Number.isFinite(v)).sort((a, b) => a - b)
  if (nums.length === 0) return { buckets: [], min: 0, max: 0 }
  const min = nums[0]
  const max = nums[nums.length - 1]
  if (max === min) return { buckets: [{ from: min, to: max, count: nums.length }], min, max }

  const width = (max - min) / bucketCount
  const buckets = Array.from({ length: bucketCount }, (_, i) => ({
    from: min + i * width,
    to: min + (i + 1) * width,
    count: 0,
  }))
  for (const v of nums) {
    const idx = Math.min(bucketCount - 1, Math.floor((v - min) / width))
    buckets[idx].count += 1
  }
  return { buckets, min, max }
}
