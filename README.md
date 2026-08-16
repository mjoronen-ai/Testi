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

Projektissa on kaksi erillistä sovellusta samalla dev-palvelimella:

| Sivu | Osoite | Mitä tekee |
|------|--------|------------|
| Seuraportaali | `/index.html` | Portugalin sarjatasojen 2–4 seuradata (tämä dokumentti) |
| Palkkadatan purkusovellus | `/palkat.html` | Omien CSV-palkkatiedostojen purku ja sarja-/joukkuevertailut ([ohje alempana](#palkkadatan-purkusovellus-palkathtml)) |

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

## Palkkadatan purkusovellus (`/palkat.html`)

Erillinen sovellus, johon voi ladata omia CSV-tiedostoja eri sarjojen
pelaajapalkoista ja verrata sarjoja ja joukkueita keskenään. **Tiedostot
luetaan selaimessa — mitään ei lähetetä verkkoon** eikä palvelinta tarvita.
Ladatut tiedostot säilyvät selaimen localStoragessa sivun päivityksen yli.

### Mitä tiedostolta vaaditaan

Vain kaksi asiaa: **joukkue** ja **palkka**. Muut sarakkeet (pelaaja, sarja,
pelipaikka, ikä, kansallisuus, kausi, valuutta, sopimuksen päättyminen) ovat
vapaaehtoisia ja rikastavat vertailuja.

Automaattisesti tunnistetaan:

- **Erotin**: pilkku, puolipiste, sarkain tai pystyviiva.
- **Otsikot** suomeksi, englanniksi ja ruotsiksi (`Vuosipalkka`, `Weekly Wage`,
  `Månadslön`, `Joukkue`, `Club`, `Lag`, …). Tunnistus on ehdotus, jonka voi
  korjata käsin Tiedostot-välilehdellä.
- **Lukumuodot**: `145 000`, `145.000,50`, `1,234.56`, `£45k`, `1,2 M€`, `(500)`.
- **Valuutta** solusta (`£`, `€`, `SEK`) tai omasta sarakkeestaan.
- **Palkkajakso** otsikosta (viikko/kuukausi/vuosi) — kaikki muunnetaan
  vuositasolle ja perusvaluuttaan, jotta sarjat ovat vertailukelpoisia.
- **Merkistö**: UTF-8, ja jos siitä tulee korvausmerkkejä, Windows-1252.

Jos tiedostossa ei ole sarjasaraketta, tiedoston nimestä tulee sarjan nimi.
Rivit, joilta palkka puuttuu, näkyvät pelaajamäärässä mutta eivät palkka-
tilastoissa — puuttuvien määrä raportoidaan Tiedostot-välilehdellä.

### Näkymät

1. **Yleiskuva** — palkkasumma, mediaani, sarjojen ja joukkueiden määrä,
   sarjojen palkkasummat ja mediaanit, top 10 -pelaajat, palkkojen jakauma.
2. **Sarjat** — valittava mittari pylväinä (palkkasumma, keskiarvo, mediaani,
   joukkuebudjetin mediaani, rikkaimman ja köyhimmän joukkueen ero, Gini) sekä
   kaikki tunnusluvut taulukkona.
3. **Joukkueet** — joukkueiden vertailu sarjojen sisällä ja välillä, osuus
   sarjan palkkasummasta, palkkaerot joukkueen sisällä.
4. **Pelaajat** — koko rivistö haettavana ja lajiteltavana, mediaanipalkka
   pelipaikoittain.
5. **Tiedostot** — sarakekartan korjaus, oletusarvot, esikatselu, valuutta-
   kurssit ja tiedostojen poisto.

Jokaisesta taulukosta saa CSV-viennin (puolipiste-erotin ja desimaalipilkku,
aukeaa suomalaisessa Excelissä sellaisenaan).

### Valuuttakurssit

Kurssit ovat **käsin syötettäviä oletusarvoja**, eivät päivän kursseja — sovellus
ei hae mitään verkosta. Ne on tarkoitettu muokattaviksi Tiedostot-välilehdellä,
ja perusvaluutan voi vaihtaa. Muunnos: alkuperäinen palkka → vuositaso →
perusvaluutta.

### Esimerkkidata ja testit

```bash
npm test        # ytimen testit: CSV-jäsennys, lukumuodot, tunnistus, tilastot
npm run samples # luo esimerkkitiedostot uudelleen public/esimerkkidata/-kansioon
```

Sovelluksen "Lataa esimerkkidata" -painike lataa kolme **kuvitteellista**
tiedostoa (`public/esimerkkidata/`), joissa on tarkoituksella eri muodot:
suomalainen pilkkuerotettu vuosipalkka euroina, ruotsalainen puolipiste-
erotettu kuukausipalkka kruunuina ja englantilainen viikkopalkka punnissa.
Seurat, pelaajat ja palkat ovat keksittyjä eivätkä vastaa mitään todellista
sarjaa; ne on luotu `scripts/generate-sample-salaries.mjs`-skriptillä.

### Kuvaajien värit

Kuvaajat noudattavat yhtä kategorista väriskaalaa: väri seuraa sarjaa, ei sen
sijoitusta, joten suodatus ei maalaa jäljelle jääviä sarjoja uudelleen. Skaala
on validoitu värinäkörajoitteiden erottuvuudelle, ja jokainen pylväs on myös
suoraan arvomerkitty — väri ei ole ainoa tiedon kantaja. Yli kahdeksan sarjan
jälkeen loput saavat neutraalin "Muut"-värin; uusia sävyjä ei generoida.

## Rakenne

```
data/                    seuradata, schema, gapit, auditointi
public/esimerkkidata/    palkkasovelluksen kuvitteelliset esimerkkitiedostot
scripts/                 seed, merge, kilpailutilanne, validointi, tutkimusohje
                         + generate-sample-salaries.mjs, test-salaries.mjs
index.html               seuraportaali
palkat.html              palkkadatan purkusovellus
src/
  App.jsx                seuraportaalin näkymät ja suodatintila
  components/            Filters, ClubTable, ClubCard, Compare, MapView, Ranking
  lib/                   scoring.js (pisteytys), format.js (fi-muotoilut)
  salaries/
    App.jsx              palkkasovelluksen tila: tiedostot, suodattimet, välilehdet
    components/          Uploader, DataFiles, Filters, Overview, Leagues,
                         Teams, Players, ui.jsx, charts/
    lib/                 csv.js (jäsennin), numbers.js (lukumuodot),
                         schema.js (sarakkeiden tunnistus), dataset.js
                         (normalisointi), stats.js, export.js, storage.js
```
