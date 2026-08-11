import {
  fmt,
  fmtNum,
  fmtBool,
  fmtEur,
  EI_TIETOA,
  SALE_LABELS,
  OWNER_LABELS,
  STRUCTURE_LABELS,
  CONFIDENCE_LABELS,
  leagueLabel,
} from '../lib/format.js'
import { investorScore, WEIGHT_LABELS } from '../lib/scoring.js'

function Row({ label, children }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 border-b border-slate-100 text-sm">
      <span className="text-slate-500 shrink-0">{label}</span>
      <span className="text-right">{children}</span>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="mb-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">{title}</h3>
      {children}
    </section>
  )
}

const CONF_COLORS = { high: 'bg-green-100 text-green-800', medium: 'bg-amber-100 text-amber-800', low: 'bg-red-100 text-red-800' }

export default function ClubCard({ club, weights, onClose }) {
  const c = club
  const score = investorScore(c, weights)

  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex justify-end" onClick={onClose}>
      <div
        className="bg-white w-full max-w-xl h-full overflow-y-auto p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-1">
          <h2 className="text-2xl font-bold">{c.name}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-2xl leading-none cursor-pointer">
            ×
          </button>
        </div>
        <p className="text-sm text-slate-600 mb-2">
          {leagueLabel(c)} · {fmt(c.city)} {c.district ? `(${c.district})` : ''}
        </p>
        <div className="flex gap-2 mb-4 flex-wrap">
          <span className={`text-xs rounded px-2 py-1 ${CONF_COLORS[c.confidence] ?? 'bg-slate-100'}`}>
            Luotettavuus: {CONFIDENCE_LABELS[c.confidence] ?? c.confidence}
          </span>
          {!c.acquirable && (
            <span className="text-xs rounded px-2 py-1 bg-slate-200 text-slate-700">
              B-joukkue — ei ostettavissa
            </span>
          )}
          {c.last_updated && (
            <span className="text-xs rounded px-2 py-1 bg-slate-100 text-slate-600">
              Päivitetty {c.last_updated}
            </span>
          )}
        </div>

        {c.acquirable && (
          <Section title="Sijoittajapisteet">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-3xl font-bold">
                {score.total !== null ? score.total : <span className="text-lg text-slate-400">{EI_TIETOA}</span>}
                {score.total !== null && <span className="text-sm font-normal text-slate-500"> / 100</span>}
              </p>
              {score.total !== null && (
                <p className="text-xs text-slate-500 mb-2">
                  Datakattavuus {Math.round(score.coverage * 100)} % painoista — pisteet normalisoitu
                  saatavilla olevista osista
                </p>
              )}
              {Object.entries(score.parts).map(([key, p]) => (
                <div key={key} className="flex justify-between text-sm py-0.5">
                  <span className="text-slate-600">
                    {WEIGHT_LABELS[key]} <span className="text-slate-400">({p.weight} %)</span>
                  </span>
                  <span>
                    {p.score !== null ? Math.round(p.score * 100) : <span className="text-slate-400">ei dataa</span>}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section title="Perustiedot">
          <Row label="Perustettu">{fmt(c.founded)}</Row>
          <Row label="Kaupunki">{fmt(c.city)}</Row>
          <Row label="Piiri">{fmt(c.district)}</Row>
          <Row label="Väkiluku">
            {fmtNum(c.city_population)}
            {c.city_population != null && c.city_population_kind ? ` (${c.city_population_kind})` : ''}
          </Row>
          <Row label="Rannikolla">{fmtBool(c.coastal)}</Row>
          <Row label="Etäisyys rannikolle">{c.coast_distance_km != null ? `${c.coast_distance_km} km` : EI_TIETOA}</Row>
          <Row label="Lähin suurkaupunki">
            {c.nearest_major_city ? `${c.nearest_major_city.name} (${c.nearest_major_city.distance_km} km)` : EI_TIETOA}
          </Row>
        </Section>

        <Section title="Stadion">
          <Row label="Nimi">{fmt(c.stadium?.name)}</Row>
          <Row label="Kapasiteetti">{fmtNum(c.stadium?.capacity)}</Row>
          <Row label="Omistus">{OWNER_LABELS[c.stadium?.owner ?? 'unknown']}</Row>
          {c.stadium?.notes && <p className="text-xs text-slate-600 mt-1">{c.stadium.notes}</p>}
        </Section>

        <Section title="Yleisö">
          <Row label={`Keskiarvo ${c.attendance?.season ?? ''}`}>{fmtNum(c.attendance?.average)}</Row>
        </Section>

        <Section title="Akatemia">
          <Row label="Akatemia olemassa">{fmtBool(c.academy?.exists)}</Row>
          <Row label="FPF-sertifiointi">
            {c.academy?.fpf_certification != null ? `${c.academy.fpf_certification} ★` : EI_TIETOA}
          </Row>
          {(c.academy?.notable_products ?? []).length > 0 && (
            <Row label="Tunnettuja kasvatteja">{c.academy.notable_products.join(', ')}</Row>
          )}
          {c.academy?.notes && <p className="text-xs text-slate-600 mt-1">{c.academy.notes}</p>}
        </Section>

        <Section title="Kilpailutilanne (30 km)">
          {c.competition?.computed ? (
            (c.competition.same_or_higher_tier_within_30km ?? []).length > 0 ? (
              <p className="text-sm">
                {c.competition.same_or_higher_tier_within_30km.join(', ')}
              </p>
            ) : (
              <p className="text-sm text-green-700">Ei samalla/ylemmällä tasolla pelaavia seuroja 30 km säteellä</p>
            )
          ) : (
            <p className="text-sm text-slate-400">{EI_TIETOA} (ei vielä laskettu)</p>
          )}
          {c.competition?.notes && <p className="text-xs text-slate-600 mt-1">{c.competition.notes}</p>}
        </Section>

        <Section title="Omistus">
          <Row label="Rakenne">{STRUCTURE_LABELS[c.ownership?.structure ?? 'unknown']}</Row>
          <Row label="Omistajat">{fmt(c.ownership?.owners)}</Row>
          <Row label="Ulkomainen sijoittaja">{fmtBool(c.ownership?.foreign_investor)}</Row>
          {c.ownership?.debt_or_insolvency_notes && (
            <p className="text-xs text-red-700 mt-1 bg-red-50 rounded p-2">
              Velka/maksukyky: {c.ownership.debt_or_insolvency_notes}
            </p>
          )}
        </Section>

        <Section title="Myyntitilanne">
          <Row label="Status">{SALE_LABELS[c.sale?.status ?? 'unknown']}</Row>
          <Row label="Hintaindikaatio">{fmtEur(c.sale?.price_indication_eur)}</Row>
          {c.sale?.notes && <p className="text-xs text-slate-600 mt-1">{c.sale.notes}</p>}
        </Section>

        <Section title="Hinta-arvio (ARVIO — ei vahvistettu tieto)">
          {c.estimated_price_eur?.low != null || c.estimated_price_eur?.high != null ? (
            <>
              <p className="text-sm font-medium bg-amber-50 border border-amber-200 rounded p-2">
                {fmtEur(c.estimated_price_eur?.low)} – {fmtEur(c.estimated_price_eur?.high)}
              </p>
              {c.estimated_price_eur?.basis && (
                <p className="text-xs text-slate-600 mt-1">Peruste: {c.estimated_price_eur.basis}</p>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-400">{EI_TIETOA}</p>
          )}
        </Section>

        <Section title={`Lähteet (${(c.sources ?? []).length})`}>
          {(c.sources ?? []).length === 0 ? (
            <p className="text-sm text-slate-400">Ei lähteitä kirjattuna</p>
          ) : (
            <ul className="text-xs space-y-1">
              {c.sources.map((s, i) => (
                <li key={i} className="break-all">
                  <span className="text-slate-500">[{s.field}]</span>{' '}
                  <a href={s.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    {s.url}
                  </a>{' '}
                  <span className="text-slate-400">({s.date})</span>
                  {s.note && <span className="text-slate-500"> — {s.note}</span>}
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  )
}
