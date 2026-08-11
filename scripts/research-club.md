# Tutkimusohje: yhden seuran tai sarjan datan päivitys

Tämä on ohje/promptipohja Claude Codelle (tai ihmistutkijalle) yksittäisen seuran
tai kokonaisen sarjan tietojen päivittämiseen. Sama prosessi, jolla data on
alun perin koottu.

## Käyttö Claude Codella

Anna Claude Codelle komento, esim.:

> Päivitä seuran `varzim-sc` tiedot: tee alla olevan tutkimusohjeen mukainen
> web-tutkimus (scripts/research-club.md), kirjoita tulos osittaisena
> seuraobjektina tiedostoon /tmp/paivitys.json ja aja
> `node scripts/merge-research.mjs /tmp/paivitys.json`,
> sitten `npm run competition` ja `npm run validate`.

Kokonaiselle sarjalle: "Päivitä kaikki Liga 3 Série A -seurat…" jne.

## Tutkimusprosessi per seura

Hae seuraavassa järjestyksessä (kirjaa jokainen käytetty URL + päivämäärä `sources`-listaan):

1. **Wikipedia (pt + en)** — seurasivu ja kausisivu: perustamisvuosi, kaupunki,
   piiri (distrito), stadion + kapasiteetti, tunnetut kasvatit.
2. **zerozero.pt** — seurasivu: stadion, kapasiteetti, kaupunki (kattavin
   portugalilaislähde, kattaa myös tason 4).
3. **Transfermarkt** — yleisökeskiarvo kaudelta 2025-26 (taso 2 kattava,
   taso 3 osittainen, taso 4 yleensä puuttuu → `null`).
4. **FPF (fpf.pt)** — "Entidades Formadoras" -sertifiointilista → akatemian
   tähtiluokitus (1–5) kenttään `academy.fpf_certification`.
5. **Uutishaut** (portugaliksi) omistus- ja myyntitilanteesta:
   - `"<seura>" SAD venda investidor`
   - `"<seura>" SAD acionistas`
   - `"<seura>" insolvência OR PER`
6. **Väkiluku** — INE tai Wikipedia; merkitse `city_population_kind`-kenttään
   kumpaa luku tarkoittaa (`municipio` vai `cidade`).
7. **Rannikko + etäisyydet** — kartta-/koordinaattipäättely: `coastal`,
   `coast_distance_km`, `nearest_major_city`, `coords` (kaupungin keskusta tai
   stadion riittää).

## Säännöt

- **Älä koskaan keksi lukua.** Ei löydy → `null` + rivi `data/gaps.md`-tiedostoon.
- Jokaiselle ei-triviaalille kentälle lähde: `sources`-listaan objekti
  `{ "field": "stadium.capacity", "url": "…", "date": "2026-08-11", "note": "" }`.
- `sale.status`-oletus on `unknown`. `for_sale`/`seeking_investors` vain jos
  julkinen lähde tukee — kirjaa lähde myös `sale.sources`-listaan.
- `estimated_price_eur` on aina arvio: kirjaa `basis`-kenttään peruste
  (vertailukaupat, uutisoitu hintapyyntö, sarjatason tyyppihaarukka).
- B-joukkueet: `acquirable: false`.
- Päivitä `last_updated` (YYYY-MM-DD) ja `confidence`
  (`high` = keskeiset kentät useasta lähteestä, `medium` = osa yhdestä
  lähteestä, `low` = merkittäviä aukkoja).
- Kunnioita robots.txt:tä, pidä hakutahti maltillisena. Estetty sivusto →
  kirjaus gaps-tiedostoon ja eteenpäin.

## Tulosmuoto

Osittainen seuraobjekti (vain tutkitut kentät; `id` pakollinen), taulukossa:

```json
[
  {
    "id": "varzim-sc",
    "city": "Póvoa de Varzim",
    "stadium": { "name": "…", "capacity": 7280, "owner": "club" },
    "sources": [{ "field": "stadium", "url": "…", "date": "2026-08-11" }],
    "last_updated": "2026-08-11",
    "confidence": "high"
  }
]
```

Yhdistäminen: `node scripts/merge-research.mjs <tiedosto.json>` — null ei koskaan
ylikirjoita aiempaa tutkittua arvoa; taulukot (esim. `sources`) korvataan
kokonaan, joten sisällytä patchiin koko päivitetty `sources`-lista jos muutat sitä.

Lopuksi: `npm run competition` (kilpailutilanne uusiksi koordinaateista) ja
`npm run validate` (rakenne + lähdevaroitukset).
