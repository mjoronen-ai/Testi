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
- `data/gaps.md` — kaikki puuttuvat/epävarmat tiedot perusteluineen.
- `data/audit.md` — lähdeauditoinnin pistokoeraportti.

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
  `basis`-kenttä kertoo perusteen. Hinta-arvio on annettu vain seuroille,
  joilta löytyi seurakohtaista evidenssiä (toteutunut kauppa tai uutisoitu
  hintapyyntö).
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
```

### Tunnettu täydennystarve (11.8.2026 ajon jäljiltä)

Ensimmäisen tutkimusajon aikana session web-hakukiintiö (200 hakua) täyttyi
ja ajoympäristön egress-proxy esti suorat haut lähdesivustoille (Wikipedia,
zerozero.pt, fpf.pt, Transfermarkt, pt-uutissivustot). Siksi puuttuu erityisesti:

- **CdP-seurojen (taso 4)** stadion-, omistus-, akatemia- ja väkilukutiedot
  (maantiede ja kaupungit on kerätty),
- **yleisökeskiarvot** kaikilta seuroilta (Transfermarkt),
- **FPF Entidades Formadoras -sertifioinnit** (fpf.pt),
- **sarjatasokohtainen hintahaarukka** (vertailukauppa-analyysi),
- 8 tason 2–3 seuran täydellinen tutkimus (mm. SC Farense, SCU Torreense,
  Sporting CP B, União de Leiria, Caldas SC, GD Vitória de Sernache,
  Louletano DC, Lusitano GC).

Täydennys: aja uudessa sessiossa (tai nostetulla
`CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`-arvolla) komento tyyliin:

> Lue scripts/research-club.md ja data/gaps.md. Täydennä puuttuvat tiedot
> Campeonato de Portugal -seurille sekä gaps-listan tason 2–3 seuroille,
> yhdistä merge-research.mjs:llä ja aja competition + validate.

## Rakenne

```
data/            seuradata, schema, gapit, auditointi
scripts/         seed, merge, kilpailutilanne, validointi, tutkimusohje
src/
  App.jsx        näkymät ja suodatintila
  components/    Filters, ClubTable, ClubCard, Compare, MapView, Ranking
  lib/           scoring.js (pisteytys), format.js (fi-muotoilut)
```
