// Ladatut tiedostot: sarakekartan korjaus, oletusarvot, esikatselu ja poisto.
// Sekä valuuttakurssit, joilla eri sarjojen palkat saadaan vertailukelpoisiksi.

import { useState } from 'react'
import { DELIMITER_LABELS } from '../lib/csv.js'
import { KNOWN_CURRENCIES } from '../lib/numbers.js'
import { FIELDS, PERIODS } from '../lib/schema.js'
import { num } from '../lib/format.js'
import { Button, Note, Panel, Select, TextInput } from './ui.jsx'
import Uploader from './Uploader.jsx'

export default function DataFiles({
  datasets,
  issues,
  playerCounts,
  onFiles,
  onUpdate,
  onRemove,
  onClearAll,
  rates,
  onRateChange,
  onResetRates,
  baseCurrency,
  onBaseCurrencyChange,
  usedCurrencies,
}) {
  return (
    <div className="space-y-4">
      <Uploader onFiles={onFiles} compact />

      <Panel
        title="Valuutta ja vertailuperuste"
        subtitle="Kaikki tilastot lasketaan vuositasolle ja perusvaluuttaan muunnettuina, jotta sarjat ovat vertailukelpoisia."
        actions={<Button onClick={onResetRates}>Palauta oletuskurssit</Button>}
      >
        <div className="flex flex-wrap items-end gap-4">
          <Select
            label="Perusvaluutta"
            value={baseCurrency}
            onChange={onBaseCurrencyChange}
            options={KNOWN_CURRENCIES.map((c) => ({ value: c, label: c }))}
          />
          {/* Kurssit ilmaistaan euroissa, joten euro itse on aina 1 — sitä ei kysytä. */}
          {usedCurrencies.filter((c) => c !== 'EUR').map((currency) => (
            <label key={currency} className="text-xs text-slate-600 flex flex-col gap-1">
              {`1 ${currency} = ? EUR`}
              <input
                type="number"
                step="0.0001"
                min="0"
                value={rates[currency] ?? ''}
                onChange={(e) => onRateChange(currency, e.target.value)}
                className="text-sm border border-slate-300 rounded px-2 py-1.5 w-28 tabular-nums"
              />
            </label>
          ))}
        </div>
        <div className="mt-3">
          {usedCurrencies.filter((c) => c !== 'EUR').length === 0 ? (
            <Note>Kaikki ladatut palkat ovat euroissa, joten valuuttamuunnoksia ei tarvita.</Note>
          ) : (
            <Note tone="warn">
              Kurssit ovat käsin syötettäviä oletusarvoja, eivät päivän kursseja. Tarkista ja
              päivitä ne itse, jos vertaat eri valuutta-alueiden sarjoja tarkasti.
            </Note>
          )}
        </div>
      </Panel>

      {datasets.length === 0 ? (
        <Panel title="Ei ladattuja tiedostoja">
          <p className="text-sm text-slate-500">Lataa CSV-tiedosto yllä olevasta laatikosta.</p>
        </Panel>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button variant="danger" onClick={onClearAll}>
              Poista kaikki tiedostot
            </Button>
          </div>
          {datasets.map((dataset) => (
            <DatasetPanel
              key={dataset.id}
              dataset={dataset}
              issue={issues[dataset.id]}
              playerCount={playerCounts[dataset.id] ?? 0}
              onUpdate={(patch) => onUpdate(dataset.id, patch)}
              onRemove={() => onRemove(dataset.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function DatasetPanel({ dataset, issue, playerCount, onUpdate, onRemove }) {
  const [open, setOpen] = useState(false)
  const columnOptions = [
    { value: '', label: '— ei sarakkeessa —' },
    ...dataset.headers.map((h, i) => ({ value: String(i), label: h })),
  ]

  const problems = []
  if (issue?.missingSalary) problems.push(`${num(issue.missingSalary)} riviltä puuttuu palkka`)
  if (issue?.missingTeam) problems.push(`${num(issue.missingTeam)} riviltä puuttuu joukkue`)
  if (issue?.unknownCurrency?.length) {
    problems.push(`tuntematon valuutta: ${issue.unknownCurrency.join(', ')}`)
  }

  return (
    <Panel
      title={dataset.fileName}
      subtitle={`${num(playerCount)} riviä · ${dataset.headers.length} saraketta · erotin ${
        DELIMITER_LABELS[dataset.delimiter] ?? dataset.delimiter
      }`}
      actions={
        <>
          <Button onClick={() => setOpen((v) => !v)}>{open ? 'Piilota esikatselu' : 'Esikatselu'}</Button>
          <Button variant="danger" onClick={onRemove}>
            Poista
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        {dataset.warnings.length > 0 && (
          <Note tone="warn">{dataset.warnings.join(' ')}</Note>
        )}
        {problems.length > 0 && <Note tone="warn">Huomioita: {problems.join('; ')}.</Note>}

        <div>
          <h3 className="text-xs font-semibold text-slate-700 mb-2">Sarakekartta</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {FIELDS.map((field) => (
              <Select
                key={field.key}
                label={field.required ? `${field.label} *` : field.label}
                value={dataset.mapping[field.key] === undefined ? '' : String(dataset.mapping[field.key])}
                onChange={(value) =>
                  onUpdate({
                    mapping: {
                      ...dataset.mapping,
                      [field.key]: value === '' ? undefined : Number(value),
                    },
                  })
                }
                options={columnOptions}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-700 mb-2">
            Oletukset, kun tiedostossa ei ole vastaavaa saraketta
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <TextInput
              label="Sarjan nimi"
              value={dataset.defaultLeague}
              onChange={(value) => onUpdate({ defaultLeague: value })}
              placeholder="esim. Veikkausliiga"
            />
            <Select
              label="Valuutta"
              value={dataset.defaultCurrency}
              onChange={(value) => onUpdate({ defaultCurrency: value })}
              options={KNOWN_CURRENCIES.map((c) => ({ value: c, label: c }))}
            />
            <Select
              label="Palkkajakso"
              value={dataset.defaultPeriod}
              onChange={(value) => onUpdate({ defaultPeriod: value })}
              options={PERIODS.map((p) => ({ value: p.key, label: p.label }))}
            />
            <TextInput
              label="Kausi"
              value={dataset.defaultSeason}
              onChange={(value) => onUpdate({ defaultSeason: value })}
              placeholder="esim. 2026"
            />
          </div>
        </div>

        {open && <Preview dataset={dataset} />}
      </div>
    </Panel>
  )
}

function Preview({ dataset }) {
  const mapped = new Map()
  for (const [field, index] of Object.entries(dataset.mapping)) {
    if (index !== undefined && index !== null) mapped.set(index, field)
  }
  const fieldLabel = Object.fromEntries(FIELDS.map((f) => [f.key, f.label]))

  return (
    <div className="overflow-auto border border-slate-200 rounded max-h-72">
      <table className="text-xs border-collapse">
        <thead className="sticky top-0 bg-slate-50">
          <tr>
            {dataset.headers.map((h, i) => (
              <th key={i} className="px-2 py-1.5 text-left border-b border-slate-200 whitespace-nowrap">
                <div className="font-medium text-slate-900">{h}</div>
                <div className={mapped.has(i) ? 'text-blue-700' : 'text-slate-400'}>
                  {mapped.has(i) ? `→ ${fieldLabel[mapped.get(i)]}` : 'ei käytössä'}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataset.rows.slice(0, 10).map((row, i) => (
            <tr key={i} className={i % 2 ? 'bg-slate-50/60' : ''}>
              {row.map((cell, j) => (
                <td key={j} className="px-2 py-1 border-b border-slate-100 whitespace-nowrap text-slate-700">
                  {cell === '' ? <span className="text-slate-300">—</span> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
