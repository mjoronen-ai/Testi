import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { TIER_COLORS, leagueLabel, fmt } from '../lib/format.js'

export default function MapView({ clubs, onSelect }) {
  const withCoords = clubs.filter((c) => c.coords?.lat != null && c.coords?.lng != null)
  const missing = clubs.length - withCoords.length

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex gap-4 items-center mb-3 text-xs text-slate-600 flex-wrap">
        {[2, 3, 4].map((t) => (
          <span key={t} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: TIER_COLORS[t] }} />
            Taso {t}
          </span>
        ))}
        {missing > 0 && (
          <span className="text-slate-400">({missing} seuraa ilman koordinaatteja ei näy kartalla)</span>
        )}
      </div>
      <MapContainer
        center={[39.6, -8.5]}
        zoom={7}
        style={{ height: '70vh', width: '100%' }}
        className="rounded"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {withCoords.map((c) => (
          <CircleMarker
            key={c.id}
            center={[c.coords.lat, c.coords.lng]}
            radius={c.tier === 2 ? 9 : c.tier === 3 ? 7 : 5}
            pathOptions={{
              color: TIER_COLORS[c.tier],
              fillColor: TIER_COLORS[c.tier],
              fillOpacity: c.acquirable ? 0.75 : 0.25,
              weight: 1.5,
            }}
          >
            <Popup>
              <strong>{c.name}</strong>
              <br />
              {leagueLabel(c)} · {fmt(c.city)}
              {!c.acquirable && (
                <>
                  <br />
                  <em>B-joukkue</em>
                </>
              )}
              <br />
              <button
                onClick={() => onSelect(c.id)}
                style={{ color: '#2563eb', textDecoration: 'underline', cursor: 'pointer', padding: 0, background: 'none', border: 'none' }}
              >
                Avaa seurakortti
              </button>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
