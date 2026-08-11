import { useState } from 'react'
import {
  fmt,
  fmtNum,
  fmtBool,
  fmtEur,
  SALE_LABELS,
  OWNER_LABELS,
  STRUCTURE_LABELS,
  CONFIDENCE_LABELS,
  leagueLabel,
  EI_TIETOA,
} from '../lib/format.js'
import { investorScore, WEIGHT_LABELS } from '../lib/scoring.js'

const ROWS = [
  ['Sarja', (c) => leagueLabel(c)],
  ['Kaupunki', (c) => fmt(c.city)],
  ['Väkiluku', (c) => fmtNum(c.city_population)],
  ['Rannikolla', (c) => fmtBool(c.coastal)],
  ['Lähin suurkaupunki', (c) => (c.nearest_major_city ? `${c.nearest_major_city.name} (${c.nearest_major_city.distance_km} km)` : EI_TIETOA)],
  ['Stadion', (c) => fmt(c.stadium?.name)],
  ['Kapasiteetti', (c) => fmtNum(c.stadium?.capacity)],
  ['Stadionin omistus', (c) => OWNER_LABELS[c.stadium?.owner ?? 'unknown']],
  ['Yleisökeskiarvo', (c) => fmtNum(c.attendance?.average)],
  ['Akatemia (FPF)', (c) => (c.academy?.fpf_certification != null ? `${c.academy.fpf_certification} ★` : EI_TIETOA)],
  ['Tunnettuja kasvatteja', (c) => ((c.academy?.notable_products ?? []).length ? c.academy.notable_products.join(', ') : EI_TIETOA)],
  ['Kilpailijat 30 km', (c) => (c.competition?.computed ? String((c.competition.same_or_higher_tier_within_30km ?? []).length) : EI_TIETOA)],
  ['Rakenne', (c) => STRUCTURE_LABELS[c.ownership?.structure ?? 'unknown']],
  ['Myyntistatus', (c) => SALE_LABELS[c.sale?.status ?? 'unknown']],
  ['Hinta-arvio (ARVIO)', (c) => (c.estimated_price_eur?.low != null || c.estimated_price_eur?.high != null ? `${fmtEur(c.estimated_price_eur?.low)} – ${fmtEur(c.estimated_price_eur?.high)}` : EI_TIETOA)],
  ['Luotettavuus', (c) => CONFIDENCE_LABELS[c.confidence] ?? c.confidence],
]

export default function Compare({ clubs, compareIds, onToggleCompare, weights }) {
  const [pickerValue, setPickerValue] = useState('')
  const selected = compareIds.map((id) => clubs.find((c) => c.id === id)).filter(Boolean)

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Lisää seura vertailuun (2–4)
          <select
            value={pickerValue}
            onChange={(e) => {
              if (e.target.value) onToggleCompare(e.target.value)
              setPickerValue('')
            }}
            className="border border-slate-300 rounded px-2 py-1.5 text-sm bg-white min-w-64"
          >
            <option value="">Valitse seura…</option>
            {clubs
              .filter((c) => !compareIds.includes(c.id))
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({leagueLabel(c)})
                </option>
              ))}
          </select>
        </label>
        {selected.map((c) => (
          <button
            key={c.id}
            onClick={() => onToggleCompare(c.id)}
            className="text-sm bg-blue-50 text-blue-700 rounded px-2 py-1.5 hover:bg-blue-100 cursor-pointer"
          >
            {c.name} ✕
          </button>
        ))}
      </div>

      {selected.length < 2 ? (
        <p className="text-sm text-slate-500">Valitse vähintään kaksi seuraa vertailuun.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left px-3 py-2 bg-slate-50 text-xs text-slate-600 w-44"></th>
                {selected.map((c) => (
                  <th key={c.id} className="text-left px-3 py-2 bg-slate-50 font-semibold">
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-100 bg-slate-50/50">
                <td className="px-3 py-2 text-slate-500">Sijoittajapisteet</td>
                {selected.map((c) => {
                  const s = investorScore(c, weights)
                  return (
                    <td key={c.id} className="px-3 py-2 font-bold text-lg">
                      {c.acquirable ? (s.total !== null ? s.total : 'ei dataa') : '— (B-joukkue)'}
                    </td>
                  )
                })}
              </tr>
              {Object.entries(WEIGHT_LABELS).map(([key, label]) => (
                <tr key={key} className="border-t border-slate-100">
                  <td className="px-3 py-1.5 text-slate-400 pl-6 text-xs">{label}</td>
                  {selected.map((c) => {
                    const s = investorScore(c, weights)
                    const p = s.parts[key]
                    return (
                      <td key={c.id} className="px-3 py-1.5 text-xs">
                        {p && p.score !== null ? Math.round(p.score * 100) : 'ei dataa'}
                      </td>
                    )
                  })}
                </tr>
              ))}
              {ROWS.map(([label, get]) => (
                <tr key={label} className="border-t border-slate-100">
                  <td className="px-3 py-2 text-slate-500">{label}</td>
                  {selected.map((c) => (
                    <td key={c.id} className="px-3 py-2">
                      {get(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
