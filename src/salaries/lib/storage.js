// Tietojen säilytys selaimen localStorageen: ladatut tiedostot pysyvät sivun
// päivityksen yli. Mitään ei lähetetä verkkoon — kaikki laskenta tapahtuu selaimessa.

import { serializeDataset } from './dataset.js'

const KEY = 'palkkadata.v1'

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.datasets)) return null
    return parsed
  } catch {
    return null
  }
}

/** @returns {{ok: boolean, error?: string}} — kiintiövirhe kerrotaan käyttäjälle. */
export function saveState(state) {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        datasets: state.datasets.map(serializeDataset),
        rates: state.rates,
        baseCurrency: state.baseCurrency,
      }),
    )
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error:
        'Tiedot eivät mahtuneet selaimen muistiin, joten niitä ei tallennettu sivun ' +
        'päivitystä varten. Sovellus toimii silti normaalisti tämän istunnon ajan. ' +
        `(${error?.name ?? 'virhe'})`,
    }
  }
}

export function clearState() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* selain voi estää tallennuksen esim. yksityisessä tilassa — ei kaada sovellusta */
  }
}
