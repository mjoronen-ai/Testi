import { useMemo } from 'react'
import { investorScore, DEFAULT_WEIGHTS, WEIGHT_LABELS } from '../lib/scoring.js'
import { leagueLabel, fmt, CONFIDENCE_LABELS } from '../lib/format.js'

export default function Ranking({ clubs, weights, setWeights, onSelect }) {
  const ranked = useMemo(() => {
    return clubs
      .filter((c) => c.acquirable)
      .map((c) => ({ club: c, score: investorScore(c, weights) }))
      .sort((a, b) => {
        if (a.score.total === null && b.score.total === null) return 0
        if (a.score.total === null) return 1
        if (b.score.total === null) return -1
        return b.score.total - a.score.total
      })
  }, [clubs, weights])

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-4 items-start">
      <div className="bg-white rounded-lg border border-slate-200 p-4 lg:sticky lg:top-4">
        <h3 className="text-sm font-semibold mb-3">Painot</h3>
        {Object.entries(WEIGHT_LABELS).map(([key, label]) => (
          <label key={key} className="block mb-3 text-xs text-slate-600">
            <span className="flex justify-between mb-1">
              <span>{label}</span>
              <span className="font-semibold">{weights[key]} %</span>
            </span>
            <input
              type="range"
              min="0"
              max="50"
              value={weights[key]}
              onChange={(e) => setWeights((w) => ({ ...w, [key]: Number(e.target.value) }))}
              className="w-full"
            />
          </label>
        ))}
        <button
          onClick={() => setWeights(DEFAULT_WEIGHTS)}
          className="text-sm text-blue-600 hover:underline cursor-pointer"
        >
          Palauta oletukset
        </button>
        <p className="text-[11px] text-slate-400 mt-3">
          Pisteet lasketaan vain ostettavissa oleville seuroille. Puuttuva osa-alue ei nollaa
          pistettä: kokonaispiste normalisoidaan saatavilla olevista osista ja datakattavuus
          näytetään erikseen.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs text-slate-600">
              <th className="px-3 py-2 w-10">#</th>
              <th className="px-3 py-2">Seura</th>
              <th className="px-3 py-2">Sarja</th>
              <th className="px-3 py-2">Pisteet</th>
              <th className="px-3 py-2">Kattavuus</th>
              {Object.entries(WEIGHT_LABELS).map(([key, label]) => (
                <th key={key} className="px-3 py-2 whitespace-nowrap" title={label}>
                  {label.split(' ')[0]}
                </th>
              ))}
              <th className="px-3 py-2">Luotettavuus</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map(({ club: c, score }, i) => (
              <tr
                key={c.id}
                onClick={() => onSelect(c.id)}
                className="border-t border-slate-100 hover:bg-blue-50 cursor-pointer"
              >
                <td className="px-3 py-2 text-slate-400">{score.total !== null ? i + 1 : ''}</td>
                <td className="px-3 py-2 font-medium">{c.name}</td>
                <td className="px-3 py-2 text-xs text-slate-600 whitespace-nowrap">{leagueLabel(c)}</td>
                <td className="px-3 py-2 font-bold">
                  {score.total !== null ? score.total : <span className="text-slate-400 font-normal">ei dataa</span>}
                </td>
                <td className="px-3 py-2 text-xs text-slate-500">
                  {score.total !== null ? `${Math.round(score.coverage * 100)} %` : '—'}
                </td>
                {Object.keys(WEIGHT_LABELS).map((key) => {
                  const p = score.parts[key]
                  return (
                    <td key={key} className="px-3 py-2 text-xs">
                      {p && p.score !== null ? Math.round(p.score * 100) : <span className="text-slate-300">ei dataa</span>}
                    </td>
                  )
                })}
                <td className="px-3 py-2 text-xs text-slate-500">{CONFIDENCE_LABELS[c.confidence] ?? fmt(c.confidence)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {ranked.length === 0 && (
          <p className="text-center text-slate-500 py-8 text-sm">Ei ostettavissa olevia seuroja valituilla suodattimilla.</p>
        )}
      </div>
    </div>
  )
}
