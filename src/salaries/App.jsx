// Palkkadatan purkusovellus: CSV sisään, sarja- ja joukkuevertailut ulos.
// Kaikki data pysyy selaimessa (localStorage), mitään ei lähetetä verkkoon.

import { useEffect, useMemo, useState } from 'react'
import DataFiles from './components/DataFiles.jsx'
import Filters, { DEFAULT_FILTERS, applyFilters } from './components/Filters.jsx'
import Leagues from './components/Leagues.jsx'
import Overview from './components/Overview.jsx'
import Players from './components/Players.jsx'
import Teams from './components/Teams.jsx'
import Uploader from './components/Uploader.jsx'
import { Note, Panel } from './components/ui.jsx'
import { DEFAULT_RATES, buildDataset, materializeAll } from './lib/dataset.js'
import { colorScale } from './lib/palette.js'
import { byLeague, byTeam, withLeagueShare } from './lib/stats.js'
import { clearState, loadState, saveState } from './lib/storage.js'

const TABS = [
  ['overview', 'Yleiskuva'],
  ['leagues', 'Sarjat'],
  ['teams', 'Joukkueet'],
  ['players', 'Pelaajat'],
  ['files', 'Tiedostot'],
]

export default function App() {
  const saved = useMemo(() => loadState(), [])
  const [datasets, setDatasets] = useState(() => saved?.datasets ?? [])
  const [rates, setRates] = useState(() => ({ ...DEFAULT_RATES, ...(saved?.rates ?? {}) }))
  const [baseCurrency, setBaseCurrency] = useState(() => saved?.baseCurrency ?? 'EUR')
  const [tab, setTab] = useState('overview')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [storageError, setStorageError] = useState(null)

  useEffect(() => {
    if (datasets.length === 0) {
      clearState()
      setStorageError(null)
      return
    }
    const result = saveState({ datasets, rates, baseCurrency })
    setStorageError(result.ok ? null : result.error)
  }, [datasets, rates, baseCurrency])

  const { players, issues } = useMemo(
    () => materializeAll(datasets, rates, baseCurrency),
    [datasets, rates, baseCurrency],
  )

  // Väri seuraa sarjaa, ei sen sijoitusta: skaala lasketaan suodattamattomasta
  // datasta, joten suodatus ei maalaa jäljelle jääviä sarjoja uudelleen.
  const allLeagueNames = useMemo(() => byLeague(players).map((l) => l.league), [players])
  const color = useMemo(() => colorScale(allLeagueNames), [allLeagueNames])

  const filtered = useMemo(() => applyFilters(players, filters), [players, filters])
  const leagues = useMemo(() => byLeague(filtered), [filtered])
  const teams = useMemo(() => withLeagueShare(byTeam(filtered), leagues), [filtered, leagues])

  const seasons = useMemo(
    () => [...new Set(players.map((p) => p.season).filter(Boolean))].sort(),
    [players],
  )
  const positions = useMemo(
    () => [...new Set(players.map((p) => p.position).filter(Boolean))].sort(),
    [players],
  )
  const usedCurrencies = useMemo(
    () => [...new Set(players.map((p) => p.currency))].sort(),
    [players],
  )
  const playerCounts = useMemo(() => {
    const counts = {}
    for (const p of players) counts[p.datasetId] = (counts[p.datasetId] ?? 0) + 1
    return counts
  }, [players])

  function handleFiles(files) {
    const added = files.map((f) => buildDataset(f.name, f.text))
    setDatasets((current) => [...current, ...added])
    setTab((current) => (current === 'files' ? current : 'overview'))
  }

  function updateDataset(id, patch) {
    setDatasets((current) => current.map((d) => (d.id === id ? { ...d, ...patch } : d)))
  }

  function removeDataset(id) {
    setDatasets((current) => current.filter((d) => d.id !== id))
  }

  function clearAll() {
    setDatasets([])
    setFilters(DEFAULT_FILTERS)
  }

  function handleRateChange(currency, raw) {
    const value = Number(String(raw).replace(',', '.'))
    setRates((current) => ({ ...current, [currency]: Number.isFinite(value) && value > 0 ? value : current[currency] }))
  }

  const empty = datasets.length === 0

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-900 text-white px-6 py-4">
        <div className="flex items-start justify-between gap-4 max-w-screen-2xl mx-auto">
          <div>
            <h1 className="text-xl font-bold">Pelaajapalkkojen CSV-purkusovellus</h1>
            <p className="text-sm text-slate-300 mt-1">
              Lataa palkkatiedostoja eri sarjoista · vertaile sarjoja ja joukkueita ·
              tiedostot luetaan selaimessa, mitään ei lähetetä verkkoon
            </p>
          </div>
          <a href="./index.html" className="text-sm text-slate-300 hover:text-white underline shrink-0">
            Seuraportaali →
          </a>
        </div>
      </header>

      <nav className="bg-white border-b border-slate-200 px-6 flex gap-1">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            disabled={empty && key !== 'files'}
            className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              tab === key
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {label}
            {key === 'files' && datasets.length > 0 ? ` (${datasets.length})` : ''}
          </button>
        ))}
      </nav>

      <main className="p-6 max-w-screen-2xl mx-auto space-y-4">
        {storageError && <Note tone="warn">{storageError}</Note>}

        {empty ? (
          <div className="space-y-4">
            <Uploader onFiles={handleFiles} />
            <Ohje />
          </div>
        ) : (
          <>
            {tab !== 'files' && (
              <Filters
                filters={filters}
                setFilters={setFilters}
                leagues={allLeagueNames}
                seasons={seasons}
                positions={positions}
                shown={filtered.length}
                total={players.length}
                color={color}
              />
            )}

            {tab === 'overview' && (
              <Overview players={filtered} leagues={leagues} teams={teams} baseCurrency={baseCurrency} color={color} />
            )}
            {tab === 'leagues' && <Leagues leagues={leagues} baseCurrency={baseCurrency} color={color} />}
            {tab === 'teams' && (
              <Teams teams={teams} leagues={leagues} baseCurrency={baseCurrency} color={color} />
            )}
            {tab === 'players' && (
              <Players players={filtered} leagues={leagues} baseCurrency={baseCurrency} color={color} />
            )}
            {tab === 'files' && (
              <DataFiles
                datasets={datasets}
                issues={issues}
                playerCounts={playerCounts}
                onFiles={handleFiles}
                onUpdate={updateDataset}
                onRemove={removeDataset}
                onClearAll={clearAll}
                rates={rates}
                onRateChange={handleRateChange}
                onResetRates={() => setRates(DEFAULT_RATES)}
                baseCurrency={baseCurrency}
                onBaseCurrencyChange={setBaseCurrency}
                usedCurrencies={usedCurrencies}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}

function Ohje() {
  return (
    <Panel title="Millainen tiedosto kelpaa?">
      <div className="text-sm text-slate-700 space-y-3">
        <p>
          Mikä tahansa CSV, jossa on ainakin <strong>joukkue</strong> ja <strong>palkka</strong>.
          Otsikkorivi tunnistetaan automaattisesti suomeksi, englanniksi ja ruotsiksi — ja
          sarakekartan voi aina korjata käsin Tiedostot-välilehdellä.
        </p>
        <pre className="bg-slate-50 border border-slate-200 rounded p-3 text-xs overflow-auto">
{`Pelaaja;Joukkue;Sarja;Pelipaikka;Ikä;Vuosipalkka;Valuutta
Mikko Virtanen;FC Esimerkki;Esimerkkiliiga;Hyökkääjä;27;145 000;EUR
Ali Hassan;FC Esimerkki;Esimerkkiliiga;Puolustaja;24;98 500;EUR`}
        </pre>
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li>Erotin (pilkku, puolipiste, sarkain, pystyviiva) tunnistetaan automaattisesti.</li>
          <li>
            Luvut kelpaavat monessa muodossa: <code>145 000</code>, <code>145.000,50</code>,
            <code> 1,2 M€</code>, <code>£45k</code>.
          </li>
          <li>
            Viikko- tai kuukausipalkat muunnetaan vuositasolle ja eri valuutat perusvaluuttaan,
            jotta sarjat ovat vertailukelpoisia.
          </li>
          <li>Jos tiedostossa ei ole sarjasaraketta, tiedoston nimestä tulee sarjan nimi.</li>
        </ul>
      </div>
    </Panel>
  )
}
