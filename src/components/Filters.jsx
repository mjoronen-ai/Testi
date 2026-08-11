import { SALE_LABELS, OWNER_LABELS } from '../lib/format.js'

export const DEFAULT_FILTERS = {
  search: '',
  tiers: [2, 3, 4],
  series: 'all', // "all" | "Liga Portugal 2" | "Liga 3:A" | "Campeonato de Portugal:B" ...
  coastal: 'all', // all | yes | no
  sale: 'all',
  stadiumOwner: 'all',
  capacityMin: '',
  capacityMax: '',
  academyCert: 'all', // all | any | 3plus | none
  acquirableOnly: false,
}

export function applyFilters(clubs, f) {
  return clubs.filter((c) => {
    if (!f.tiers.includes(c.tier)) return false
    if (f.series !== 'all') {
      const key = c.series ? `${c.league}:${c.series}` : c.league
      if (key !== f.series) return false
    }
    if (f.coastal === 'yes' && c.coastal !== true) return false
    if (f.coastal === 'no' && c.coastal !== false) return false
    if (f.sale !== 'all' && (c.sale?.status ?? 'unknown') !== f.sale) return false
    if (f.stadiumOwner !== 'all' && (c.stadium?.owner ?? 'unknown') !== f.stadiumOwner) return false
    const cap = c.stadium?.capacity
    if (f.capacityMin !== '' && !(cap !== null && cap >= Number(f.capacityMin))) return false
    if (f.capacityMax !== '' && !(cap !== null && cap <= Number(f.capacityMax))) return false
    const cert = c.academy?.fpf_certification
    if (f.academyCert === 'any' && (cert === null || cert === undefined)) return false
    if (f.academyCert === '3plus' && !(Number(cert) >= 3)) return false
    if (f.academyCert === 'none' && cert !== null && cert !== undefined) return false
    if (f.acquirableOnly && !c.acquirable) return false
    if (f.search) {
      const q = f.search.toLowerCase()
      const hay = `${c.name} ${c.city ?? ''} ${c.district ?? ''}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
}

const SERIES_OPTIONS = [
  ['all', 'Kaikki sarjat'],
  ['Liga Portugal 2', 'Liga Portugal 2'],
  ['Liga 3:A', 'Liga 3 — A'],
  ['Liga 3:B', 'Liga 3 — B'],
  ['Campeonato de Portugal:A', 'CdP — A'],
  ['Campeonato de Portugal:B', 'CdP — B'],
  ['Campeonato de Portugal:C', 'CdP — C'],
  ['Campeonato de Portugal:D', 'CdP — D'],
]

function Select({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-slate-300 rounded px-2 py-1.5 text-sm bg-white text-slate-900"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  )
}

export default function Filters({ filters, setFilters, count, total }) {
  const set = (patch) => setFilters((f) => ({ ...f, ...patch }))

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 mb-4">
      <div className="flex flex-wrap gap-4 items-end">
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Haku
          <input
            type="text"
            placeholder="Seura, kaupunki…"
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
            className="border border-slate-300 rounded px-2 py-1.5 text-sm w-44"
          />
        </label>

        <div className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Sarjataso
          <div className="flex gap-1">
            {[2, 3, 4].map((t) => (
              <button
                key={t}
                onClick={() =>
                  set({
                    tiers: filters.tiers.includes(t)
                      ? filters.tiers.filter((x) => x !== t)
                      : [...filters.tiers, t],
                  })
                }
                className={`px-3 py-1.5 rounded text-sm border cursor-pointer ${
                  filters.tiers.includes(t)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <Select label="Sarja/lohko" value={filters.series} onChange={(v) => set({ series: v })} options={SERIES_OPTIONS} />
        <Select
          label="Rannikko"
          value={filters.coastal}
          onChange={(v) => set({ coastal: v })}
          options={[
            ['all', 'Kaikki'],
            ['yes', 'Rannikolla'],
            ['no', 'Sisämaassa'],
          ]}
        />
        <Select
          label="Myyntistatus"
          value={filters.sale}
          onChange={(v) => set({ sale: v })}
          options={[['all', 'Kaikki'], ...Object.entries(SALE_LABELS)]}
        />
        <Select
          label="Stadionin omistus"
          value={filters.stadiumOwner}
          onChange={(v) => set({ stadiumOwner: v })}
          options={[['all', 'Kaikki'], ...Object.entries(OWNER_LABELS)]}
        />
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Kapasiteetti min–max
          <div className="flex gap-1">
            <input
              type="number"
              value={filters.capacityMin}
              onChange={(e) => set({ capacityMin: e.target.value })}
              className="border border-slate-300 rounded px-2 py-1.5 text-sm w-20"
              placeholder="min"
            />
            <input
              type="number"
              value={filters.capacityMax}
              onChange={(e) => set({ capacityMax: e.target.value })}
              className="border border-slate-300 rounded px-2 py-1.5 text-sm w-20"
              placeholder="max"
            />
          </div>
        </label>
        <Select
          label="Akatemiasertifiointi"
          value={filters.academyCert}
          onChange={(v) => set({ academyCert: v })}
          options={[
            ['all', 'Kaikki'],
            ['any', 'Sertifioitu (FPF)'],
            ['3plus', '3+ tähteä'],
            ['none', 'Ei tietoa sertifioinnista'],
          ]}
        />
        <label className="flex items-center gap-2 text-sm text-slate-700 pb-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.acquirableOnly}
            onChange={(e) => set({ acquirableOnly: e.target.checked })}
          />
          Vain ostettavissa
        </label>
        <button
          onClick={() => setFilters(DEFAULT_FILTERS)}
          className="text-sm text-blue-600 hover:underline pb-1.5 cursor-pointer"
        >
          Tyhjennä
        </button>
      </div>
      <p className="text-xs text-slate-500 mt-3">
        {count} / {total} seuraa näkyvissä
      </p>
    </div>
  )
}
