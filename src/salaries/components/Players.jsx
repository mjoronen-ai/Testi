// Pelaajataso: koko rivistö haettavana ja lajiteltavana + pelipaikkojen palkkataso.

import { useMemo } from 'react'
import BarChart from './charts/BarChart.jsx'
import { Button, DataTable, Panel } from './ui.jsx'
import { money, moneyExact, num, text } from '../lib/format.js'
import { PERIOD_LABELS } from '../lib/schema.js'
import { byField } from '../lib/stats.js'
import { download, playersCsv } from '../lib/export.js'

export default function Players({ players, baseCurrency, color }) {
  const fmt = (v) => money(v, baseCurrency)

  const positions = useMemo(() => {
    const groups = byField(players.filter((p) => p.position), 'position')
    return groups
      .filter((g) => g.countWithSalary > 0)
      .sort((a, b) => (b.median ?? 0) - (a.median ?? 0))
      .map((g) => ({
        key: g.key,
        label: g.label,
        value: g.median,
        details: [
          { label: 'Pelaajia', value: num(g.count) },
          { label: 'Keskiarvo', value: fmt(g.mean) },
          { label: 'Ylin', value: fmt(g.max) },
          { label: 'Palkkasumma', value: fmt(g.total) },
        ],
      }))
  }, [players, baseCurrency])

  const columns = [
    { key: 'player', label: 'Pelaaja', value: (r) => r.player },
    { key: 'team', label: 'Joukkue', value: (r) => r.team },
    {
      key: 'league',
      label: 'Sarja',
      value: (r) => r.league,
      render: (r) => (
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: color(r.league) }} />
          {r.league}
        </span>
      ),
    },
    { key: 'position', label: 'Pelipaikka', value: (r) => r.position, render: (r) => text(r.position), muted: true },
    { key: 'age', label: 'Ikä', align: 'right', value: (r) => r.age, render: (r) => num(r.age) },
    {
      key: 'salary',
      label: `Vuosipalkka (${baseCurrency})`,
      align: 'right',
      value: (r) => r.salary,
      render: (r) => fmt(r.salary),
    },
    {
      key: 'salaryRaw',
      label: 'Alkuperäinen',
      align: 'right',
      value: (r) => r.salaryRaw,
      render: (r) => `${moneyExact(r.salaryRaw, r.currency)} / ${(PERIOD_LABELS[r.period] ?? r.period).toLowerCase()}`,
      muted: true,
    },
    { key: 'nationality', label: 'Kansallisuus', value: (r) => r.nationality, render: (r) => text(r.nationality), muted: true },
    { key: 'season', label: 'Kausi', value: (r) => r.season, render: (r) => text(r.season), muted: true },
    {
      key: 'contractEnd',
      label: 'Sopimus päättyy',
      value: (r) => r.contractEnd,
      render: (r) => text(r.contractEnd),
      muted: true,
    },
  ]

  return (
    <div className="space-y-4">
      {positions.length > 1 && (
        <Panel title="Mediaanipalkka pelipaikoittain" subtitle="Suodattimet vaikuttavat myös tähän">
          <BarChart data={positions} format={fmt} />
        </Panel>
      )}

      <Panel
        title="Pelaajat"
        subtitle={`${num(players.length)} riviä · klikkaa saraketta lajitellaksesi`}
        actions={
          <Button onClick={() => download('pelaajat.csv', playersCsv(players, baseCurrency))}>
            Lataa CSV
          </Button>
        }
      >
        <DataTable
          columns={columns}
          rows={players}
          rowKey={(r) => r.id}
          initialSort={{ key: 'salary', dir: 'desc' }}
          emptyText="Ei pelaajia — lataa CSV-tiedosto tai löysennä suodattimia."
        />
      </Panel>
    </div>
  )
}
