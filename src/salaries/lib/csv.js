// CSV-jäsennin. RFC 4180 -yhteensopiva: lainausmerkit, kaksinkertaiset lainausmerkit
// kentän sisällä, rivinvaihdot kentän sisällä, CRLF/LF/CR, BOM ja erottimen tunnistus.
// Ei riippuvuuksia — sama koodi toimii selaimessa ja Nodessa (testit).

export const DELIMITERS = [',', ';', '\t', '|']

export const DELIMITER_LABELS = {
  ',': 'pilkku ( , )',
  ';': 'puolipiste ( ; )',
  '\t': 'sarkain (tab)',
  '|': 'pystyviiva ( | )',
}

export function stripBom(text) {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
}

/**
 * Jakaa tekstin riveiksi ja kentiksi annetulla erottimella.
 * Palauttaa aina suorakulmaisen taulukon rivejä (string[][]), tyhjät rivit pois jätettynä.
 */
export function parseRows(text, delimiter) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  let i = 0

  const endField = () => {
    row.push(field)
    field = ''
  }
  const endRow = () => {
    endField()
    // Kokonaan tyhjä rivi (esim. tiedoston lopun rivinvaihto) jätetään pois.
    if (!(row.length === 1 && row[0].trim() === '')) rows.push(row)
    row = []
  }

  while (i < text.length) {
    const ch = text[i]

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 2
          continue
        }
        inQuotes = false
        i += 1
        continue
      }
      field += ch
      i += 1
      continue
    }

    if (ch === '"' && field === '') {
      inQuotes = true
      i += 1
      continue
    }
    if (ch === delimiter) {
      endField()
      i += 1
      continue
    }
    if (ch === '\r') {
      endRow()
      if (text[i + 1] === '\n') i += 2
      else i += 1
      continue
    }
    if (ch === '\n') {
      endRow()
      i += 1
      continue
    }

    field += ch
    i += 1
  }

  // Viimeinen kenttä/rivi ilman päättävää rivinvaihtoa.
  if (field !== '' || row.length > 0 || inQuotes) endRow()

  return rows
}

/**
 * Arvaa erottimen: jäsentää alun jokaisella ehdokkaalla ja valitsee sen, jolla
 * riveillä on eniten sarakkeita JA sarakemäärä on tasaisin.
 */
export function sniffDelimiter(text) {
  const sample = text.slice(0, 64 * 1024)
  let best = { delimiter: ',', score: -1 }

  for (const delimiter of DELIMITERS) {
    const rows = parseRows(sample, delimiter).slice(0, 25)
    if (rows.length === 0) continue

    const counts = rows.map((r) => r.length)
    const tally = new Map()
    for (const c of counts) tally.set(c, (tally.get(c) ?? 0) + 1)

    let mode = 1
    let modeHits = 0
    for (const [count, hits] of tally) {
      if (hits > modeHits || (hits === modeHits && count > mode)) {
        mode = count
        modeHits = hits
      }
    }
    if (mode < 2) continue

    const consistency = modeHits / counts.length
    const score = mode * consistency * consistency
    if (score > best.score) best = { delimiter, score }
  }

  return best.delimiter
}

function uniqueHeaders(raw) {
  const seen = new Map()
  return raw.map((h, idx) => {
    let name = String(h ?? '').trim()
    if (name === '') name = `sarake_${idx + 1}`
    const hits = seen.get(name) ?? 0
    seen.set(name, hits + 1)
    return hits === 0 ? name : `${name}_${hits + 1}`
  })
}

/**
 * Jäsentää CSV-tekstin otsikoiksi ja tietoriveiksi.
 * @returns {{delimiter: string, headers: string[], rows: string[][], warnings: string[]}}
 */
export function parseCsv(text, options = {}) {
  const clean = stripBom(String(text ?? ''))
  const delimiter = options.delimiter || sniffDelimiter(clean)
  const raw = parseRows(clean, delimiter)
  const warnings = []

  if (raw.length === 0) {
    return { delimiter, headers: [], rows: [], warnings: ['Tiedosto on tyhjä.'] }
  }

  const headers = uniqueHeaders(raw[0])
  const width = headers.length
  let ragged = 0

  const rows = raw.slice(1).map((r) => {
    if (r.length !== width) ragged += 1
    const out = r.slice(0, width).map((v) => v.trim())
    while (out.length < width) out.push('')
    return out
  })

  if (ragged > 0) {
    warnings.push(
      `${ragged} rivillä oli eri määrä sarakkeita kuin otsikkorivillä (${width}); ` +
        'ylimääräiset kentät jätettiin pois ja puuttuvat täytettiin tyhjinä.',
    )
  }
  if (rows.length === 0) warnings.push('Tiedostossa on vain otsikkorivi, ei tietorivejä.')

  return { delimiter, headers, rows, warnings }
}

/** Muodostaa CSV-tekstin taulukosta (otsikot + rivit). Käytetään vientiin. */
export function toCsv(headers, rows, delimiter = ';') {
  const esc = (v) => {
    const s = v === null || v === undefined ? '' : String(v)
    return /["\n\r]|[;,\t|]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s
  }
  const lines = [headers.map(esc).join(delimiter)]
  for (const row of rows) lines.push(row.map(esc).join(delimiter))
  return lines.join('\r\n')
}
