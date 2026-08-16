// Suodattimet yhdellä rivillä sisällön yläpuolella. Vaikuttavat kaikkiin näkymiin,
// jotta luvut ja kuvaajat kertovat aina samasta joukosta.

import { Button, Select, TextInput } from './ui.jsx'
import { num } from '../lib/format.js'

export const DEFAULT_FILTERS = { leagues: [], season: '', position: '', search: '' }

export function applyFilters(players, filters) {
  const search = filters.search.trim().toLowerCase()
  return players.filter((p) => {
    if (filters.leagues.length > 0 && !filters.leagues.includes(p.league)) return false
    if (filters.season && p.season !== filters.season) return false
    if (filters.position && p.position !== filters.position) return false
    if (search) {
      const haystack = `${p.player} ${p.team} ${p.league} ${p.nationality}`.toLowerCase()
      if (!haystack.includes(search)) return false
    }
    return true
  })
}

export default function Filters({ filters, setFilters, leagues, seasons, positions, shown, total, color }) {
  const active =
    filters.leagues.length > 0 || filters.season || filters.position || filters.search.trim() !== ''

  function toggleLeague(league) {
    setFilters((f) => ({
      ...f,
      leagues: f.leagues.includes(league)
        ? f.leagues.filter((l) => l !== league)
        : [...f.leagues, league],
    }))
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 mb-4">
      <div className="flex flex-wrap items-end gap-3">
        <TextInput
          label="Haku (pelaaja, joukkue, maa)"
          value={filters.search}
          onChange={(search) => setFilters((f) => ({ ...f, search }))}
          placeholder="esim. Virtanen"
          className="w-56"
        />
        {seasons.length > 1 && (
          <Select
            label="Kausi"
            value={filters.season}
            onChange={(season) => setFilters((f) => ({ ...f, season }))}
            options={[{ value: '', label: 'Kaikki kaudet' }, ...seasons.map((s) => ({ value: s, label: s }))]}
          />
        )}
        {positions.length > 1 && (
          <Select
            label="Pelipaikka"
            value={filters.position}
            onChange={(position) => setFilters((f) => ({ ...f, position }))}
            options={[
              { value: '', label: 'Kaikki pelipaikat' },
              ...positions.map((p) => ({ value: p, label: p })),
            ]}
          />
        )}
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-slate-500">
            {shown === total
              ? `${num(total)} pelaajaa`
              : `${num(shown)} / ${num(total)} pelaajaa suodatuksen jälkeen`}
          </span>
          {active && (
            <Button onClick={() => setFilters(DEFAULT_FILTERS)}>Tyhjennä suodattimet</Button>
          )}
        </div>
      </div>

      {leagues.length > 1 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {leagues.map((league) => {
            const on = filters.leagues.includes(league)
            return (
              <button
                key={league}
                type="button"
                onClick={() => toggleLeague(league)}
                className={`text-xs px-2.5 py-1 rounded-full border cursor-pointer flex items-center gap-1.5 ${
                  on ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color(league) }} />
                {league}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
