// Vaakapylväät suuruusvertailuun. Yksi mittari kerrallaan, yksi akseli.
// Arvo luetaan pylvään kärjestä; hover näyttää tarkemmat luvut.

import { useState } from 'react'
import { MUTED, OTHER_COLOR, SEQUENTIAL, inkOn } from '../../lib/palette.js'

export default function BarChart({
  data,
  format = (v) => String(v),
  emptyText = 'Ei arvoja näytettäväksi.',
  labelWidth = 180,
  legend = null,
}) {
  const [hover, setHover] = useState(null)

  const values = data.map((d) => d.value).filter((v) => Number.isFinite(v))
  if (values.length === 0) return <p className="text-sm text-slate-500 py-4">{emptyText}</p>
  const max = Math.max(...values, 0)

  return (
    <div className="relative">
      {legend && legend.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
          {legend.map((l) => (
            <span key={l.label} className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="w-3 h-3 rounded-sm" style={{ background: l.color }} aria-hidden="true" />
              {l.label}
            </span>
          ))}
        </div>
      )}

      <ul className="space-y-1.5">
        {data.map((d) => {
          const value = Number.isFinite(d.value) ? d.value : 0
          const width = max > 0 ? Math.max(value / max, 0) * 100 : 0
          const wide = width > 55
          const fill = Number.isFinite(d.value) ? (d.color ?? SEQUENTIAL) : MUTED
          return (
            <li
              key={d.key}
              className="flex items-center gap-3 rounded px-1 -mx-1 py-0.5 hover:bg-slate-50"
              onMouseEnter={() => setHover(d.key)}
              onMouseLeave={() => setHover((h) => (h === d.key ? null : h))}
            >
              <span
                className="text-xs text-slate-600 truncate shrink-0"
                style={{ width: labelWidth }}
                title={d.label}
              >
                {d.label}
              </span>

              {/* Arvo luetaan pylvään kärjestä: leveään pylvääseen sisään, kapean perään. */}
              <span className="relative flex-1 h-5 min-w-0">
                <span
                  className="absolute inset-y-0 left-0 rounded-r-[4px] flex items-center justify-end"
                  style={{
                    width: `${width}%`,
                    background: fill,
                    opacity: hover === null || hover === d.key ? 1 : 0.55,
                  }}
                >
                  {wide && (
                    <span
                      className="px-2 text-xs font-medium tabular-nums whitespace-nowrap"
                      style={{ color: inkOn(fill) }}
                    >
                      {format(d.value)}
                    </span>
                  )}
                </span>
                {!wide && (
                  <span
                    className="absolute inset-y-0 flex items-center pl-2 text-xs text-slate-700 tabular-nums whitespace-nowrap"
                    style={{ left: `${width}%` }}
                  >
                    {format(d.value)}
                  </span>
                )}
              </span>
            </li>
          )
        })}
      </ul>

      {hover !== null && (
        <HoverCard item={data.find((d) => d.key === hover)} format={format} />
      )}
    </div>
  )
}

function HoverCard({ item, format }) {
  if (!item) return null
  const details = item.details ?? []
  if (details.length === 0) return null
  return (
    <div className="mt-3 border border-slate-200 bg-slate-50 rounded px-3 py-2 text-xs text-slate-700">
      <div className="flex items-center gap-2 font-medium text-slate-900">
        <span className="w-2.5 h-2.5 rounded-sm" style={{ background: item.color ?? OTHER_COLOR }} />
        {item.label}
        <span className="tabular-nums text-slate-600">{format(item.value)}</span>
      </div>
      <dl className="mt-1 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-0.5">
        {details.map((d) => (
          <div key={d.label} className="flex justify-between gap-2">
            <dt className="text-slate-500">{d.label}</dt>
            <dd className="tabular-nums">{d.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
