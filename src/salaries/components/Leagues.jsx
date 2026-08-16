// Sarjavertailu: valittu mittari pylväinä + kaikki tunnusluvut taulukkona.

import { useState } from 'react'
import BarChart from './charts/BarChart.jsx'
import { Button, DataTable, Panel, Select } from './ui.jsx'
import { money, num, percent, ratio } from '../lib/format.js'
import { download, groupsCsv } from '../lib/export.js'

export default function Leagues({ leagues, baseCurrency, color }) {
  const [metric, setMetric] = useState('total')
  const fmt = (v) => money(v, baseCurrency)

  const METRICS = [
    { key: 'total', label: 'Palkkasumma', format: fmt },
    { key: 'mean', label: 'Keskipalkka', format: fmt },
    { key: 'median', label: 'Mediaanipalkka', format: fmt },
    { key: 'max', label: 'Suurin yksittäinen palkka', format: fmt },
    { key: 'teamPayrollMedian', label: 'Joukkueen mediaanibudjetti', format: fmt },
    { key: 'payrollSpread', label: 'Rikkaimman ja köyhimmän joukkueen ero', format: ratio },
    { key: 'gini', label: 'Palkkaerot sarjan sisällä (Gini)', format: (v) => num(v, 2) },
    { key: 'count', label: 'Pelaajia', format: (v) => num(v) },
    { key: 'teams', label: 'Joukkueita', format: (v) => num(v) },
  ]
  const selected = METRICS.find((m) => m.key === metric) ?? METRICS[0]

  const bars = [...leagues]
    .sort((a, b) => (b[selected.key] ?? -Infinity) - (a[selected.key] ?? -Infinity))
    .map((l) => ({
      key: l.league,
      label: l.league,
      value: l[selected.key],
      color: color(l.league),
      details: [
        { label: 'Palkkasumma', value: fmt(l.total) },
        { label: 'Mediaani', value: fmt(l.median) },
        { label: 'Joukkueita', value: num(l.teams) },
        { label: 'Suurituloisin', value: l.topEarner ? `${l.topEarner.player} (${fmt(l.topEarner.salary)})` : 'ei tietoa' },
      ],
    }))

  const columns = [
    { key: 'league', label: 'Sarja', value: (r) => r.league },
    { key: 'count', label: 'Pelaajia', align: 'right', value: (r) => r.count, render: (r) => num(r.count) },
    { key: 'teams', label: 'Joukkueita', align: 'right', value: (r) => r.teams, render: (r) => num(r.teams) },
    { key: 'total', label: 'Palkkasumma', align: 'right', value: (r) => r.total, render: (r) => fmt(r.total) },
    { key: 'mean', label: 'Keskiarvo', align: 'right', value: (r) => r.mean, render: (r) => fmt(r.mean) },
    { key: 'median', label: 'Mediaani', align: 'right', value: (r) => r.median, render: (r) => fmt(r.median) },
    { key: 'p25', label: 'Alakvartiili', align: 'right', value: (r) => r.p25, render: (r) => fmt(r.p25) },
    { key: 'p75', label: 'Yläkvartiili', align: 'right', value: (r) => r.p75, render: (r) => fmt(r.p75) },
    { key: 'max', label: 'Ylin', align: 'right', value: (r) => r.max, render: (r) => fmt(r.max) },
    {
      key: 'teamPayrollMedian',
      label: 'Joukkuebudjetin mediaani',
      align: 'right',
      value: (r) => r.teamPayrollMedian,
      render: (r) => fmt(r.teamPayrollMedian),
    },
    {
      key: 'payrollSpread',
      label: 'Budjettiero (max/min)',
      align: 'right',
      value: (r) => r.payrollSpread,
      render: (r) => ratio(r.payrollSpread),
    },
    { key: 'gini', label: 'Gini', align: 'right', value: (r) => r.gini, render: (r) => num(r.gini, 2) },
    {
      key: 'top3Share',
      label: 'Top 3 -osuus',
      align: 'right',
      value: (r) => r.top3Share,
      render: (r) => percent(r.top3Share, 0),
    },
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
        title="Sarjojen vertailu"
        subtitle="Yksi mittari kerrallaan, jotta pylväiden pituudet ovat suoraan vertailukelpoisia."
        actions={
          <Select
            label=""
            value={metric}
            onChange={setMetric}
            options={METRICS.map((m) => ({ value: m.key, label: m.label }))}
          />
        }
      >
        <BarChart data={bars} format={selected.format} />
      </Panel>

      <Panel
        title="Kaikki tunnusluvut sarjoittain"
        subtitle="Klikkaa saraketta lajitellaksesi."
        actions={
          <Button
            onClick={() =>
              download('sarjat-yhteenveto.csv', groupsCsv(leagues, 'Sarja', baseCurrency))
            }
          >
            Lataa CSV
          </Button>
        }
      >
        <DataTable
          columns={columns}
          rows={leagues}
          rowKey={(r) => r.key}
          initialSort={{ key: 'total', dir: 'desc' }}
          emptyText="Ei sarjoja — lataa ensin CSV-tiedosto."
        />
      </Panel>
    </div>
  )
}
