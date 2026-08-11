import { useMemo, useState } from 'react'
import {
  fmt,
  fmtNum,
  fmtBool,
  SALE_LABELS,
  OWNER_LABELS,
  STRUCTURE_LABELS,
  CONFIDENCE_LABELS,
  leagueLabel,
} from '../lib/format.js'
import { investorScore } from '../lib/scoring.js'

// Sarakemäärittelyt: [avain, otsikko, arvo lajittelua varten, solun renderöinti]
const ALL_COLUMNS = [
  { key: 'name', label: 'Seura', value: (c) => c.name, render: null, always: true },
  { key: 'league', label: 'Sarja', value: (c) => `${c.tier}${c.series ?? ''}`, render: (c) => leagueLabel(c) },
  { key: 'city', label: 'Kaupunki', value: (c) => c.city ?? '', render: (c) => fmt(c.city) },
  { key: 'district', label: 'Piiri', value: (c) => c.district ?? '', render: (c) => fmt(c.district) },
  { key: 'coastal', label: 'Rannikko', value: (c) => (c.coastal === null ? -1 : c.coastal ? 1 : 0), render: (c) => fmtBool(c.coastal) },
  { key: 'population', label: 'Väkiluku', value: (c) => c.city_population, render: (c) => fmtNum(c.city_population) },
  { key: 'stadium', label: 'Stadion', value: (c) => c.stadium?.name ?? '', render: (c) => fmt(c.stadium?.name) },
  { key: 'capacity', label: 'Kapasiteetti', value: (c) => c.stadium?.capacity, render: (c) => fmtNum(c.stadium?.capacity) },
  { key: 'owner', label: 'Stadionin omistus', value: (c) => c.stadium?.owner ?? 'unknown', render: (c) => OWNER_LABELS[c.stadium?.owner ?? 'unknown'] },
  { key: 'attendance', label: 'Yleisökeskiarvo', value: (c) => c.attendance?.average, render: (c) => fmtNum(c.attendance?.average) },
  { key: 'academy', label: 'Akatemia (FPF)', value: (c) => Number(c.academy?.fpf_certification) || 0, render: (c) => (c.academy?.fpf_certification != null ? `${c.academy.fpf_certification} ★` : fmt(null)) },
  { key: 'structure', label: 'Rakenne', value: (c) => c.ownership?.structure ?? 'unknown', render: (c) => STRUCTURE_LABELS[c.ownership?.structure ?? 'unknown'] },
  { key: 'sale', label: 'Myyntistatus', value: (c) => c.sale?.status ?? 'unknown', render: (c) => SALE_LABELS[c.sale?.status ?? 'unknown'] },
  { key: 'acquirable', label: 'Ostettavissa', value: (c) => (c.acquirable ? 1 : 0), render: (c) => fmtBool(c.acquirable) },
  { key: 'score', label: 'Pisteet', value: null, render: null },
  { key: 'confidence', label: 'Luotettavuus', value: (c) => c.confidence, render: (c) => CONFIDENCE_LABELS[c.confidence] ?? fmt(c.confidence) },
]

const DEFAULT_VISIBLE = ['name', 'league', 'city', 'coastal', 'capacity', 'owner', 'academy', 'sale', 'score']

export default function ClubTable({ clubs, weights, onSelect, compareIds, onToggleCompare }) {
  const [visible, setVisible] = useState(DEFAULT_VISIBLE)
  const [sort, setSort] = useState({ key: 'name', dir: 1 })
  const [showColumnPicker, setShowColumnPicker] = useState(false)

  const scores = useMemo(() => {
    const m = new Map()
    for (const c of clubs) m.set(c.id, investorScore(c, weights))
    return m
  }, [clubs, weights])

  const sorted = useMemo(() => {
    const col = ALL_COLUMNS.find((c) => c.key === sort.key)
    const val = sort.key === 'score' ? (c) => scores.get(c.id)?.total : col?.value
    if (!val) return clubs
    return [...clubs].sort((a, b) => {
      const av = val(a)
      const bv = val(b)
      // null aina viimeiseksi lajittelusuunnasta riippumatta
      if (av == null && bv == null) return 0
      if (av == null) return 1
      if (bv == null) return -1
      if (typeof av === 'string') return av.localeCompare(bv, 'pt') * sort.dir
      return (av - bv) * sort.dir
    })
  }, [clubs, sort, scores])

  const cols = ALL_COLUMNS.filter((c) => c.always || visible.includes(c.key))

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="px-4 py-2 border-b border-slate-200 flex justify-between items-center">
        <span className="text-xs text-slate-500">
          Klikkaa riviä avataksesi seurakortin · ✓-sarake lisää vertailuun (max 4)
        </span>
        <div className="relative">
          <button
            onClick={() => setShowColumnPicker((s) => !s)}
            className="text-sm text-blue-600 hover:underline cursor-pointer"
          >
            Valitse sarakkeet
          </button>
          {showColumnPicker && (
            <div className="absolute right-0 top-7 z-20 bg-white border border-slate-300 rounded-lg shadow-lg p-3 w-56">
              {ALL_COLUMNS.filter((c) => !c.always).map((c) => (
                <label key={c.key} className="flex items-center gap-2 text-sm py-0.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visible.includes(c.key)}
                    onChange={() =>
                      setVisible((v) =>
                        v.includes(c.key) ? v.filter((x) => x !== c.key) : [...v, c.key],
                      )
                    }
                  />
                  {c.label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs text-slate-600">
              <th className="px-3 py-2 w-8"></th>
              {cols.map((c) => (
                <th
                  key={c.key}
                  onClick={() => setSort((s) => ({ key: c.key, dir: s.key === c.key ? -s.dir : 1 }))}
                  className="px-3 py-2 cursor-pointer select-none hover:text-slate-900 whitespace-nowrap"
                >
                  {c.label}
                  {sort.key === c.key ? (sort.dir === 1 ? ' ▲' : ' ▼') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((c) => {
              const score = scores.get(c.id)
              return (
                <tr
                  key={c.id}
                  onClick={() => onSelect(c.id)}
                  className="border-t border-slate-100 hover:bg-blue-50 cursor-pointer"
                >
                  <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={compareIds.includes(c.id)}
                      onChange={() => onToggleCompare(c.id)}
                      title="Lisää vertailuun"
                    />
                  </td>
                  {cols.map((col) => (
                    <td key={col.key} className="px-3 py-2 whitespace-nowrap">
                      {col.key === 'score' ? (
                        score?.total !== null && score !== undefined ? (
                          <span className="font-semibold">{score.total}</span>
                        ) : (
                          <span className="text-slate-400">{c.acquirable ? 'ei dataa' : '—'}</span>
                        )
                      ) : col.key === 'name' ? (
                        <span className="font-medium">
                          {c.name}
                          {!c.acquirable && (
                            <span className="ml-1.5 text-[10px] uppercase bg-slate-200 text-slate-600 rounded px-1 py-0.5">
                              B
                            </span>
                          )}
                        </span>
                      ) : (
                        col.render(c)
                      )}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
        {sorted.length === 0 && (
          <p className="text-center text-slate-500 py-8 text-sm">Ei seuroja valituilla suodattimilla.</p>
        )}
      </div>
    </div>
  )
}
