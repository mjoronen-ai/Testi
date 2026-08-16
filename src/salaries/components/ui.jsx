// Yhteiset käyttöliittymäpalikat: paneeli, tunnuslukuruutu, lajiteltava taulukko.

import { useMemo, useState } from 'react'
import { EI_TIETOA } from '../lib/format.js'

export function Panel({ title, subtitle, actions, children, className = '' }) {
  return (
    <section className={`bg-white border border-slate-200 rounded-lg ${className}`}>
      {(title || actions) && (
        <header className="flex items-start justify-between gap-4 px-4 py-3 border-b border-slate-200">
          <div>
            {title && <h2 className="text-sm font-semibold text-slate-900">{title}</h2>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  )
}

export function StatTile({ label, value, hint, hero = false }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg px-4 py-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div
        className={`mt-1 font-semibold text-slate-900 ${hero ? 'text-4xl' : 'text-2xl'}`}
      >
        {value}
      </div>
      {hint && <div className="text-xs text-slate-500 mt-1">{hint}</div>}
    </div>
  )
}

export function Button({ children, onClick, variant = 'default', type = 'button', disabled, title }) {
  const styles = {
    default: 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50',
    primary: 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700',
    danger: 'bg-white border-red-300 text-red-700 hover:bg-red-50',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`text-sm px-3 py-1.5 rounded border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]}`}
    >
      {children}
    </button>
  )
}

export function Select({ label, value, onChange, options, className = '' }) {
  return (
    <label className={`text-xs text-slate-600 flex flex-col gap-1 ${className}`}>
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm border border-slate-300 rounded px-2 py-1.5 bg-white text-slate-900 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export function TextInput({ label, value, onChange, placeholder, className = '' }) {
  return (
    <label className={`text-xs text-slate-600 flex flex-col gap-1 ${className}`}>
      {label}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm border border-slate-300 rounded px-2 py-1.5 bg-white text-slate-900"
      />
    </label>
  )
}

export function Empty({ children }) {
  return <p className="text-sm text-slate-500 py-6 text-center">{children}</p>
}

export function Note({ children, tone = 'info' }) {
  const tones = {
    info: 'bg-slate-50 border-slate-200 text-slate-600',
    warn: 'bg-amber-50 border-amber-200 text-amber-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  }
  return <div className={`text-xs border rounded px-3 py-2 ${tones[tone]}`}>{children}</div>
}

/**
 * Lajiteltava taulukko. Sarake: { key, label, align, value(row), render(row), width }
 * Tyhjät arvot lajitellaan aina viimeisiksi kummassakin suunnassa.
 */
export function DataTable({ columns, rows, initialSort, rowKey, emptyText = 'Ei rivejä.', maxHeight = '65vh' }) {
  const [sort, setSort] = useState(initialSort ?? { key: columns[0].key, dir: 'desc' })

  const sorted = useMemo(() => {
    const column = columns.find((c) => c.key === sort.key)
    if (!column) return rows
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => {
      const av = column.value(a)
      const bv = column.value(b)
      const aEmpty = av === null || av === undefined || av === ''
      const bEmpty = bv === null || bv === undefined || bv === ''
      if (aEmpty && bEmpty) return 0
      if (aEmpty) return 1
      if (bEmpty) return -1
      if (typeof av === 'string' || typeof bv === 'string') {
        return String(av).localeCompare(String(bv), 'fi') * dir
      }
      return (av - bv) * dir
    })
  }, [rows, columns, sort])

  function toggle(key) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' }))
  }

  if (rows.length === 0) return <Empty>{emptyText}</Empty>

  return (
    <div className="overflow-auto border border-slate-200 rounded" style={{ maxHeight }}>
      <table className="w-full text-sm border-collapse">
        <thead className="sticky top-0 bg-slate-50 z-10">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                onClick={() => toggle(c.key)}
                style={c.width ? { width: c.width } : undefined}
                className={`px-3 py-2 font-medium text-slate-600 border-b border-slate-200 cursor-pointer select-none whitespace-nowrap ${
                  c.align === 'right' ? 'text-right' : 'text-left'
                } ${sort.key === c.key ? 'text-slate-900' : ''}`}
                title={c.title ?? 'Lajittele'}
              >
                {c.label}
                <span className="text-slate-400">{sort.key === c.key ? (sort.dir === 'asc' ? ' ▲' : ' ▼') : ''}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={rowKey(row)} className={i % 2 ? 'bg-slate-50/60' : ''}>
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={`px-3 py-1.5 border-b border-slate-100 ${
                    c.align === 'right' ? 'text-right tabular-nums whitespace-nowrap' : 'text-left'
                  } ${c.muted ? 'text-slate-500' : 'text-slate-900'}`}
                >
                  {c.render ? c.render(row) : (c.value(row) ?? EI_TIETOA)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
