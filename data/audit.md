# Lähdeauditointi — pistokoeraportti

Päivämäärä: 2026-08-11 (päivitetty täydennysajon jälkeen).

**Menetelmä:** 10 seuran otokselta — eri sarjatasoilta ja luotettavuusluokista —
listattiin ohjelmallisesti jokainen datan lukuarvo (perustamisvuosi, väkiluku,
stadionkapasiteetti, yleisökeskiarvo, FPF-sertifiointi, hintaindikaatio,
hinta-arvio) ja tarkistettiin, löytyykö sille vastaava lähdeviite seuran
`sources`-listasta. Etäisyys- ja koordinaattikentät on rajattu tarkastuksen
ulkopuolelle, koska ne ovat dokumentoitua kartta-päättelyä eivätkä
lähteistettyjä lukuja.

**Otos:** Académica (taso 2), SCU Torreense (taso 2), Varzim SC (taso 3),
CD Mafra (taso 3), SC Beira-Mar (taso 4), Vitória de Setúbal (taso 4),
Naval 1893 (taso 4), GD Lagoa (taso 4), JD Lajense (taso 4),
CD Celoricense (taso 4).

## Tulos

**46 lukuarvoa tarkistettu, 0 ilman lähdeviitettä.** Jokainen otoksen luku on
jäljitettävissä nimettyyn URL-lähteeseen. Otoksen seuroilla on 8–17
lähdeviitettä kullakin.

## Aiemmat löydökset ja niiden korjaus

1. **Hinta-arvioilta puuttui oma lähderivi** (ensimmäinen auditointi, 7 seuraa).
   Korjattu: arviot on nyt joko johdettu seuran omasta kauppaevidenssistä
   lähdeviitteineen tai ne ovat sarjatason tyyppihaarukka, jonka lähde osoittaa
   `data/price-basis.md`-aineiston keskeisimpään vertailukauppaan.
2. **`merge-research.mjs` korvasi `sources`-listan yhdistämisen sijaan.**
   Tämä havaittiin täydennysajossa: FPF-sertifiointeja tuonut agentti olisi
   pyyhkinyt 39 seuralta kaikki aiemmat lähdeviitteet, koska sen patch sisälsi
   vain yhden lähteen. Korjattu — lähdelistat, `sale.sources` ja
   `academy.notable_products` yhdistetään ja deduplikoidaan. Merge ajettiin
   uudelleen korjatulla logiikalla; lähteitä 1 134 (rikkinäisellä logiikalla
   niitä olisi jäänyt satoja vähemmän).

## Erikseen merkityt varaumat datassa

- **CD Feirensen FPF-sertifiointi** on kirjattu merkkijonona, jossa varauma on
  arvossa itsessään: luku perustuu seuran omaan ilmoitukseen (cdfeirense.pt),
  ei FPF:n viralliseen listaan.
- **Ristiriitaiset kapasiteettiluvut** on ratkaistu valitsemalla
  portugalilaislähde ja kirjaamalla ristiriita `stadium.notes`-kenttään
  (esim. AD Ponte da Barca 1 227 vs. 1 500; Real SC 1 200 vs. 3 500;
  SC Mineiro Aljustrelense 1 620 vs. 5 000).
- **Vitória de Setúbalin hinta-arvio** jätettiin tarkoituksella
  sarjatasohaarukkaan: löydetyt luvut (1,5 M€ pintaoikeus, 9,3 M€ velvoitteet,
  50 M€ stadionhanke) koskevat kiinteistö- ja velkajärjestelyjä, eivät seuran
  kauppahintaa.

## Rajoite

Ajoympäristön egress-proxy estää lähdesivujen avaamisen, joten URL-lähteiden
sisältöä ei voitu avata uudelleen ja verrata arvoihin rivi riviltä. Auditointi
kohdistui lähteiden olemassaoloon, `note`-kenttien kuvauksiin ja arvojen
sisäiseen johdonmukaisuuteen. Tutkimusagentit kirjasivat arvot samassa ajossa,
jossa lähteet luettiin (hakukoneen sisältöreferaattien kautta).

## Kokonaistilastot (93 seuraa)

- Lähdeviitteitä yhteensä: **1 134**
- Luotettavuus: korkea 52, keskitaso 41, matala 0
- Täyttöasteet: kaupunki, perustamisvuosi, koordinaatit, rannikkostatus,
  stadionin nimi ja akatemiatieto 93/93; väkiluku, stadionkapasiteetti ja
  omistusrakenne 90/93; stadionin omistus 82/93; FPF-sertifiointi 43/93;
  julkinen myyntisignaali 30/93; yleisökeskiarvo 1/93
- B-joukkueet (8) merkitty `acquirable: false` eikä niitä pisteytetä
- `npm run validate`: 0 virhettä, 0 varoitusta
