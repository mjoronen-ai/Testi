// Joukkuevertailu sarjojen sisällä ja välillä.

import { useMemo, useState } from 'react'
import BarChart from './charts/BarChart.jsx'
import { Button, DataTable, Panel, Select } from './ui.jsx'
import { money, num, percent } from '../lib/format.js'
import { OTHER_COLOR } from '../lib/palette.js'
import { download, groupsCsv } from '../lib/export.js'

const LIMITS = [
  { value: '10', label: '10 kärjessä' },
  { value: '20', label: '20 kärjessä' },
  { value: '30', label: '30 kärjessä' },
  { value: 'all', label: 'Kaikki joukkueet' },
]

export default function Teams({ teams, leagues, baseCurrency, color }) {
  const [metric, setMetric] = useState('total')
  const [limit, setLimit] = useState('20')
  const fmt = (v) => money(v, baseCurrency)
  const leagueKeys = leagues.map((l) => l.league)

  const METRICS = [
    { key: 'total', label: 'Palkkabudjetti yhteensä', format: fmt },
    { key: 'mean', label: 'Keskipalkka', format: fmt },
    { key: 'median', label: 'Mediaanipalkka', format: fmt },
    { key: 'max', label: 'Suurin yksittäinen palkka', format: fmt },
    { key: 'leagueShare', label: 'Osuus sarjan palkkasummasta', format: (v) => percent(v, 1) },
    { key: 'count', label: 'Pelaajia', format: (v) => num(v) },
    { key: 'gini', label: 'Palkkaerot joukkueen sisällä (Gini)', format: (v) => num(v, 2) },
  ]
  const selected = METRICS.find((m) => m.key === metric) ?? METRICS[0]

  const bars = useMemo(() => {
    const sorted = [...teams].sort((a, b) => (b[selected.key] ?? -Infinity) - (a[selected.key] ?? -Infinity))
    const shown = limit === 'all' ? sorted : sorted.slice(0, Number(limit))
    return shown.map((t) => ({
      key: t.key,
      label: leagueKeys.length > 1 ? `${t.team} · ${t.league}` : t.team,
      value: t[selected.key],
      color: color(t.league),
      details: [
        { label: 'Sarja', value: t.league },
        { label: 'Pelaajia', value: num(t.count) },
        { label: 'Palkkabudjetti', value: fmt(t.total) },
        { label: 'Mediaani', value: fmt(t.median) },
        { label: 'Suurituloisin', value: t.topEarner ? `${t.topEarner.player} (${fmt(t.topEarner.salary)})` : 'ei tietoa' },
      ],
    }))
  }, [teams, selected, limit, leagueKeys.length])

  const legend = leagueKeys.slice(0, 8).map((l) => ({ label: l, color: color(l) }))
  if (leagueKeys.length > 8) legend.push({ label: 'Muut sarjat', color: OTHER_COLOR })

  const columns = [
    { key: 'team', label: 'Joukkue', value: (r) => r.team },
    { key: 'league', label: 'Sarja', value: (r) => r.league, muted: true },
    { key: 'count', label: 'Pelaajia', align: 'right', value: (r) => r.count, render: (r) => num(r.count) },
    { key: 'total', label: 'Palkkabudjetti', align: 'right', value: (r) => r.total, render: (r) => fmt(r.total) },
    {
      key: 'leagueShare',
      label: 'Osuus sarjasta',
      align: 'right',
      value: (r) => r.leagueShare,
      render: (r) => percent(r.leagueShare, 1),
    },
    { key: 'mean', label: 'Keskiarvo', align: 'right', value: (r) => r.mean, render: (r) => fmt(r.mean) },
    { key: 'median', label: 'Mediaani', align: 'right', value: (r) => r.median, render: (r) => fmt(r.median) },
    { key: 'min', label: 'Alin', align: 'right', value: (r) => r.min, render: (r) => fmt(r.min) },
    { key: 'max', label: 'Ylin', align: 'right', value: (r) => r.max, render: (r) => fmt(r.max) },
    { key: 'gini', label: 'Gini', align: 'right', value: (r) => r.gini, render: (r) => num(r.gini, 2) },
    {
      key: 'topEarner',
      label: 'Suurituloisin',
      value: (r) => r.topEarner?.player ?? '',
      render: (r) => (r.topEarner ? `${r.topEarner.player} (${fmt(r.topEarner.salary)})` : 'ei tietoa'),
      muted: true,
    },
  ]

  return (
    <div className="space-y-4">
      <Panel
        title="Joukkueiden vertailu"
        subtitle="Väri kertoo sarjan — sama sarja pitää värinsä, vaikka suodatat listaa."
        actions={
          <>
            <Select
              label=""
              value={metric}
              onChange={setMetric}
              options={METRICS.map((m) => ({ value: m.key, label: m.label }))}
            />
            <Select label="" value={limit} onChange={setLimit} options={LIMITS} />
          </>
        }
      >
        <BarChart data={bars} format={selected.format} labelWidth={220} legend={legend.length > 1 ? legend : null} />
      </Panel>

      <Panel
        title="Kaikki joukkueet"
        subtitle="Klikkaa saraketta lajitellaksesi."
        actions={
          <Button
            onClick={() => download('joukkueet-yhteenveto.csv', groupsCsv(teams, 'Joukkue', baseCurrency, 'Sarja'))}
          >
            Lataa CSV
          </Button>
        }
      >
        <DataTable
          columns={columns}
          rows={teams}
          rowKey={(r) => r.key}
          initialSort={{ key: 'total', dir: 'desc' }}
          emptyText="Ei joukkueita — lataa ensin CSV-tiedosto."
        />
      </Panel>
    </div>
  )
}
