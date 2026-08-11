# Lähdeauditointi — pistokoeraportti

Päivämäärä: 2026-08-11. Menetelmä: 10 seuran otokselta (eri sarjatasot ja
confidence-luokat) listattiin ohjelmallisesti jokainen datan lukuarvo ja
tarkistettiin, että sille löytyy `sources`-listasta lähdeviite tai että kyse
on dokumentoidusta karttapäättelystä (etäisyydet). Lisäksi käytiin käsin läpi
lähdeviitteiden note-kentät ja arvojen vastaavuus.

**Otos:** Académica, AD Fafe, Varzim SC, CD Feirense, GD Chaves, Leixões SC,
CD Trofense, USC Paredes (tasot 2–3, high confidence), Vitória de Setúbal ja
SC Farense (low confidence -verrokit).

## Tulokset

- Kaikilla high confidence -otosseuroilla jokainen lukuarvo (perustamisvuosi,
  väkiluku, stadionkapasiteetti, hintaindikaatiot) jäljittyi nimettyyn
  URL-lähteeseen; etäisyyskentät ovat dokumentoitua karttapäättelyä.
- Low confidence -verrokit (V. Setúbal, Farense) eivät sisällä yhtään
  lukuarvoa ilman lähdettä — puuttuvat tiedot ovat `null` ja syyt kirjattu
  `data/gaps.md`-tiedostoon. ✓
- **Löydös ja korjaus:** seitsemällä seuralla `estimated_price_eur`-haarukalta
  puuttui oma lähderivi, vaikka arvio johdettiin seuran `sale`-kentän
  kauppaevidenssistä (peruste `basis`-kentässä). Korjattu 11.8.2026 lisäämällä
  arvioille lähdeviite sale-evidenssin URL:iin.
- CD Feirensen FPF-sertifiointi (4 tähteä) on kirjattu merkkijonona, jossa
  varauma näkyy suoraan arvossa: luku perustuu seuran omaan ilmoitukseen
  (cdfeirense.pt), ei FPF:n viralliseen listaan.

## Rajoite

Ajoympäristön egress-proxy esti lähdesivujen avaamisen, joten URL-lähteiden
sisältöä ei voitu tässä sessiossa avata uudelleen ja verrata arvoihin rivi
riviltä; auditointi kohdistui lähteiden olemassaoloon, note-kenttien
kuvauksiin ja arvojen sisäiseen johdonmukaisuuteen. Tutkimusagentit kirjasivat
arvot samassa ajossa, jossa lähteet luettiin (hakukonereferaattien kautta).
Täydennysajon yhteydessä pistokoe kannattaa toistaa avaamalla lähde-URL:t.

## Kokonaistilastot (93 seuraa)

- Lähdeviitteitä yhteensä: 326
- Confidence: high 22, medium 5, low 66 (low painottuu CdP-tasolle, jonka
  tutkimus vaatii täydennysajon — ks. README ja gaps.md)
- Täyttöasteet: kaupunki 88/93, koordinaatit 88/93, rannikkostatus 88/93,
  stadionkapasiteetti 27/93, omistusrakenne 27/93, myyntisignaali 18/93,
  seurakohtainen hinta-arvio 8/93
- B-joukkueet (8) merkitty `acquirable: false`: Benfica B, FC Porto B,
  Sporting CP B, Vitória de Guimarães B, GD Chaves B, SC Braga B,
  FC Alverca B, Santa Clara B
- `npm run validate`: 0 virhettä, 0 varoitusta
