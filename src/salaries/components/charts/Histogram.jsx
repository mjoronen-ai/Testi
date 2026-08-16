// Palkkajakauma: montako pelaajaa osuu kuhunkin palkkahaarukkaan.
// Yksi sarja → yksi sävy, ei selitettä; otsikko kertoo mitä piirretään.

import { useRef, useState } from 'react'
import { AXIS_TEXT, GRID, SEQUENTIAL, SEQUENTIAL_SOFT } from '../../lib/palette.js'
import { histogram } from '../../lib/stats.js'

export default function Histogram({ values, format, height = 160, buckets = 12 }) {
  const [hover, setHover] = useState(null)
  // Ks. BarChart: napautuksen jälkeen tuleva mouseleave sulkisi juuri avatun lukeman.
  const touch = useRef(false)
  const { buckets: bins } = histogram(values, buckets)

  if (bins.length === 0) {
    return <p className="text-sm text-slate-500 py-4">Ei palkkatietoja jakauman piirtämiseen.</p>
  }

  const maxCount = Math.max(...bins.map((b) => b.count))
  const gapPercent = 1.2

  return (
    <div>
      <div className="flex items-end gap-0 relative" style={{ height }}>
        {/* Hiusviivainen apuviiva ylärajalle — kantaa lukemat, joita ei ole suoraan merkitty. */}
        <div className="absolute inset-x-0 top-0 border-t" style={{ borderColor: GRID }} />
        {bins.map((b, i) => {
          const h = maxCount > 0 ? (b.count / maxCount) * 100 : 0
          const active = hover === i
          return (
            <div
              key={i}
              className="flex-1 h-full flex items-end cursor-pointer"
              style={{ paddingLeft: i === 0 ? 0 : `${gapPercent}%` }}
              onMouseEnter={() => {
                if (!touch.current) setHover(i)
              }}
              onMouseLeave={() => {
                if (!touch.current) setHover((v) => (v === i ? null : v))
              }}
              onPointerDown={(e) => {
                touch.current = e.pointerType !== 'mouse'
              }}
              // Kosketusnäytöllä napautus näyttää haarukan ja pelaajamäärän.
              onPointerUp={(e) => {
                if (e.pointerType !== 'mouse') setHover((v) => (v === i ? null : i))
              }}
            >
              <div
                className="w-full rounded-t-[4px]"
                style={{
                  height: `${Math.max(h, b.count > 0 ? 2 : 0)}%`,
                  background: active ? SEQUENTIAL : SEQUENTIAL_SOFT,
                }}
                title={`${format(b.from)} – ${format(b.to)}: ${b.count} pelaajaa`}
              />
            </div>
          )
        })}
      </div>

      <div className="border-t mt-1 pt-1 flex justify-between text-xs" style={{ borderColor: GRID, color: AXIS_TEXT }}>
        <span className="tabular-nums">{format(bins[0].from)}</span>
        <span>
          {hover !== null
            ? `${format(bins[hover].from)} – ${format(bins[hover].to)} · ${bins[hover].count} pelaajaa`
            : 'pylvään korkeus = pelaajien määrä'}
        </span>
        <span className="tabular-nums">{format(bins[bins.length - 1].to)}</span>
      </div>
    </div>
  )
}
