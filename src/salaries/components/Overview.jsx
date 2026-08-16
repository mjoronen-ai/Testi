// Yleiskuva: tärkeimmät luvut kerralla + sarjojen kokoluokat ja palkkojen jakauma.

import BarChart from './charts/BarChart.jsx'
import Histogram from './charts/Histogram.jsx'
import { Panel, StatTile } from './ui.jsx'
import { money, moneyExact, num, percent } from '../lib/format.js'

export default function Overview({ players, leagues, teams, baseCurrency, color }) {
  const fmt = (v) => money(v, baseCurrency)

  const all = players.map((p) => p.salary).filter((v) => Number.isFinite(v))
  const total = all.reduce((a, b) => a + b, 0)
  const sorted = [...all].sort((a, b) => a - b)
  const med = sorted.length ? sorted[Math.floor((sorted.length - 1) / 2)] : null
  const missing = players.length - all.length

  const leagueBars = leagues.map((l) => ({
    key: l.league,
    label: l.league,
    value: l.total,
    color: color(l.league),
    details: [
      { label: 'Pelaajia', value: num(l.count) },
      { label: 'Joukkueita', value: num(l.teams) },
      { label: 'Mediaani', value: fmt(l.median) },
      { label: 'Ylin', value: fmt(l.max) },
    ],
  }))

  const medianBars = [...leagues]
    .sort((a, b) => (b.median ?? 0) - (a.median ?? 0))
    .map((l) => ({
      key: l.league,
      label: l.league,
      value: l.median,
      color: color(l.league),
      details: [
        { label: 'Keskiarvo', value: fmt(l.mean) },
        { label: 'Alakvartiili', value: fmt(l.p25) },
        { label: 'Yläkvartiili', value: fmt(l.p75) },
        { label: 'Pelaajia', value: num(l.countWithSalary) },
      ],
    }))

  const topPlayers = [...players]
    .filter((p) => Number.isFinite(p.salary))
    .sort((a, b) => b.salary - a.salary)
    .slice(0, 10)
    .map((p) => ({
      key: p.id,
      label: `${p.player} · ${p.team}`,
      value: p.salary,
      color: color(p.league),
      details: [
        { label: 'Sarja', value: p.league },
        { label: 'Pelipaikka', value: p.position || 'ei tietoa' },
        { label: 'Alkuperäinen', value: moneyExact(p.salaryRaw, p.currency) },
        { label: 'Osuus sarjasta', value: leagueShare(p, leagues) },
      ],
    }))

  const legend = leagues.slice(0, 8).map((l) => ({ label: l.league, color: color(l.league) }))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatTile
          label={`Palkkasumma yhteensä (${baseCurrency})`}
          value={fmt(total)}
          hint={moneyExact(total, baseCurrency)}
        />
        <StatTile label="Mediaanipalkka / vuosi" value={fmt(med)} hint={`${num(all.length)} palkkatietoa`} />
        <StatTile label="Sarjoja" value={num(leagues.length)} />
        <StatTile label="Joukkueita" value={num(teams.length)} />
        <StatTile
          label="Pelaajia"
          value={num(players.length)}
          hint={missing > 0 ? `${num(missing)} riviltä puuttuu palkka` : 'kaikilla palkkatieto'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel
          title="Sarjojen palkkasumma"
          subtitle={`Kaikkien pelaajien vuosipalkat yhteensä, ${baseCurrency}`}
        >
          <BarChart data={leagueBars} format={fmt} legend={legend.length > 1 ? legend : null} />
        </Panel>

        <Panel title="Mediaanipalkka sarjoittain" subtitle="Puolet pelaajista ansaitsee tätä vähemmän">
          <BarChart data={medianBars} format={fmt} />
        </Panel>

        <Panel title="Kymmenen suurituloisinta" subtitle="Kaikki sarjat, vuosipalkka">
          <BarChart data={topPlayers} format={fmt} labelWidth={220} />
        </Panel>

        <Panel
          title="Palkkojen jakauma"
          subtitle={`Kaikki suodatetut pelaajat · vuosipalkka ${baseCurrency}`}
        >
          <Histogram values={all} format={fmt} />
          <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
            <Fact label="Alin" value={fmt(sorted[0] ?? null)} />
            <Fact label="Mediaani" value={fmt(med)} />
            <Fact label="Ylin" value={fmt(sorted[sorted.length - 1] ?? null)} />
          </div>
        </Panel>
      </div>
    </div>
  )
}

function Fact({ label, value }) {
  return (
    <div className="border border-slate-200 rounded px-3 py-2">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-slate-900 tabular-nums">{value}</div>
    </div>
  )
}

function leagueShare(player, leagues) {
  const league = leagues.find((l) => l.league === player.league)
  if (!league?.total) return 'ei tietoa'
  return percent(player.salary / league.total, 1)
}
