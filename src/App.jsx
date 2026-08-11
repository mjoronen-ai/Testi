import { useMemo, useState } from 'react'
import clubsData from '../data/clubs.json'
import Filters, { applyFilters, DEFAULT_FILTERS } from './components/Filters.jsx'
import ClubTable from './components/ClubTable.jsx'
import ClubCard from './components/ClubCard.jsx'
import Compare from './components/Compare.jsx'
import MapView from './components/MapView.jsx'
import Ranking from './components/Ranking.jsx'
import { DEFAULT_WEIGHTS } from './lib/scoring.js'

const TABS = [
  ['list', 'Seuralista'],
  ['ranking', 'Ranking'],
  ['compare', 'Vertailu'],
  ['map', 'Kartta'],
]

export default function App() {
  const [tab, setTab] = useState('list')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [selectedId, setSelectedId] = useState(null)
  const [compareIds, setCompareIds] = useState([])
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS)

  const clubs = clubsData
  const filtered = useMemo(() => applyFilters(clubs, filters), [clubs, filters])
  const selected = clubs.find((c) => c.id === selectedId) ?? null

  function toggleCompare(id) {
    setCompareIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : ids.length >= 4 ? ids : [...ids, id],
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-900 text-white px-6 py-4">
        <h1 className="text-xl font-bold">Portugalin sarjatasojen 2–4 sijoittajaportaali</h1>
        <p className="text-sm text-slate-300 mt-1">
          Kausi 2026/27 · {clubs.length} seuraa · pelaajakehitys- ja siirtovoittoteesi · tiedon
          kokoamis- ja vertailutyökalu, ei sijoitussuositus
        </p>
      </header>

      <nav className="bg-white border-b border-slate-200 px-6 flex gap-1">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px cursor-pointer ${
              tab === key
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {label}
            {key === 'compare' && compareIds.length > 0 ? ` (${compareIds.length})` : ''}
          </button>
        ))}
      </nav>

      <main className="p-6 max-w-screen-2xl mx-auto">
        {tab !== 'compare' && (
          <Filters filters={filters} setFilters={setFilters} count={filtered.length} total={clubs.length} />
        )}

        {tab === 'list' && (
          <ClubTable
            clubs={filtered}
            weights={weights}
            onSelect={setSelectedId}
            compareIds={compareIds}
            onToggleCompare={toggleCompare}
          />
        )}
        {tab === 'ranking' && (
          <Ranking clubs={filtered} weights={weights} setWeights={setWeights} onSelect={setSelectedId} />
        )}
        {tab === 'compare' && (
          <Compare
            clubs={clubs}
            compareIds={compareIds}
            onToggleCompare={toggleCompare}
            weights={weights}
          />
        )}
        {tab === 'map' && <MapView clubs={filtered} onSelect={setSelectedId} />}
      </main>

      {selected && (
        <ClubCard club={selected} weights={weights} onClose={() => setSelectedId(null)} />
      )}
    </div>
  )
}
