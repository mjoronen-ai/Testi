# Portugalin sarjatasojen 2–4 sijoittajaportaali

Paikallisesti ajettava web-portaali, joka kokoaa kaikista Portugalin
sarjatasojen 2–4 seuroista (kausi 2026/27) julkisesti saatavilla olevan
sijoittajadatan yhteen selailtavaan näkymään. **Tiedon kokoamis- ja
vertailutyökalu — ei sijoitussuositus.**

Sijoittajan teesi, jota data palvelee: pelaajakehitys ja siirtovoitot
(akatemiavetoinen "selling club" -malli), painotus rannikkokaupungeissa.

## Käynnistys

```bash
npm install
npm run dev
```

Avaa selaimessa osoite, jonka Vite tulostaa (oletus http://localhost:5173).
Karttanäkymä lataa OpenStreetMap-laattoja verkosta; muut näkymät toimivat
ilman verkkoyhteyttä.

## Sisältö

- **93 seuraa**: Liga Portugal 2 (18), Liga 3 (20, lohkot A/B),
  Campeonato de Portugal (55, lohkot A–D + 1 avoin paikka, ks. `data/gaps.md`).
  B-joukkueet (8 kpl) ovat mukana kilpailutilanteen ymmärtämiseksi, mutta
  merkitty `acquirable: false` eikä niitä pisteytetä.
- Sarjakokoonpanot on vahvistettu web-tutkimuksella 11.8.2026 vähintään
  kahdesta riippumattomasta lähteestä (ks. `data/cdp-groups.json`).

## Näkymät

1. **Seuralista** — valittavat sarakkeet, lajittelu mistä tahansa sarakkeesta,
   suodattimet (sarjataso, lohko, rannikko, myyntistatus, stadionin omistus,
   kapasiteettihaarukka, akatemiasertifiointi, ostettavuus, tekstihaku).
   Suodattimet vaikuttavat myös karttaan ja rankingiin.
2. **Seurakortti** — kaikki kentät, lähdelinkit, luotettavuusmerkintä
   (confidence), puuttuva tieto näytetään aina tekstinä "ei tietoa".
3. **Vertailu** — 2–4 seuraa rinnakkain (valinta listan ✓-sarakkeesta tai
   vertailunäkymän pudotusvalikosta).
4. **Kartta** — Leaflet + OpenStreetMap, väri sarjatason mukaan, himmennetty
   piste = B-joukkue.
5. **Ranking** — sijoittajapisteet 0–100, painot säädettävissä liukusäätimillä.

## Sijoittajapisteytys

Lasketaan vain seuroille, joilla `acquirable: true`. Oletuspainot:
akatemia 30 %, markkina 25 %, stadion 20 %, kilpailutilanne 15 %,
ostettavuus 10 % (`src/lib/scoring.js`).

Puuttuva data ei nollaa pistettä hiljaisesti: osapisteen kohdalla näytetään
"ei dataa" ja kokonaispiste normalisoidaan saatavilla olevien osien painoilla.
Datakattavuus (% painoista) näytetään rankingissa ja seurakortissa —
matalan kattavuuden pisteisiin tulee suhtautua varauksella.

## Data

- `data/clubs.json` — kaikki seuradata (schema: `data/schema.json`).
- `data/cdp-groups.json` — CdP:n 2026/27-lohkojaot lähteineen.
- `data/primeira.json` — Primeira Ligan 18 seuraa koordinaatteineen
  (käytetään vain 30 km kilpailutilanneanalyysiin).
- `data/gaps.md` — kaikki puuttuvat/epävarmat tiedot perusteluineen
  (generoitu `scripts/generate-gaps.mjs`-skriptillä).
- `data/audit.md` — lähdeauditoinnin pistokoeraportti.
- `data/price-basis.md` — 23 julkista SAD-vertailukauppaa 2019–2026 lähteineen
  ja niistä johdettu sarjatasokohtainen hintahaarukka.

### Datan kattavuus (11.8.2026)

Kaikilta 93 seuralta on kaupunki, perustamisvuosi, koordinaatit, rannikkostatus,
stadionin nimi ja tieto akatemian olemassaolosta. Väkiluku, stadionkapasiteetti
ja omistusrakenne 90/93, stadionin omistus 82/93, FPF-sertifiointi 43/93,
julkinen myyntisignaali 30/93. Lähdeviitteitä 1 134; luotettavuus korkea 52 /
keskitaso 41 / matala 0. Yleisökeskiarvot puuttuvat lähes kokonaan (1/93),
koska Transfermarkt on estetty ajoympäristössä.

Periaatteet:

- **Yhtään lukua ei ole keksitty.** Jokainen luku on joko jäljitettävissä
  `sources`-listan URL-lähteeseen tai kenttä on `null` ja syy kirjattu
  `data/gaps.md`-tiedostoon.
- Maantiede (koordinaatit, rannikkostatus, etäisyydet) on kartta-/
  koordinaattipäättelyä, joka on tehtävänannossa sallittu menetelmä.
  Rannikkokriteeri: kaupunki Atlantin rannalla tai suurten suistojen
  (Tejo/Sado) rantakaupunki Lissabonin/Setúbalin alueella;
  `coast_distance_km` on etäisyys avomerelle.
- `estimated_price_eur` on aina arvio ja merkitty UI:ssa arvioksi;
  `basis`-kenttä kertoo perusteen. Arvio on joko **seurakohtainen** (toteutunut
  kauppa tai uutisoitu hintapyyntö, 9 seuraa) tai **sarjatason tyyppihaarukka**
  (76 seuraa) — UI erottaa nämä toisistaan. Haarukat: taso 2 noin 5–10 M€,
  taso 3 noin 1,5–3 M€, taso 4 noin 0,15–0,6 M€ SAD-enemmistöstä. Perusteet ja
  vertailukaupat: `data/price-basis.md`.
- `confidence`: high = keskeiset kentät useasta luotettavasta lähteestä,
  medium = osittain, low = merkittäviä aukkoja.

## Datan päivitys ja täydennys

Yksittäisen seuran tai sarjan päivitys: ks. **`scripts/research-club.md`**
(promptipohja Claude Codelle + säännöt). Työkalut:

```bash
node scripts/merge-research.mjs <patch.json>  # yhdistä tutkimustulos dataan
npm run competition                            # kilpailutilanne uusiksi
npm run validate                               # rakenne- ja lähdetarkistus
npm run seed                                   # lisää puuttuvat seurat (ei ylikirjoita)
node scripts/apply-price-bands.mjs             # sarjatason hintahaarukat
node scripts/generate-gaps.mjs [gaps.json...]  # gaps.md uusiksi datasta
```

Web-hakujen sessiokiintiö on nostettu projektiasetuksissa
(`.claude/settings.json`: `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`), koska
oletusarvo 200 ei riitä koko sarjatason tutkimiseen.

### Tunnettu täydennystarve

Jäljellä olevat aukot on lueteltu seuratasolla `data/gaps.md`-tiedostossa.
Merkittävimmät:

- **Yleisökeskiarvot** puuttuvat lähes kaikilta (Transfermarkt ja varalähteet
  estetty ajoympäristön egress-proxyssä). Vaatii ympäristön, jossa
  transfermarkt.com on saavutettavissa.
- **FPF-sertifioinnit** 50 seuralta (fpf.pt estetty; löydetyt tulivat
  seurakohtaisista lähteistä).
- **Stadionin omistus** 11 seuralta ja väkiluku, kapasiteetti tai
  omistusrakenne kolmelta seuralta — nämä on lueteltu nimeltä gaps-raportissa.

Täydennys: aja komento tyyliin

> Lue scripts/research-club.md ja data/gaps.md. Täydennä gaps-raportissa
> nimetyt puuttuvat kentät, yhdistä merge-research.mjs:llä ja aja
> competition + validate + generate-gaps.

## Rakenne

```
data/            seuradata, schema, gapit, auditointi
scripts/         seed, merge, kilpailutilanne, validointi, tutkimusohje
src/
  App.jsx        näkymät ja suodatintila
  components/    Filters, ClubTable, ClubCard, Compare, MapView, Ranking
  lib/           scoring.js (pisteytys), format.js (fi-muotoilut)
```
