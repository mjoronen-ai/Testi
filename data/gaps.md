# Puuttuvat ja epävarmat tiedot (gaps)

Generoitu `scripts/generate-gaps.mjs`-skriptillä datasta ja tutkimusajojen
kirjauksista. Sääntö: lukua ei koskaan keksitä — puuttuva tieto on `null`
datassa ja kirjattuna tähän tiedostoon.

Päivitetty: 2026-08-11 · 93 seuraa

## Täyttöasteet

| Kenttä | Täytetty | Puuttuu | Huom |
|---|---|---|---|
| Kaupunki | 93/93 | 0 |  |
| Perustamisvuosi | 93/93 | 0 |  |
| Kaupungin väkiluku | 90/93 | 3 |  |
| Koordinaatit | 93/93 | 0 |  |
| Rannikkostatus | 93/93 | 0 |  |
| Stadionin nimi | 93/93 | 0 |  |
| Stadionin kapasiteetti | 90/93 | 3 |  |
| Stadionin omistus | 82/93 | 11 |  |
| Yleisökeskiarvo 2025-26 | 1/93 | 92 | Transfermarkt estetty ajoympäristössä |
| Akatemian olemassaolo | 93/93 | 0 |  |
| FPF-sertifiointi | 43/93 | 50 | FPF:n oma lista ei ollut haettavissa |
| Omistusrakenne (SAD/clube) | 90/93 | 3 |  |
| Julkinen myyntisignaali | 30/93 | 63 | `unknown` on oletus — vain julkinen lähde nostaa statusta |

Luotettavuus (confidence): korkea 52, keskitaso 41, matala 0. Lähdeviitteitä yhteensä 1134.

## Systemaattiset aukot

- **Yleisökeskiarvot** (`attendance.average`): Transfermarkt ja sen varalähteet
  ovat estettyjä ajoympäristön egress-proxyssä (403), eikä yleisödataa saatu
  haettua muualtakaan. Tasoilla 3–4 lukuja ei julkaista systemaattisesti.
  Lukuja ei arvattu. Pisteytyksessä markkinaosuus lasketaan väkiluvun ja
  suurkaupunkietäisyyden varassa, ja datakattavuus näytetään käyttäjälle.
- **FPF Entidades Formadoras -sertifioinnit**: fpf.pt on estetty, joten
  sertifioinnit löytyivät vain seurakohtaisista lähteistä (seurojen omat sivut,
  aluejärjestöjen ja median uutiset). Puuttuva arvo ei tarkoita, ettei seuralla
  olisi sertifiointia.
- **Myyntistatus** (`sale.status`): oletus on `unknown`. Elokuussa 2026
  uutisoitiin noin 29 portugalilaisseuran hakevan sijoittajia (Brands Capital
  Sports), mutta listaukset ovat anonyymejä, joten yksittäisen seuran status jää
  useimmiten tuntemattomaksi.

## Sarjakokoonpanot

- **CdP Série D, avoin paikka ("clube a designar")**: Liga 3:sta pudonneen
  1.º Dezembron (Sintra) osallistuminen oli lohkoarvonnan (25.7.2026) hetkellä
  auki osallistumisedellytysten vuoksi; Sacavenense on vaatinut paikkaa. Paikan
  saajaa ei ollut julkistettu 11.8.2026 mennessä, joten Série D:ssä on datassa
  13 seuraa. Lähteet: record.pt, abola.pt (24.7.2026).
- **GD Fabril (Barreiro)**: tehtävänannossa mainittu tason 4 seurana, mutta ei
  esiinny minkään CdP-lohkon 2026/27-listassa (kaksi riippumatonta hakua).

## Seurat, joilta puuttuu keskeisiä kenttiä

Keskeisiksi lasketaan stadionin kapasiteetti, stadionin omistus, väkiluku ja
omistusrakenne. Yleisökeskiarvo ja FPF-sertifiointi on jätetty pois, koska ne
puuttuvat systemaattisesti (ks. yllä).

- **SC São João de Ver** (taso 3): puuttuu `stadium.owner`
- **Varzim SC** (taso 3): puuttuu `city_population`
- **Atlético CP** (taso 3): puuttuu `stadium.owner`, `city_population`, `ownership.structure`
- **CD Mafra** (taso 3): puuttuu `ownership.structure`
- **CF Os Belenenses** (taso 3): puuttuu `stadium.owner`
- **UD Oliveirense** (taso 3): puuttuu `stadium.owner`, `city_population`
- **Atlético Clube de Vila Meã** (taso 4): puuttuu `stadium.capacity`
- **União Desportiva Sousense** (taso 4): puuttuu `stadium.owner`
- **Clube de Futebol União de Lamas** (taso 4): puuttuu `stadium.owner`
- **Associação Desportiva Fazendense** (taso 4): puuttuu `stadium.owner`
- **Futebol Clube de Alverca B** (taso 4): puuttuu `stadium.capacity`, `stadium.owner`
- **Mortágua Futebol Clube** (taso 4): puuttuu `stadium.owner`
- **Associação Naval 1893** (taso 4): puuttuu `ownership.structure`
- **Sertanense Futebol Clube** (taso 4): puuttuu `stadium.owner`
- **Futebol Clube de Serpa** (taso 4): puuttuu `stadium.capacity`, `stadium.owner`

## Tutkimusajojen kirjaamat perustelut

Alla 400 kirjausta kentistä, jotka ovat edelleen tyhjiä.
Sittemmin täytetyt kentät ja keskitetysti hoidettu hinta-arvio on suodatettu pois.

### `attendance.average` (142)

- **Atlético Clube de Vila Meã**: Tason 4 seuroista ei julkaista yleisökeskiarvoja; Transfermarktin sivun suora lataus estetty egress-politiikalla eikä hakutuloksissa esiintynyt yleisölukuja kaudelta 2025/26.
- **Futebol Clube de Vinhais**: Ei julkaistua yleisödataa AF Bragançan/CdP-tason seuroille; Transfermarkt-sivun suora lataus estetty egress-politiikalla, hakutuloksissa ei yleisölukuja.
- **Associação Desportiva da Camacha**: Madeiran CdP-seurojen yleisömääriä ei julkaista; Transfermarkt-fetch estetty, hakutuloksissa ei lukuja.
- **Associação Desportiva de Castro Daire**: Seura nousi Campeonato de Portugaliin vasta kaudeksi 2026/27 (pelasi 2025/26 AF Viseun piirisarjassa), joten kansallisen tason yleisödataa ei ole olemassa kaudelta 2025/26.
- **Sport Clube Beira-Mar**: Tason 4 (Campeonato de Portugal) yleisömääriä ei julkaista Transfermarktissa eikä zerozerossa. Ei haettu syvemmin ohjeen mukaisesti. HUOM: Beira-Mar on poikkeus — 32 830-paikkainen Estádio Municipal de Aveiro ja historiallisesti suuri kannattajakunta tarkoittavat, että todellinen yleisömäärä voi olla merkittävä; kannattaa hakea erikseen paikallislehdistä (diarioaveiro.pt, noticiasdeaveiro.pt) tai seuran otteluraporteista.
- **Sport Comércio e Salgueiros**: Tason 4 yleisödataa ei saatavilla Transfermarktissa. Lisäksi kotikenttä Complexo Desportivo de Campanhã vetää vain 1 000, joten luku olisi joka tapauksessa kapasiteettirajoitettu.
- **União Desportiva Sousense**: Tason 4 yleisödataa ei saatavilla Transfermarktissa; 2 000 paikan kenttä ja freguesia-tason seura → dataa ei julkaista.
- **Clube de Futebol União de Lamas**: Tason 4 yleisödataa ei saatavilla Transfermarktissa/zerozerossa.
- **Atlético Clube da Malveira**: Tason 4 (Campeonato de Portugal) yleisödataa ei julkaista systemaattisesti. Transfermarktin seurasivu (transfermarkt.us/ac-malveira/stadion/verein/27745) näkyi hakutuloksissa mutta WebFetch estettiin egress-proxyn toimesta, eikä hakutulostiivistelmä sisältänyt kauden 2025-26 yleisökeskiarvoa.
- **Associação Desportiva Fazendense**: Seura nousi Campeonato de Portugaliin vasta kaudeksi 2026/27 (kausi 2025-26 pelattiin AF Santarémin piirisarjassa), joten kansallisen tason yleisödataa ei ole olemassa. Transfermarkt-sivua ei päästy hakemaan (egress-esto).
- **Associação Desportiva Nogueirense**: Seura pelasi kauden 2025-26 AF Coimbran Divisão de Elitessä ja nousi Campeonato de Portugaliin vasta 2026/27, joten kansallisen tason yleisökeskiarvoa ei ole. Transfermarkt-sivua ei päästy avaamaan (egress-esto).
- **Centro Desportivo de Fátima**: Tason 4 yleisökeskiarvoja ei julkaista systemaattisesti; Transfermarkt-sivua (transfermarkt.us/cd-fatima/startseite/verein/6987) ei voitu hakea egress-eston takia eikä hakutulostiivistelmä sisältänyt kauden 2025-26 keskiarvoa.
- **Futebol Clube de Alverca B**: Transfermarkt ja zerozero estetty egress-proxylla (403 CONNECT); tason 4 B-joukkueiden yleisömääriä ei julkaista käytännössä missään. Ei arvattu.
- **Futebol Clube de Oliveira do Hospital**: Transfermarkt estetty egress-proxylla; Campeonato de Portugal -tasolta ei julkaista yleisökeskiarvoja.
- **Grupo Desportivo Os Nazarenos**: Transfermarkt estetty egress-proxylla; seura nousi Campeonato de Portugaliin vasta kaudeksi 2026/27, joten kaudelta 2025-26 (AF Leiria Divisão de Honra) ei ole julkaistua yleisödataa.
- **Mortágua Futebol Clube**: Transfermarkt estetty egress-proxylla; Campeonato de Portugal -tasolta ei julkaista yleisökeskiarvoja.
- **Associação Naval 1893**: Yleisökeskiarvoa kaudelta 2025/26 ei löytynyt. Transfermarkt/zerozero eivät julkaise yleisölukuja Campeonato de Portugal -tasolla, ja sivut olivat lisäksi egress-eston takana.
- **O Elvas Clube Alentejano de Desportos**: Yleisökeskiarvoa 2025/26 ei löytynyt; taso 4 ei ole yleisödatan piirissä ja Transfermarkt/zerozero olivat egress-eston takana. Huom: seura pelasi Taça de Portugalin puolivälierissä tammikuussa 2025, joten yksittäisiä yleisölukuja saattaa löytyä kuppiotteluista.
- **Clube de Futebol "Os Marialvas"**: Ei yleisödataa kaudelta 2025/26 tason 4 seurasta; Transfermarkt egress-eston takana.
- **Sertanense Futebol Clube**: Ei yleisödataa tason 4 seurasta kaudelta 2025/26; seura pelasi lisäksi 2025/26 piirisarjassa (voitti piirimestaruuden ja nousi), joten dataa on vielä epätodennäköisemmin.
- **Grupo Desportivo Alcochetense**: Transfermarkt/zerozero eivät julkaise yleisökeskiarvoja Campeonato de Portugal -tasolla (taso 4). Lisäksi transfermarkt.us, zerozero.pt ja wikipedia estettiin WebFetchissä (egress-proxy 403), joten sivukohtaista tarkistusta ei voitu tehdä.
- **Grupo Desportivo de Lagoa**: Ei yleisödataa tason 4 seuroista; transfermarkt.us ja zerozero.pt estetty WebFetchissä.
- **GD Portel**: Ei yleisödataa tason 4 / juuri noussutta seurasta; lähteet estetty WebFetchissä.
- **Imortal Desportivo Clube**: Ei julkaistua yleisökeskiarvoa kaudelta 2025/26; transfermarkt.us ja zerozero.pt estetty WebFetchissä (egress-proxy 403).
- **Juventude Desportiva Lajense**: Tason 4 (Campeonato de Portugal) yleisödataa ei julkaista. Transfermarkt- ja zerozero-domainit estettyjä egress-proxylla (403 CONNECT), joten sivuja ei voitu avata suoraan; hakutulostiivistelmissä ei yleisölukuja.
- **Juventude Sport Clube (Évora)**: Campeonato de Portugalin yleisökeskiarvoja ei julkaista systemaattisesti; Transfermarkt estetty egress-proxylla. Uusi 3 000-paikkainen stadion avattiin vasta 10/2025, joten vertailukelpoista kauden 2025-26 keskiarvoa ei löytynyt.
- **Real Sport Clube**: Transfermarkt estetty egress-proxylla (403); alemmilta sarjatasoilta ei julkista yleisödataa hakutuloksissa.
- **Clube Desportivo Santa Clara B**: B-joukkueiden yleisölukuja ei julkaista; Transfermarkt ja zerozero estetty egress-proxylla.
- **Sport Clube Mineiro Aljustrelense**: Tason 4 yleisödataa ei julkaista. Transfermarkt- ja zerozero-sivut estetty egress-proxylla (403 CONNECT), eikä WebSearch tuottanut yleisökeskiarvoa kaudelle 2025-26.
- **Sport União Sintrense**: Tason 4 yleisökeskiarvoa ei löytynyt. Transfermarkt ja zerozero estetty egress-proxylla (403 CONNECT).
- **Vitória Futebol Clube**: Seura pelasi 2025/26 AF Setúbalin piirisarjaa (taso 5), jonka yleisömääriä ei tilastoida julkisesti; Transfermarkt ja zerozero estetty egress-proxylla. Huom: seura on poikkeuksellinen tapaus — historiallisena suurseurana yleisömäärä on todennäköisesti selvästi sarjatason tyypillistä korkeampi, mutta lukua ei löytynyt eikä sitä arvattu.
- **SC Farense**: Transfermarktin katsojasivu (besucherzahlen) ja muut tilastosivustot estetty egress-proxyssä; WebSearch-tiivistelmät eivät sisältäneet seurakohtaista 2025/26-keskiarvoa Liga Portugal 2:sta.
- **SCU Torreense**: Sama kuin Farense: suora haku Transfermarktiin/zerozeroon estetty, hakukonetiivisteissä ei seurakohtaista yleisökeskiarvoa 2025/26.
- **Vitória Sport Clube B**: Liga 3 -tason yleisökeskiarvoja ei julkaista järjestelmällisesti, eikä Vitória B:lle löytynyt lukua kaudelta 2025/26. Transfermarkt (transfermarkt.us/vitoria-guimaraes-sc-b/startseite/verein/15136) ja zerozero.pt ovat molemmat estettyjä WebFetchille tämän session egress-proxyssä (EGRESS_BLOCKED), eikä WebSearch palauttanut lukua. Joukkue pelaa akatemian kentällä nro 5 (kap. 2 500), joten todelliset yleisömäärät ovat joka tapauksessa hyvin pieniä.
- **Caldas Sport Clube**: Kauden 2025/26 yleisökeskiarvoa ei löytynyt. zerozero.pt/ogol.com.br, Transfermarkt ja academiadasapostas ovat estettyjä WebFetchille (EGRESS_BLOCKED), ja WebSearch-yhteenvedot totesivat nimenomaisesti ettei yleisödataa ollut tuloksissa. Liga 3 -taso ei julkaise yleisölukuja keskitetysti.
- **Louletano Desportos Clube**: Virallista kausikeskiarvoa ei julkaista Campeonato de Portugal -tasolla. Ainoa löytynyt luku on Sul Informaçãon maininta n. 1 500 katsojasta kauden 2025/26 viimeisissä kotipeleissä — tämä ei ole kausikeskiarvo, joten average jätetty tyhjäksi ohjeen mukaan (luku kirjattu attendance.source-kenttään kontekstiksi).
- **Lusitano Ginásio Clube**: Não publicada. A Liga 3 não divulga assistências oficiais por jogo e as fontes que às vezes as agregam (Transfermarkt, zerozero.pt) estão BLOQUEADAS pelo egress proxy desta sessão (403 no CONNECT), pelo que não foi possível abrir as páginas. Buscas dirigidas a 'assistência média Liga 3 2025/26' não devolveram números. Campo deixado a null.
- **Sporting Clube da Covilhã**: Não encontrada. Sem divulgação oficial de assistências na Liga 3 e com Transfermarkt/zerozero.pt bloqueados pelo egress proxy. As buscas dirigidas a assistências 2025/26 devolveram apenas calendários e classificações. Campo a null.
- **União Desportiva de Santarém**: Numeerista yleisökeskiarvoa kaudelta 2025/26 ei löytynyt. Transfermarktin ja zerozero.pt:n seurasivut olisivat ensisijaiset lähteet, mutta molempien suora WebFetch estyi ympäristön egress-proxyssa (403 CONNECT; myös pt./en.wikipedia.org ja curl estetty) — käytettävissä oli vain WebSearch ja sen tulostiivistelmät. Liga 3 -tason yleisödataa ei yleensä julkaista koostettuna. Löytyi vain laadullinen tieto (O Mirante 3/2026): yleisömäärä 'käytännössä kolminkertaistunut', jäsenmäärä 400 → 1 200. Suositus: hae zerozero.pt/equipa/u-santarem/3947 tai Transfermarkt verein/74155 suoraan kun verkkoyhteys sallii.
- **Académica**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **AFS**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **Amarante FC**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **Benfica B**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **CD Feirense**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **CD Tondela**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. Huom: hakutulosten perusteella Tondela pelasi 2025-26 Primeira Ligassa (putosi Liga Portugal 2:een kaudeksi 2026-27), joten luku ei löydy Liga Portugal 2 -sarjasivulta — tätä ei kuitenkaan pystytty varmentamaan. Ei arvattu.
- **FC Felgueiras 1932**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **FC Penafiel**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **FC Porto B**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **FC Vizela**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. Huom: hakutulosten perusteella Vizela ei ollut Liga Portugal 2:ssa 2025-26, joten luku vaatisi seuran oman TM-sivun — ei saatavilla. Ei arvattu.
- **GD Chaves**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **Leixões SC**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **Lusitânia de Lourosa FC**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **Portimonense SC**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **SC Farense**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **SCU Torreense**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **Sporting Clube de Portugal B**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **AD Fafe**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **AD Marco 09**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **CD Trofense**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **FC Paços de Ferreira**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **Leça FC**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **SC São João de Ver**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **SC Vianense**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **USC Paredes**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **Varzim SC**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **Vitória Sport Clube B**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **Atlético CP**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **Caldas Sport Clube**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **CD Mafra**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **CF Os Belenenses**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **Grupo Desportivo Vitória de Sernache**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **Louletano Desportos Clube**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **Lusitano Ginásio Clube**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **Sporting Clube da Covilhã**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **UD Oliveirense**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **União Desportiva de Santarém**: Transfermarkt estetty: egress-proxy vastaa 403 CONNECT-pyyntöön (transfermarkt.com/.us/.pt/.de) organisaation verkkopolitiikan takia; lisäksi transfermarkt.com estää Anthropicin crawlerin, joten WebSearch ei voi hakea sivua. Varalähteet (worldfootball.net, zerozero.pt, footballdatabase.eu, soccerway.com, flashscore.com, footystats.org, wikipedia.org) myös 403. WebSearch palautti vain yleistekstiä ilman seurakohtaisia yleisölukuja. Ei arvattu.
- **Académica**: Kauden 2025/26 (Liga 3) yleisökeskiarvoa ei löytynyt: transfermarkt-, zerozero.pt- ja wikipedia-sivut estetty verkkoproxyssa, eikä hakutuloksissa ollut kausikeskiarvoa. Tiedossa vain: kotiyleisöennätys 26 356 (vs Trofense 16.5.2026, Liga 3:n kaikkien aikojen ennätys) ja >10 000 katsojaa kolmessa viimeisessä kotipelissä (asbeiras.pt, abola.pt).
- **AFS**: Kauden 2025/26 (Primeira Liga) yleisökeskiarvoa ei löytynyt: transfermarkt-fetch estetty ('unable to fetch') ja haut eivät tuottaneet kausikeskiarvoa. Yksittäishavainto: 1 100 katsojaa AVS-Alverca 4.10.2025 (fotmob).
- **Amarante FC**: Transfermarkt ja muut tilastosivut estetty egress-proxyssa (EGRESS_BLOCKED); WebSearch-tuloksissa ei yleisökeskiarvoa Liga 3 -kaudelta 2025/26 — alemman tason data tyypillisesti puuttuu.
- **Benfica B**: Transfermarktin Liga Portugal 2 -yleisösivu on olemassa, mutta suora fetch estetty egress-proxyssa (EGRESS_BLOCKED) eikä WebSearch-yhteenveto sisältänyt Benfica B:n lukua kaudelta 2025/26.
- **CD Feirense**: Transfermarkt, zerozero.pt ja wikipedia estetty egress-proxyssä; WebSearch-tulokset eivät sisältäneet kauden 2025/26 yleisökeskiarvoa Liga Portugal 2:ssa.
- **CD Tondela**: Kauden 2025/26 keskiarvoa ei löytynyt (Transfermarkt estetty proxyssä); vain yksittäisten otteluiden lukuja: 532–2 474 katsojaa (academiadasapostas.com, ESPN).
- **FC Felgueiras 1932**: Transfermarktin, zerozeron ja Wikipedian suora haku on estetty ympäristön egress-proxyssä; WebSearch-otteista ei saatu 2025/26 Liga 2 -yleisökeskiarvoa Felgueirasille → null.
- **FC Penafiel**: Transfermarktin katsojatilastosivu (Liga Portugal 2 2025/26) olemassa mutta suora haku estetty egress-proxyssä eikä lukua saatu WebSearch-otteista → null.
- **GD Chaves**: Transfermarktin Liga Portugal 2 -yleisösivu ja zerozero.pt estetty egress-proxyssa; WebSearch ei palauttanut lukuja kaudelta 2025-26.
- **Leixões SC**: Transfermarkt/zerozero estetty egress-proxyssa; WebSearch ei palauttanut kauden 2025-26 yleisökeskiarvoa.
- **SC Farense**: Transfermarkt estetty egress-proxyssa eikä WebSearch-kiintiötä jäljellä; yleisökeskiarvo 2025-26 jäi null.
- **SCU Torreense**: Transfermarkt estetty egress-proxyssa eikä WebSearch-kiintiötä jäljellä; yleisökeskiarvo 2025-26 jäi null.
- **Sporting Clube de Portugal B**: Transfermarkt estetty egress-proxyssa; B-joukkueille data muutenkin epätodennäköinen.
- **Académica**: Transfermarkt (.com/.pt/.de/.us) estetty ympäristön egress-proxyssa (403 CONNECT, org-policy) ja WebFetch kieltäytyy transfermarkt-domaineista; varalähteet (r.jina.ai, web.archive.org, wikipedia, zerozero.pt, worldfootball.net, fbref.com) myös estetty; WebSearch-kiintiö 200/200 käytetty. Kauden 2025-26 yleisökeskiarvoa ei voitu varmentaa mistään lähteestä; lukua ei arvattu.
- **AFS**: Transfermarkt ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **Amarante FC**: Transfermarkt ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **Benfica B**: Transfermarkt ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **CD Feirense**: Transfermarkt ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **CD Tondela**: Transfermarkt ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa (pelasi mahdollisesti Liga Portugalissa 2025-26, mutta sitäkään sivua ei voitu hakea); ei arvattu.
- **FC Felgueiras 1932**: Transfermarkt ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **FC Penafiel**: Transfermarkt ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **FC Porto B**: Transfermarkt ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **FC Vizela**: Transfermarkt ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **GD Chaves**: Transfermarkt ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **Leixões SC**: Transfermarkt ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **Lusitânia de Lourosa FC**: Transfermarkt ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **Portimonense SC**: Transfermarkt ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **SC Farense**: Transfermarkt ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **SCU Torreense**: Transfermarkt ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **Sporting Clube de Portugal B**: Transfermarkt ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **AD Fafe**: Transfermarkt (Liga 3 2025-26 besucherzahlen-sivu) ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **AD Marco 09**: Transfermarkt (Liga 3 2025-26) ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **CD Trofense**: Transfermarkt (Liga 3 2025-26) ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **FC Paços de Ferreira**: Transfermarkt (Liga 3 2025-26) ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **Leça FC**: Transfermarkt (Liga 3 2025-26) ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **SC São João de Ver**: Transfermarkt (Liga 3 2025-26) ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **SC Vianense**: Transfermarkt (Liga 3 2025-26) ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **USC Paredes**: Transfermarkt (Liga 3 2025-26) ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **Varzim SC**: Transfermarkt (Liga 3 2025-26) ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **Vitória Sport Clube B**: Transfermarkt (Liga 3 2025-26) ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **Atlético CP**: Transfermarkt (Liga 3 2025-26) ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **Caldas Sport Clube**: Transfermarkt (Liga 3 2025-26) ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **CD Mafra**: Transfermarkt (Liga 3 2025-26) ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **CF Os Belenenses**: Transfermarkt (Liga 3 2025-26) ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **Grupo Desportivo Vitória de Sernache**: Transfermarkt (Liga 3 2025-26) ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **Louletano Desportos Clube**: Transfermarkt (Liga 3 2025-26) ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **Lusitano Ginásio Clube**: Transfermarkt (Liga 3 2025-26) ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **Sporting Clube da Covilhã**: Transfermarkt (Liga 3 2025-26) ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **UD Oliveirense**: Transfermarkt (Liga 3 2025-26) ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **União Desportiva de Santarém**: Transfermarkt (Liga 3 2025-26) ja kaikki varalähteet estetty egress-proxyssa (403), WebSearch-kiintiö täynnä. Ei varmennettua 2025-26 yleisökeskiarvoa; ei arvattu.
- **AD Fafe**: Transfermarktin Liga 3 -yleisösivu ei antanut seurakohtaista keskiarvoa hakutuloksissa, eikä suora sivunhaku ollut mahdollinen (egress-proxy estää transfermarkt/zerozero/wikipedia-domainit); ohjeen mukaisesti ei käytetty enempää aikaa.
- **AD Marco 09**: Liga 3 -tason yleisödataa ei helposti saatavilla Transfermarktista; ei löytynyt hauilla, suora sivunhaku estetty proxyssa.
- **CD Trofense**: Transfermarkt on egress-proxyn estämä eikä WebSearch-tuloksista löytynyt kauden 2025-26 yleisökeskiarvoa Liga 3 -tasolta.
- **FC Paços de Ferreira**: Transfermarkt on egress-proxyn estämä eikä WebSearch-tuloksista löytynyt kauden 2025-26 yleisökeskiarvoa (Liga Portugal 2 -kausi).
- **Leça FC**: Transfermarktin Liga 3 -yleisösivu (besucherzahlen) ja seurasivu estetty egress-proxyssa; WebSearch-tulokset eivät sisältäneet seurakohtaista yleisökeskiarvoa kaudelta 2025-26
- **SC São João de Ver**: Transfermarkt estetty egress-proxyssa; hakutuloksissa ei seurakohtaista yleisökeskiarvoa kaudelta 2025-26
- **SC Vianense**: Transfermarkt ja zerozero estetty egress-proxyssa; WebSearch ei tuottanut yleisökeskiarvoa kaudelle 2025-26 — Liga 3 -tason yleisödataa ei tyypillisesti julkaista.
- **USC Paredes**: Transfermarkt estetty proxyssa; WebSearch ei tuottanut yleisökeskiarvoa 2025-26 (nousija CdP:stä, dataa ei julkaistu).
- **Varzim SC**: Transfermarkt ei saavutettavissa (fetch estetty/torjuttu); Liga 3 -tason yleisökeskiarvoja ei yleensä julkaista → null.
- **Vitória Sport Clube B**: Transfermarkt ei saavutettavissa; B-joukkueiden yleisödataa ei yleensä julkaista → null.
- **CD Mafra**: Transfermarkt ja zerozero estetty verkon egress-proxyssa; footystats-johdetuissa GitHub-otteluaineistoissa yleisömäärät 'N/A' kaudesta 2020-21 alkaen eikä Liga 3 2025-26 -dataa löytynyt → null.
- **CF Os Belenenses**: Transfermarkt ja zerozero estetty; Liga 3 2025-26 -yleisödataa ei löytynyt saavutettavissa olevista aineistoista → null.
- **Grupo Desportivo Vitória de Sernache**: Transfermarkt estetty egress-proxyssa (403). Liga 3 -tason yleisödataa ei muutenkaan yleensä ole saatavilla.
- **Louletano Desportos Clube**: Transfermarkt estetty egress-proxyssa (403). Liga 3 -tason yleisödataa ei muutenkaan yleensä ole saatavilla.
- **Lusitano Ginásio Clube**: Transfermarkt (com/pt) estetty egress-proxyssa; Liga 3 -yleisödataa ei muutenkaan yleensä saatavilla.
- **Sporting Clube da Covilhã**: Transfermarkt (com/pt) estetty egress-proxyssa; Liga 3 -yleisödataa ei muutenkaan yleensä saatavilla.

### `academy.fpf_certification` (132)

- **Atlético Clube de Vila Meã**: Ei eksplisiittistä FPF-sertifiointilähdettä; ohjeen mukaan keskitetty agentti täydentää.
- **Futebol Clube de Vinhais**: Ei eksplisiittistä FPF-sertifiointilähdettä; ohjeen mukaan keskitetty agentti täydentää.
- **Associação Desportiva da Camacha**: Ei eksplisiittistä FPF-sertifiointilähdettä; ohjeen mukaan keskitetty agentti täydentää.
- **Associação Desportiva de Castro Daire**: Ei eksplisiittistä FPF-sertifiointilähdettä; ohjeen mukaan keskitetty agentti täydentää.
- **Associação Desportiva de Machico**: Ei löytynyt eksplisiittistä FPF:n Certificação de Entidades Formadoras -listausta AD Machicolle. Ohjeen mukaan jätetty nulliksi keskitettyä FPF-ajoa varten.
- **Clube Desportivo de Cinfães**: Ei löytynyt eksplisiittistä FPF-sertifiointimainintaa. Jätetty nulliksi keskitettyä FPF-ajoa varten.
- **União Desportiva Sousense**: Ei eksplisiittistä FPF-sertifiointilähdettä. Seuralla on lähes 300 junioria ja kaikki ikäluokat AF Porton pääsarjassa, mutta tähtiluokitusta ei mainita. www.fpf.pt estyi (403).
- **Clube de Futebol União de Lamas**: Ei eksplisiittistä FPF-sertifiointilähdettä. Erillinen junioriyksikkö on olemassa (racius: «...- Formação de Futebol»), mutta tähtiluokitusta ei mainita. www.fpf.pt estyi (403).
- **Atlético Clube da Malveira**: FPF:n sertifiointilistaa ei tarkistettu; www.fpf.pt oli egress-proxyn estämä (403 CONNECT). Ohjeen mukaan keskitetty agentti täydentää.
- **Associação Desportiva Fazendense**: FPF:n sertifiointilistaa ei tarkistettu (www.fpf.pt estetty egress-proxyssa).
- **Associação Desportiva Nogueirense**: FPF:n sertifiointilistaa ei tarkistettu (www.fpf.pt estetty egress-proxyssa).
- **Grupo Desportivo Os Nazarenos**: FPF:n sertifiointitasoa ei mainita missään löydetyssä lähteessä; fpf.pt estetty egress-proxylla.
- **Mortágua Futebol Clube**: Sertifiointitasoa ei mainita seuran sivustolla eikä muissa lähteissä; fpf.pt ja vemjogar.fpf.pt estetty egress-proxylla.
- **Clube de Futebol "Os Marialvas"**: FPF:n tähtisertifiointia ei mainittu missään löytyneessä lähteessä; fpf.pt egress-eston takana. Jätetty nulliksi ohjeen mukaisesti.
- **Sertanense Futebol Clube**: FPF:n tähtisertifiointia ei mainittu lähteissä; fpf.pt egress-eston takana. Jätetty nulliksi.
- **Grupo Desportivo Alcochetense**: FPF:n sertifiointilistaa ei löytynyt hauilla ja www.fpf.pt estettiin WebFetchissä (egress-proxy 403). Keskitetty agentti hoitaa.
- **GD Portel**: Ei FPF-sertifiointilähdettä; www.fpf.pt estetty WebFetchissä.
- **Juventude Desportiva Lajense**: www.fpf.pt estetty egress-proxylla (403). Ei löytynyt muuta julkista lähdettä FPF:n akatemiasertifiointitasosta. Keskitetty agentti hoitaa.
- **Juventude Sport Clube (Évora)**: www.fpf.pt estetty egress-proxylla (403); sertifiointilistaa ei päästy tarkistamaan.
- **Real Sport Clube**: www.fpf.pt estetty egress-proxylla (403). Real SC on tunnettu 'clube formador', mutta FPF:n sertifiointitasoa ei voitu vahvistaa.
- **Clube Desportivo Santa Clara B**: www.fpf.pt estetty egress-proxylla (403); CD Santa Claran akatemiasertifiointitasoa ei voitu vahvistaa.
- **Sport Clube Mineiro Aljustrelense**: FPF:n sertifiointilistaa ei löytynyt; www.fpf.pt estetty egress-proxylla (403). Keskitetty agentti täydentää.
- **Vitória Futebol Clube**: Ei eksplisiittistä FPF-sertifiointilähdettä; www.fpf.pt estetty egress-proxylla (403). Lisäksi juniorirakennetta kootaan uudelleen maksukyvyttömyyden jälkeen, joten sertifiointitilanne voi olla muuttunut.
- **Grupo Desportivo Vitória de Sernache**: FPF:n akatemioiden sertifiointilistaa (Certificação de Formação) ei löytynyt hakukoneen kautta; keskitetty agentti hoitaa tämän kentän ohjeen mukaan.
- **Lusitano Ginásio Clube**: Não foi encontrada a lista de certificação de formação da FPF com referência a este clube; conforme instruções, este campo é tratado por agente centralizado.
- **União Desportiva de Santarém**: Eksplisiittistä FPF:n akatemiasertifiointitasoa (Certificação de Entidades Formadoras) ei löytynyt seurakohtaisesti. Ohjeen mukaan keskitetty agentti hoitaa FPF-sertifiointilistan → jätetty null.
- **AFS**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. Lisäksi seuratunniste 'AFS' on monitulkintainen (mahdollisesti AVS/Aves) eikä sitä voitu yhdistää sertifiointilistan nimeen. fpf.pt ja certificacao.fpf.pt olivat estettyjä (egress proxy).
- **AD Marco 09**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. Haettu AF Porto -sertifiointiuutisista (record.pt, afporto.pt) ilman eksplisiittistä mainintaa.
- **CD Trofense**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. Mainittu AF Porto -sertifiointiaineistossa yleisesti, mutta tähtitasoa ei vahvistettu.
- **Leça FC**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. Haettu AF Porto -sertifiointiuutisista ilman eksplisiittistä tähtimainintaa.
- **SC Vianense**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. Haettu AF Viana do Castelo -aineistosta ilman tulosta.
- **USC Paredes**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. Haettu AF Porto -sertifiointiuutisista ilman tulosta.
- **Varzim SC**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. Mainittu AF Porto -aineistossa yleisesti, mutta tähtitasoa ei vahvistettu.
- **Grupo Desportivo Vitória de Sernache**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla.
- **Lusitano Ginásio Clube**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. Haettu AF Évora -aineistosta ilman tulosta.
- **União Desportiva de Santarém**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. AF Santarém -uutinen mainitsee sertifioitujen määrän muttei seurakohtaisia tähtiä.
- **Associação Desportiva de Ponte da Barca**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. Hakutuloksissa esiintynyt 'Ponte' viittaa Guimarãesin seuraan, ei Ponte da Barcaan.
- **Centro Desportivo e Cultural de Montalegre**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. Haettu AF Vila Real -aineistosta ilman tulosta.
- **Clube Desportivo Celoricense**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla.
- **FC Maia Lidador**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. Haettu AF Porto -sertifiointiuutisista ilman tulosta.
- **FC Tirsense**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. Haettu AF Porto -sertifiointiuutisista ilman tulosta.
- **GD Bragança**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. AF Bragança -uutinen (24 sertifioitua seuraa 2025/26) ei ollut haettavissa (mdb.pt estetty), eikä seurakohtaisia tähtiä saatu.
- **Sport Clube Maria da Fonte**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla.
- **Associação Desportiva Os Limianos**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla.
- **Rebordosa Atlético Clube**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. Haettu AF Porto -sertifiointiuutisista ilman tulosta.
- **Atlético Clube de Vila Meã**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla.
- **Futebol Clube de Vinhais**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. AF Bragança -lista ei ollut haettavissa.
- **Associação Desportiva da Camacha**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. Haettu AF Madeira -aineistosta ilman tulosta.
- **Associação Desportiva de Castro Daire**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla.
- **Associação Desportiva de Machico**: Hakutuloksissa esiintyi maininta 4 tähden sertifioinnista, mutta lähde ei ollut luotettava/varmennettavissa (ei virallista FPF- tai AF Madeira -lähdettä); jätetty pois patchista. fpf.pt estetty.
- **Clube Desportivo de Cinfães**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla.
- **Estrela da Calheta Futebol Clube**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla.
- **Futebol Clube de Alpendorada**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla.
- **Florgrade Futebol Clube**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla.
- **Guarda Futebol Clube (Guarda Futebol Clube – Futebol, SAD)**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. AF Guarda -uutinen (36 sertifioitua seuraa 2025/26) ei sisältänyt seurakohtaisia tähtiä.
- **União Desportiva Sousense**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla.
- **Clube de Futebol União de Lamas**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. Ei esiintynyt AF Aveiro -sertifiointilistoissa.
- **Atlético Clube da Malveira**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. AF Lisboa -uutinen ei eritellyt tätä seuraa.
- **Associação Desportiva Fazendense**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla.
- **Associação Desportiva Nogueirense**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla.
- **Grupo Desportivo Os Nazarenos**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla.
- **Mortágua Futebol Clube**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla.
- **Clube de Futebol "Os Marialvas"**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla.
- **Sertanense Futebol Clube**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. AF Castelo Branco -uutinen (26 sertifioitua seuraa 2025/26) ei eritellyt seurakohtaisia tähtiä.
- **Sport Benfica e Castelo Branco**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. AF Castelo Branco -uutinen ei eritellyt seurakohtaisia tähtiä.
- **União Desportiva da Serra**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla.
- **Amora Futebol Clube**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. AF Setúbal -uutinen mainitsee kokonaismäärät muttei seurakohtaisia tähtiä; afsetubal.fpf.pt oli estetty.
- **Futebol Clube de Serpa**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla.
- **Grupo Desportivo Alcochetense**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. AF Setúbal -lähde estetty.
- **GD Portel**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla.
- **Juventude Desportiva Lajense**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (Azorit).
- **Juventude Sport Clube (Évora)**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla.
- **Real Sport Clube**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. AF Lisboa -uutinen ei eritellyt tätä seuraa.
- **Clube Desportivo Santa Clara B**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (Azorit; emoseuran CD Santa Clara sertifiointitasoa ei vahvistettu).
- **Sport Clube Mineiro Aljustrelense**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla.
- **Vitória Futebol Clube**: Ei löydy FPF:n julkisesta listasta / listaa ei saatavilla. AF Setúbal -lähde (afsetubal.fpf.pt) oli estetty; seurakohtaista tähtitasoa ei vahvistettu.
- **AFS**: Ei eksplisiittistä FPF-sertifiointilähdettä hauissa — jätetty keskitetylle agentille ohjeen mukaisesti.
- **AFS**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **AD Marco 09**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **CD Trofense**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Leça FC**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **SC Vianense**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **USC Paredes**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Varzim SC**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Grupo Desportivo Vitória de Sernache**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Lusitano Ginásio Clube**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **União Desportiva de Santarém**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Associação Desportiva de Ponte da Barca**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Centro Desportivo e Cultural de Montalegre**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Clube Desportivo Celoricense**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **FC Maia Lidador**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **FC Tirsense**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **GD Bragança**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Sport Clube Maria da Fonte**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Associação Desportiva Os Limianos**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Rebordosa Atlético Clube**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Atlético Clube de Vila Meã**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Futebol Clube de Vinhais**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Associação Desportiva da Camacha**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Associação Desportiva de Castro Daire**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Associação Desportiva de Machico**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Clube Desportivo de Cinfães**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Estrela da Calheta Futebol Clube**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Futebol Clube de Alpendorada**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Florgrade Futebol Clube**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Guarda Futebol Clube (Guarda Futebol Clube – Futebol, SAD)**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **União Desportiva Sousense**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Clube de Futebol União de Lamas**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Atlético Clube da Malveira**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Associação Desportiva Fazendense**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Associação Desportiva Nogueirense**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Grupo Desportivo Os Nazarenos**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Mortágua Futebol Clube**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Clube de Futebol "Os Marialvas"**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Sertanense Futebol Clube**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Sport Benfica e Castelo Branco**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **União Desportiva da Serra**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Amora Futebol Clube**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Futebol Clube de Serpa**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Grupo Desportivo Alcochetense**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **GD Portel**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Juventude Desportiva Lajense**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Juventude Sport Clube (Évora)**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Real Sport Clube**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Clube Desportivo Santa Clara B**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Sport Clube Mineiro Aljustrelense**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **Vitória Futebol Clube**: ei löydy FPF:n julkisesta listasta / listaa ei saatavilla (verkkohaku estetty: egress-proxy 403, WebSearch-kiintiö täynnä)
- **AD Marco 09**: FPF:n sertifiointilistaa ei haettu (keskitetty agentti hoitaa); ei eksplisiittistä lähdettä.
- **Leça FC**: FPF:n sertifiointilistaa ei haettu tässä — keskitetty agentti täyttää; ei eksplisiittistä lähdettä löytynyt sivuhauissa
- **SC Vianense**: Eksplisiittistä FPF-sertifiointilistalähdettä ei haettu tuloksellisesti; jätetty keskitetylle agentille ohjeen mukaisesti.
- **USC Paredes**: Eksplisiittistä FPF-sertifiointilistalähdettä ei löytynyt; jätetty keskitetylle agentille ohjeen mukaisesti.
- **Varzim SC**: FPF:n sertifiointilistaa ei haettu (ohjeen mukaan keskitetty agentti hoitaa; lähteet estetty tässä istunnossa).

### `academy.notable_products` (70)

- **Associação Desportiva de Ponte da Barca**: Haut eivät nimenneet akatemiasta nousseita ammattilaisia
- **Brito Sport Clube**: Haut eivät nimenneet akatemiasta nousseita ammattilaisia
- **Centro Desportivo e Cultural de Montalegre**: Haut eivät nimenneet akatemiasta nousseita ammattilaisia
- **Clube Desportivo Celoricense**: Haut eivät nimenneet akatemiasta nousseita ammattilaisia
- **FC Tirsense**: Historiallinen seura, mutta kohtuullisella haulla (Wikipedia, zerozero, blogit) ei löytynyt dokumentoitua listaa akatemiasta nousseista ammattilaisista.
- **FC Maia Lidador**: Nuori seura (per. 2009), piirisarjatausta — dokumentoituja ammattilaiskasvatteja ei löytynyt; edeltäjä-FC Maian kasvatteja ei laskettu tälle seuralle.
- **Sport Clube Maria da Fonte**: Hauista ei löytynyt yhtään nimettyä ammattilaista, joka olisi lähteen mukaan seuran kasvatti. Vain nuorisosarjojen titteleitä.
- **Associação Desportiva Os Limianos**: Hauissa nousi esiin Wikipedia-sivuja (Vasco Costa, Zé Pedro s. 1992), mutta kasvattistatusta ei pystytty vahvistamaan lähteestä koska en.wikipedia.org oli WebFetchille estetty. Ei kirjattu arvauksena.
- **Rebordosa Atlético Clube**: Ei löytynyt lähdettä, joka nimeäisi seuran kasvatteja ammattilaistasolla. Hakutuloksissa esiintynyttä 'Pipo (s. 1992)' ei voitu varmistaa kasvatiksi (en.wikipedia estetty).
- **Atlético Clube de Vila Meã**: Haut seuran juniorirakenteesta vahvistivat joukkueiden olemassaolon, mutta yhtään nimettyä ammattilaiskasvattia ei mainittu Wikipediassa, zerozerossa eikä paikallismediassa (Expresso de Amarante).
- **Futebol Clube de Vinhais**: zerozero vahvistaa neljä ikäluokkajoukkuetta, mutta nimettyjä ammattilaiskasvatteja ei löytynyt Wikipediasta, FPF-rekisteristä eikä alueellisesta mediasta (Mensageiro de Bragança, Rádio Brigantia).
- **Associação Desportiva da Camacha**: Juniorijoukkueet vahvistettu zerozerosta, mutta nimettyjä ammattilaiskasvatteja ei mainittu Wikipediassa eikä Madeiran mediassa (JM-Madeira, Funchal Notícias).
- **Associação Desportiva de Castro Daire**: Juniorijoukkueet vahvistettu zerozerosta, mutta nimettyjä ammattilaiskasvatteja ei löytynyt Wikipediasta eikä alueellisesta mediasta (Diário de Viseu, Jornal do Centro, Dão Digital).
- **Associação Desportiva de Machico**: Seuran oma sivusto (admachico.com) ja Wikipedia ovat egress-estettyjä; hakukoneyhteenvedot kuvasivat formação-rakenteen mutta eivät nimenneet yhtään akatemiasta ammattilaiseksi noussutta pelaajaa.
- **Associação Desportiva Ovarense**: Kohdennettu haku Ovarensen kasvateista ei tuottanut nimiä; hakutulokset ajautuivat samannimisiin brasilialaisiin Internacional-seuroihin. zerozero.pt ja Wikipedia egress-estettyjä.
- **Clube Desportivo de Cinfães**: Ei löytynyt yhtään nimettyä CD Cinfãesin kasvattia; seuran formação-uutisointi koskee vain valmentajanimityksiä.
- **Estrela da Calheta Futebol Clube**: Ei löytynyt yhtään nimettyä ammattilaispelaajaa, joka olisi noussut seuran akatemiasta. Haut zerozero-, AF Madeira- ja Wikipedia-lähteistä eivät tuottaneet kasvattilistaa.
- **Futebol Clube de Alpendorada**: Ei löytynyt nimettyjä akatemiasta ammattilaisiksi nousseita pelaajia; pt.wikipedia-artikkeli ja freguesian sivu eivät listaa kasvatteja.
- **Florgrade Futebol Clube**: Seura on perustettu 2019 (11-hengen jalkapallo), joten omia akatemiasta noussutta ammattilaista ei ole raportoitu missään lähteessä.
- **Guarda Futebol Clube (Guarda Futebol Clube – Futebol, SAD)**: Seura perustettu 2019, ei vielä tunnistettuja ammattilaisiksi nousseita omia kasvatteja.
- **Sport Clube Beira-Mar**: Seuran omat lähteet listaavat neljä Portugalin maajoukkuepelaajaa (Samuel Silva, Sérgio Monteiro, Israel Ferreira, Francisco Silva), mutta ne ovat FUTSAL-maajoukkuepelaajia. Jalkapallon puolelta ei löytynyt lähteistettyä kasvattilistaa hauilla beiramar.pt/academia + wikipedia; kenttä jätetty nulliksi ettei sekoiteta lajeja. Tiedot kirjattu academy.notes-kenttään.
- **Clube de Futebol União de Lamas**: Yhtään nimettyä ammattilaiskasvattia ei löytynyt hauilla («União de Lamas» formação / jogadores formados). Seuran juniorimäärääkään ei ilmoitettu numeerisesti julkisissa lähteissä.
- **Atlético Clube da Malveira**: Hauilla ei löytynyt yhtään nimettyä ammattilaiseksi noussutta akatemiakasvattia. Seurasivu (acmalveira.pt) ja zerozero olivat egress-proxyn estämiä, joten kasvattilistaa ei päästy tarkistamaan.
- **Associação Desportiva Fazendense**: Ei löytynyt nimettyjä ammattilaiseksi nousseita kasvatteja. zerozero.pt oli WebFetch-eston takana, joten kasvattilistaa ei voitu tarkistaa.
- **Associação Desportiva Nogueirense**: Transfermarktilla on Formação-sivu, mutta kasvattien nimiä ei saatu esiin hakutulostiivistelmistä eikä sivua voitu hakea (egress-esto).
- **Centro Desportivo de Fátima**: Vahvistettiin että 16/23 edustusjoukkueen pelaajasta on seuran kasvatteja, mutta yksittäisten ammattilaisuralle nousseiden kasvattien nimiä ei saatu esiin. zerozero.pt ja Transfermarkt olivat egress-eston takana.
- **Futebol Clube de Oliveira do Hospital**: Hauista ei löytynyt yksittäisiä nimettyjä ammattilaiskasvatteja; Wikipedia-artikkeleita ei voitu hakea (egress-esto).
- **Mortágua Futebol Clube**: Ei löytynyt nimettyjä ammattilaiskasvatteja hauilla.
- **Associação Naval 1893**: Ei löytynyt nimettyjä akatemiakasvatteja. Seura on nykymuodossaan vasta vuodelta 2017, joten ammattilaisuuteen edenneitä kasvatteja tuskin vielä on; edeltäjäseuran (Naval 1º de Maio) kasvatteja ei liitetty tähän juridiseen yksikköön missään löytyneessä lähteessä.
- **O Elvas Clube Alentejano de Desportos**: Ei löytynyt nimettyjä akatemiakasvatteja. Seuraa kuvataan lähteissä 'legendaaristen pelaajien' seuraksi, mutta yhtään nimeä ei voitu varmistaa kasvatiksi ilman Wikipedia-/zerozero-sivujen avaamista (egress-esto).
- **Clube de Futebol "Os Marialvas"**: Ei löytynyt nimettyjä ammattilaisuuteen edenneitä kasvatteja, vaikka juniorityö on vahvaa (piirimestaruuksia). Haku kohdistui seuran ja kunnan uutisiin.
- **Sertanense Futebol Clube**: Kohdennettu haku ('jogadores formados no clube que chegaram ao futebol profissional') ei tuottanut yhtään varmistettua nimeä. Kasvattien jäljittäminen vaatisi zerozero-seurasivun avaamista, mikä on egress-eston takana.
- **Sport Benfica e Castelo Branco**: Haku '"Benfica e Castelo Branco" formado jogador internacional' ei tuottanut yhtään nimettyä akatemiakasvattia. Löytyi vain seurassa pelanneita (esim. Jordão Cardoso, joka kasvoi Vianensessa/Rio Avessa) sekä lista eniten II Liga -otteluita pelanneista. Kasvattien ja pelanneiden erottelu vaatisi zerozeron pelaajasivut, jotka ovat estetty.
- **União Desportiva da Serra**: Kylätason seura (~4 600 as. freguesia), nousi kansalliselle tasolle vasta 2021-22. Ei löytynyt yhtään nimettyä kasvattia hakutuloksista.
- **Amora Futebol Clube**: Lähteet sanovat että 'tuhannet nuoret ovat pelanneet Amoran junioreissa ja osa on noussut maajoukkuetasolle', mutta yhtään nimeä ei mainita. Nimilistan saisi zerozeron kasvattisivulta, joka on estetty. Mainittu Cláudio Lourenço (B-joukkueen kapteeni) on nykypelaaja, ei merkittävä kasvatti.
- **Futebol Clube de Serpa**: Yksi hakutiivistelmä väitti seuralla olevan 'vahva akatemia joka on tuottanut monia lahjakkuuksia huippuseuroihin', mutta tämä oli selvästi hakukoneen yleistävää täytetekstiä ilman yhtään nimeä tai lähdettä — EI kirjattu. Nimettyjä kasvatteja ei löytynyt.
- **Grupo Desportivo Alcochetense**: Seuran oma historiikki luettelee seuran kautta kulkeneita pelaajia (Barrinha, João Mário, Fernandinho, Rui Pataca ym.), mutta ei erottele omia kasvatteja läpikulkijoista. Fabrício Simões esiintyi hauissa, mutta A Bolan otsikon perusteella hänet HANKITTIIN seuraan ammattilaisurान jälkeen ("goleador profissional convencido por antigo dirigente do Sporting"), joten häntä ei merkitty kasvatiksi.
- **Grupo Desportivo de Lagoa**: pt.wikipedia ja AF Algarve vahvistavat kaikkien ikäluokkien toiminnan, mutta eivät nimeä akatemiasta nousseita ammattilaisia.
- **GD Portel**: Ei löytynyt mainintoja akatemiasta nousseista ammattilaisista pienen alentejolaisseuran kohdalla.
- **Juventude Desportiva Lajense**: Ei löytynyt lähdettä seurasta ammattilaisiksi nousseista kasvateista (haut pt-kielellä + zerozero/Transfermarkt estetty).
- **Juventude Sport Clube (Évora)**: Ei löytynyt lähdettä Juventude de Évoran kasvateista, jotka olisivat nousseet ammattilaisiksi.
- **Clube Desportivo Santa Clara B**: Ei löytynyt dokumentoitua listaa Santa Claran omista kasvateista, jotka olisivat nousseet merkittäviksi ammattilaisiksi.
- **Sport Clube Mineiro Aljustrelense**: Haettiin portugaliksi kasvateista ('jogador formado no clube'); ei löytynyt yhtään nimettyä ammattilaiskasvattia. Seuran oma sivu kertoo vain 1970-luvun juniorijoukkueen menestyksestä ilman pelaajanimiä.
- **Vitória Futebol Clube**: Haettiin portugaliksi seuran kasvateista; hakutulokset eivät sisältäneet vahvistettuja pelaajanimiä. Historiallisesti merkittävä akatemia, mutta ilman luotettavaa lähdettä nimiä ei kirjattu.
- **União Desportiva de Leiria**: Haetut lähteet (seuran akatemiasivut, uutiset) eivät nimeä yksittäisiä tunnettuja kasvatteja; seura mainitsee vain yleisesti siirtoja isompiin seuroihin.
- **Caldas Sport Clube**: Yksittäisiä dokumentoituja akatemiakasvatteja ei löytynyt. Hakutuloksissa mainittiin Thomas Militão (lähes 400 ottelua seurassa) ja João 'Tarzan' Rodrigues (Taça de Portugal 2021/22 maalikuningas 7 osumalla), mutta kummankaan kohdalla ei vahvistettu että he olisivat seuran omia kasvatteja — siksi jätetty null arvauksen välttämiseksi. pt.wikipedian jugadores notáveis -osiota ei päästy lukemaan (WebFetch estetty).
- **Grupo Desportivo Vitória de Sernache**: Haut 'Vitória de Sernache formação/jogador formado/academia' eivät tuottaneet yhtään nimettyä ammattilaispelaajaa, joka olisi kasvatettu seurassa. Kyseessä pieni sisämaaseura, joka nousi piirisarjasta kansalliselle tasolle vasta 2024-2026.
- **Louletano Desportos Clube**: Seuralla on dokumentoitu junioriosasto ja jalkapallokoulut vuodesta 1974, mutta yhtään akatemiasta noussutta ammattilaista ei voitu vahvistaa nimeltä. Hakutuloksissa esiintyneet 1990-luvun nimet (Mauricinho, Fernando, Gilmar) olivat hankintoja, eivät kasvatteja; maisfutebol-artikkelissa mainittu nuori João Reis jäi vahvistamatta (sivu ei haettavissa).
- **Lusitano Ginásio Clube**: Nenhuma fonte encontrada que NOMEIE profissionais formados no clube. Os extratos de busca referem apenas, de forma anónima, 'um defesa-central/médio defensivo nascido em Évora, formado no Lusitano, que fez quase toda a carreira no clube (equipa principal de 1987-88 a 1996-97)' — insuficiente para registar um nome. As listas do blog davidjosepereira.blogspot.com são de jogadores COM MAIS JOGOS, não de formados. Não inventado.
- **Sporting Clube da Covilhã**: Nenhuma fonte fiável a nomear jogadores FORMADOS no clube. Os nomes que surgiram nos resultados foram descartados por não corresponderem a formação no clube: Rui Barros surge como emprestado (2.ª divisão) e Luís Lourenço é descrito como formado no Sporting CP. As listas do blog davidjosepereira.blogspot.com são de 'jogadores com mais jogos', não de formados. Não inventado.
- **União Desportiva de Santarém**: Ei löytynyt yhtään nimettyä, UD Santarémin omasta akatemiasta ammattilaiseksi noussutta kasvattia. Haut ('formado no clube', 'formação', 'escalões') palauttivat vain MUUALLA kasvatettuja vahvistuksia (Martim Silva/FC Porto, Omaru King/Brentford, Luís Martins/FC Porto-Braga-Gil Vicente, Rafael Camacho/Sporting-Liverpool, Ricardo Ribeiro/Benfica B, Isnaba Graça/Academia Bissau). Seuran nykyinen akatemiarakenne on rakennettu pääosin vasta 2017 jälkeen, joten ammattilaisiksi edenneitä kasvatteja ei todennäköisesti vielä ole merkittävästi. Jätetty null keksimisen sijaan.
- **Académica**: Nimekkäistä kasvateista ei löytynyt luotettavaa koostavaa lähdettä kohtuullisella haulla (pt/en-Wikipedia ja seuran oma sivusto estetty proxyssa). Hakutuloksissa vain viitteitä nykyisistä/viimeaikaisista omista kasvateista (Costinha, Pedro Nuno, Hugo Seco ym.) ilman riittävää vahvistusta 'tunnetuiksi kasvateiksi'.
- **AFS**: Seura(yhtiö) nykymuodossaan vuodelta 2023 — ei vielä tunnettuja ammattilaiskasvatteja; ainoa löydetty esimerkki on U19-kasvatin (António Machado) nosto edustukseen.
- **CD Tondela**: Haut ('Tondela formação jogadores formados') eivät tuottaneet nimettyjä laajasti tunnettuja kasvatteja; akatemia tuottaa pelaajia edustusjoukkueeseen mutta ei tunnistettuja tähtikasvatteja.
- **FC Felgueiras 1932**: Seurassa pelanneita tunnettuja nimiä (Sérgio Conceição, Fernando Meira, José Fonte) löytyi, mutta yksikään lähde ei vahvistanut heitä akatemian kasvateiksi → null, ei arvata.
- **FC Penafiel**: Kohtuullisella haulla ei löytynyt lähteistettyä listaa Penafielin akatemian tunnetuista kasvateista → null.
- **FC Vizela**: Haulla ei löytynyt luotettavaa listaa tunnetuista FC Vizelan kasvateista; akatemia on FPF 4 tähden tasoinen, mutta yksittäisiä nimekkäitä ammattilaiskasvatteja ei varmennettu.
- **Leixões SC**: Haut (pt: 'jogadores formados no Leixões') eivät tuottaneet nimettyjä tunnettuja kasvatteja luotettavasta lähteestä; zerozero-kasvattilistaus estetty proxyssa.
- **Lusitânia de Lourosa FC**: Tunnettuja kasvatteja ei löytynyt kohtuullisella haulla (Wikipedia/zerozero estetty proxyssa; hakutulokset eivät nimenneet kasvatteja).
- **Portimonense SC**: Kasvattihakua ei voitu suorittaa (WebSearch-budjetti täynnä); akatemian olemassaolo merkitty yleistiedon perusteella.
- **AD Fafe**: Haku 'AD Fafe jogadores formados' ei tuottanut nimettyjä akatemiakasvatteja; vain lainapelaajamaininta (Rui Costa laina Benficasta 1990-91, ei kasvatti).
- **AD Marco 09**: Ei löytynyt nimettyjä tunnettuja kasvatteja hauilla; vain maininta juniorista (Paulo Violante), joka debytoi edustusjoukkueessa — ei riitä 'tunnetuksi kasvatiksi'.
- **CD Trofense**: Wikipedia (pt/en) ja zerozero.pt estetty proxyssa; hakutuloksista ei löytynyt nimettyjä tunnettuja kasvatteja. Akatemian olemassaolo vahvistettu (O Notícias da Trofa).
- **FC Paços de Ferreira**: Wikipedia (pt/en), zerozero.pt ja Transfermarktin jugendarbeit-sivu estetty proxyssa; hakutuloksista ei löytynyt nimettyjä tunnettuja kasvatteja. Akatemian olemassaolo vahvistettu (fcpf.pt).
- **Leça FC**: Haut (pt/en-wikipedia-tiivistelmät, seuran historia- ja formação-sivut) eivät nimenneet tunnettuja ammattilaiskasvatteja; suorat wikipedia-haut estetty proxyssa
- **SC São João de Ver**: Haut (wikipedia-tiivistelmät, seuran sivut, 'jogadores formados') eivät nimenneet tunnettuja kasvatteja
- **USC Paredes**: Kohtuullisella haulla ei löytynyt dokumentoituja ammattilaisiksi nousseita kasvatteja (juniorityö vahvaa, mutta nimettyjä huippukasvatteja ei uutisoitu).
- **Varzim SC**: Wikipedia/zerozero estetty egress-proxyssa ja hakubudjetti loppui — kasvattilistaa ei voitu varmentaa, jätetty null.
- **CD Mafra**: Ei löytynyt kasvattitietoja saavutettavissa olevista aineistoista (GitHub-peilit); Wikipedia estetty.
- **CF Os Belenenses**: Kasvattilistaa ei voitu vahvistaa saavutettavissa olevista aineistoista; Wikipedia ja zerozero estetty.

### `stadium.owner` (11)

- **União Desportiva Sousense**: Estádio 1º de Dezembron omistajaa ei vahvistettu. Epäsuorat viitteet ristiriitaisia: nimi (seuran perustamispäivä) ja osoite viittaavat seuran kenttään, mutta Câmara Municipal de Gondomar rahoitti 2022 nurmiremontin. Ei löytynyt kunnan kiinteistö- tai käyttösopimusdokumenttia. zerozero.pt ja pt.wikipedia estyivät suorasta WebFetchistä (403).
- **Clube de Futebol União de Lamas**: Omistajaa ei vahvistettu. Nimi (Comendador Henrique Amorim) ja Grupo Amorimin sponsorisidos viittaavat vahvasti seuran omaan mesenaattirahoitettuun kenttään, mutta suoraa lähdettä ei löytynyt eikä kunnan (Santa Maria da Feira) omistusta mainita missään. Ei arvattu.
- **Associação Desportiva Fazendense**: Estádio Dr. José Sousa Gomes kuvataan lähteissä seuran kotikenttänä ('Estádio do AD Fazendense'), mutta yksikään lähde ei totea omistajaa suoraan. Almeirimin kunta rahoittaa uutta tekonurmea (kesäkuu 2026), mikä ei todista omistusta; Almeirimissa on erillinen Estádio Municipal de Almeirim. Jätetty 'unknown' ettei arvata.
- **Futebol Clube de Alverca B**: Neljä hakua (mm. 'estádio propriedade do clube ou da câmara', 'terreno protocolo autarquia') eivät tuottaneet tietoa siitä, omistaako Complexo Desportivo do FC Alvercan / Centro de Formaçãon seura vai Vila Franca de Xiran kunta. Kunnan sivuilta löytyi vain erillinen Pavilhão Desportivo Municipal de Alverca.
- **Mortágua Futebol Clube**: Campo de Jogos da Gandaradan omistusta ei sanota eksplisiittisesti missään lähteessä. Kunta on rahoittanut LED-valaistuksen, kilpailuttanut nurmen huollon ja osarahoittanut (yhdessä FPF:n kanssa) pukuhuonelaajennuksen, mutta kentän nimi ei sisällä 'Municipal'-määrettä eikä omistusta vahvisteta → jätetty unknowniksi arvaamisen sijaan.
- **Sertanense Futebol Clube**: EI SELVINNYT. Campo de Jogos Dr. Marques dos Santos -kentän omistajaa ei mainittu zerozero-, maisfutebol- eikä Transfermarkt-hakutuloksissa, eikä nimessä ole 'Municipal'-etuliitettä (toisin kuin muilla tämän erän seuroilla). Kohdennettu haku Sertãn kunnan ja seuran suhteesta tuotti vain tietoa kunnan tuesta (palkitseminen, Sertã Cupin tukeminen), ei omistuksesta. Merkitty 'unknown'.
- **Futebol Clube de Serpa**: Kentän nimi 'Complexo Desportivo Manuel Baião' ei sisällä sanaa 'Municipal', eikä omistuksesta löytynyt mainintaa. Alentejon pienissä kunnissa kentät ovat usein kunnan, mutta tätä EI voitu vahvistaa — merkitty unknown arvauksen sijaan. Tarkistettavissa Serpan kunnan (cm-serpa.pt) urheilutilarekisteristä.
- **SC São João de Ver**: Omistajaa ei vahvistettu: cm-feira.pt:n liikuntapaikkasivu ja zerozero-tiivistelmä eivät kerro omistajaa; stadionin nimi viittaa seuran omaan kenttään mutta se ei riitä → unknown
- **Atlético CP**: Tapadinhan omistajaa (seura vs. kunta) ei löytynyt saatavilla olleista hakutiivistelmistä; seuran oma sivu atleticocp.pt ja maisfutebol.iol.pt estetty.
- **CF Os Belenenses**: Restelon omistus-/maapohjajärjestelyä (seura vs Lissabonin kaupunki) ei voitu varmistaa: ensisijaiset lähteet (Wikipedia, zerozero, seuran sivut) estetty egress-proxyssa → unknown.
- **UD Oliveirense**: Ei löytynyt lähdettä Estádio Carlos Osórion omistajasta (kunta vs. seura); zerozero.pt ja uutislähteet estetty. Nimessä ei 'Municipal'-etuliitettä, mikä ei riitä perusteeksi → unknown.

### `ownership.foreign_investor` (9)

- **Associação Desportiva Ovarense**: Jätetty nulliksi: SAD-rakenne on olemassa, joten ulkomainen osakas on periaatteessa mahdollinen, mutta osakasluetteloa ei saatu -> ei voida todeta true eikä false.
- **Sport Comércio e Salgueiros**: Ei tietoa osakkaista, joten ulkomaista sijoittajaa ei voi vahvistaa eikä sulkea pois. Jätetty nulliksi (ei false), koska poissulkevaa lähdettä ei ole.
- **Sertanense Futebol Clube**: Jätetty nulliksi (ei false): ulkomaisia sijoittajia ei löytynyt, mutta hauissa ei myöskään löytynyt lähdettä joka nimenomaisesti käsittelisi seuran omistus-/sijoittajatilannetta — kyse on todistusaineiston puutteesta, ei vahvistetusta puuttumisesta.
- **Sport Benfica e Castelo Branco**: Jätetty null:iksi arvauksen sijaan. Ei löytynyt SAD-yhtiötä eikä sijoittajia, mutta 'ei löytynyt' ei ole sama kuin varmistettu ei — yhdistysmuotoisella seuralla ei tosin lähtökohtaisesti ole osakkeenomistajia.
- **Real Sport Clube**: Ei tietoa SAD:n osakkaiden kansallisuuksista; ei uutisia ulkomaisista sijoittajista. Jätetty null (ei voitu vahvistaa ei-kumpaankaan suuntaan).
- **Grupo Desportivo Vitória de Sernache**: Ei tietoa ulkomaisista sijoittajista suuntaan tai toiseen; haut 'investidor OR acionistas' eivät tuottaneet seurakohtaisia osumia.
- **Louletano Desportos Clube**: Seuran sijoittajakumppani Hugo Garcia on vahvistettu ('empresário e investidor'), mutta hänen kansalaisuuttaan tai sijoitusvälinettään ei saatu selville, joten foreign_investor jätetty tyhjäksi arvaamisen sijaan.
- **CD Trofense**: TSC – Trof Sports Centerin kotipaikka on Trofassa (NSS Vila do Condessa), mutta yksittäisten sijoittajien (mm. Anderson Gonçalves / Brights Height) kansallisuus ei selvinnyt lähteistä; aiempi yhdysvaltalainen S&A-kauppa purettiin.
- **Leça FC**: Ei viitteitä ulkomaisesta sijoittajasta, mutta osakasrakennetta ei saatu vahvistettua → null eikä false

### `sale.price_indication_eur` (6)

- **Associação Desportiva Sanjoanense**: Kumpaakaan omistusjärjestelyä (AMCNO 90 % / 2025, James Yott ~80 % / 2026) ei julkistettu kauppahinnalla; Cuatrecasas-, ECO- ja seuran omat tiedotteet eivät sisällä arvostusta.
- **Sport União Sintrense**: Blue Ocean Groupin 75 %:n kauppa (tammikuu 2026) ja Coralcompassin kauppa (helmikuu 2026) vahvistettu, mutta kauppahintaa ei julkistettu missään löydetyssä lähteessä; eco.sapo.pt estetty egress-proxylla, joten ECO:n artikkelin mahdollisia lukuja ei voitu lukea.
- **Sporting Clube de Portugal B**: Ei relevantti: B-joukkuetta ei voi ostaa erillään Sporting SAD:sta.
- **União Desportiva de Leiria**: Maaliskuun 2025 osakekaupan (yhdysvaltalainen rahasto osti osan Navdeep Singhin 90 %:n osuudesta) hintaa ei julkistettu missään löydetyssä lähteessä.
- **Leixões SC**: Aliya Capital Partners -periaatesopimuksen (8/2025) arvoja ei julkistettu missään löydetyssä lähteessä.
- **USC Paredes**: SAD perustettiin 5/2026 sijoittaja Rui Caetanon kanssa, mutta sijoitussummaa tai osuusprosentteja ei julkistettu uutislähteissä.

### `sale.status` (6)

- **Caldas Sport Clube**: Jätetty arvoon 'unknown' vaikka dokumentoitu signaali on olemassa: Gazeta das Caldas (12/2023) raportoi seuran avoimuudesta SAD:n perustamiselle ja KPMG:n mandaatista etsiä sijoittajia. Prosessin nykytilaa ei voitu vahvistaa millään 2025–2026 lähteellä, ja tuoreet uutiset (positiivinen tulos 2024/25, johdon uudelleenvalinta 95,3 %:lla 4/2026, yhdistysrakenne ennallaan) viittaavat siihen ettei prosessi ole aktiivinen. Ohjeen mukaan 'seeking_investors' vaatii tuoreen julkisen tuen. Täysi konteksti sale.notes-kentässä.
- **Vitória Sport Clube B**: Jätetty arvoon 'unknown'. Ei julkista myynti-ilmoitusta 2026. Signaaleja molempiin suuntiin: vaaliehdokas Júlio Vieira de Castro haluaa reaktivoida V Sports -kumppanuuden (6/2026), mutta samaan aikaan uutisoitiin seuran torjuneen 13 M€:n järjestelyn ja syyttäneen osakasta sopimusrikkomuksesta. V Sports on jo sisällä 29 %:lla eikä ole ilmoittanut exitistä. Ei riittävää julkista tukea arvoille 'for_sale' tai 'seeking_investors'.
- **Grupo Desportivo Vitória de Sernache**: Ei julkista lähdettä myynnistä tai sijoittajahausta -> pysyy 'unknown' ohjeen mukaan. Elokuun 2026 Brands Capital -analyysin ~29 sijoittajia hakevan seuran listaus on anonyymi, eikä sitä voi kohdistaa tähän seuraan.
- **Louletano Desportos Clube**: Ei julkista myynti- tai sijoittajahakuilmoitusta -> 'unknown'. Seuralla on jo olemassa yksityinen rahoittajakumppani (Hugo Garcia), mutta se ei ole osakekauppa eikä myyntisignaali.
- **CD Mafra**: Julkisia seurakohtaisia myynti-/sijoittajasignaaleja ei voitu hakea (haut estetty); elokuun 2026 Brands Capital -listaukset anonyymejä → status jää 'unknown'.
- **CF Os Belenenses**: Julkisia seurakohtaisia myynti-/sijoittajasignaaleja ei voitu hakea (haut estetty); Brands Capital -listaukset anonyymejä → 'unknown'.

### `stadium.capacity` (3)

- **Atlético Clube de Vila Meã**: Lähteet ristiriidassa: 2 950 (en.wikipedia / zerozero-pohjaiset hakutulokset) vs 4 500 (Transfermarkt / Soccerway -pohjaiset). Ristiriitaa ei voitu ratkaista, koska WebFetch zerozero.pt-, transfermarkt.us- ja wikipedia-domaineihin on estetty organisaation egress-politiikalla (EGRESS_BLOCKED). Jätetty null; molemmat luvut kirjattu stadium.notes-kenttään.
- **Futebol Clube de Alverca B**: B-joukkueen kotikenttä on Centro de Formação do FC Alverca, jonka kapasiteettia ei ilmoiteta missään löydetyssä lähteessä. Emoseuran pääareenan luvut (7 705 igogo/zerozero vs. 6 932 Liga Portugal Guia do Adepto 2025) ovat lisäksi ristiriidassa keskenään, joten niitä ei siirretty B-joukkueen kentän kapasiteetiksi.
- **Futebol Clube de Serpa**: JÄTETTY TYHJÄKSI: kaksi hakua antoi täysin ristiriitaiset luvut (3 500 ja 10 000). 10 000 on epäuskottava 13 757 asukkaan kunnassa ja liittyi hakuun joka myös keksi stadionin nimen väärin ('Estádio Municipal de Serpa'), joten se on todennäköisesti hakukoneen tiivistelmävirhe. 3 500 esiintyi vain kerran eikä sitä voitu vahvistaa. Ohjeen 'älä koskaan keksi lukua' mukaisesti null. Ratkeaa zerozero-sivulta https://www.zerozero.pt/estadio.php?id=2127 kun esto poistuu.

### `_method` (3)

- **Atlético Clube da Malveira**: METODIHUOMAUTUS KOKO ERÄLLE: WebFetch oli estetty kaikille kohdesivustoille (pt.wikipedia.org, en.wikipedia.org, zerozero.pt, www.fpf.pt, acmalveira.pt, afl.pt palauttivat EGRESS_BLOCKED / 403 CONNECT agent-proxyn kautta). Kaikki data on siksi kerätty WebSearchin palauttamista sisältötiivistelmistä, ja sources-URLit viittaavat alkuperäissivuihin joita ei voitu itse avata. Lukuarvot (kapasiteetit, väkiluvut, perustamisvuodet) on otettu vain silloin kun ne esiintyivät eksplisiittisesti hakutulostiivistelmässä; mitään ei ole pääteltyä tai arvattua. Koordinaatit, coastal-arvot ja etäisyydet ovat sallittua maantieteellistä yleistietoa/karttapäättelyä toimeksiannon kohdan 6 mukaisesti.
- **Grupo Desportivo Vitória de Sernache**: YLEINEN RAJOITE TÄSSÄ AJOSSA: verkon egress-proxy esti WebFetchin käytännössä kaikilta kohdesivustoilta (pt.wikipedia.org, en.wikipedia.org, zerozero.pt, transfermarkt.us, jn.pt, sapo.pt, cm-serta.pt, geoapi.pt, radiocastelobranco.sapo.pt jne. — kaikki EGRESS_BLOCKED). Kaikki data on siksi kerätty WebSearch-hakutulosten tiivistelmistä ja snipeteistä, jotka on ristiinvahvistettu useasta hausta. Lähde-URLit ovat oikeita ja hakutuloksissa esiintyneitä, mutta niiden sisältöä ei voitu lukea suoraan. Tämä laskee luottamustason 'medium'-tasolle molemmilla seuroilla.
- **Louletano Desportos Clube**: Sama rajoite kuin yllä: WebFetch estetty kaikilta kohdesivustoilta egress-proxyn toimesta; data kerätty ristiinvahvistetuista WebSearch-snipeteistä. Kapasiteettitiedoissa havaittiin ristiriita lähteiden välillä (en.wikipedia merkitsee virheellisesti 30 305 Estádio Municipal de Loulén kapasiteetiksi), ratkaistu erottamalla kaksi eri areenaa toisistaan.

### `ownership.structure` (3)

- **Associação Naval 1893**: Ei mapatu enumiin: jalkapallo on sporttiyhtiössä 'Associação Naval 1893 – Futebol SDQ, Lda' eli Sociedade Desportiva por Quotas — sporttiyhtiö mutta EI SAD. Ohjeen mukaan SAD merkitään vain jos lähde vahvistaa SAD:n, joten structure = 'unknown'; täydelliset omistustiedot (osuudet %) kirjattu ownership.owners-kenttään. Enumiin kaivattaisiin arvo 'SDQ'/'sociedade desportiva'.
- **Atlético CP**: SAD todistetusti olemassa 2013/14 (ligaportugal.pt-seurasivu 'Atlético Clube de Portugal – Futebol, SAD'), mutta nykytilaa 2026 (SAD aktiivinen vai futebol clube-yhdistyksen alla) ei voitu varmistaa — jatkohaut estyivät.
- **CD Mafra**: Uutishakuja ('CD Mafra' SAD / venda / investidor / acionistas) ei voitu tehdä: WebSearch-kiintiö täynnä (200/200) ja pt-uutissivustot, Wikipedia ja zerozero estetty verkon egress-proxyssa. GitHub-aineistoista ei löytynyt SAD/SDUQ-mainintaa.

### `city_population` (3)

- **Varzim SC**: WebSearch-budjetti (200/200) täyttyi ennen INE/Censos 2021 -hakua; pt.wikipedia.org, en.wikipedia.org ja INE eivät saavutettavissa (egress-proxy estää suorat haut). Ei lukua ilman lähdettä.
- **Atlético CP**: pt/en.wikipedia.org ja INE estetty egress-proxyssa; WebSearch-kiintiö (200/200) täyttyi ennen väkilukuhakua. Ei lukua ilman lähdettä.
- **UD Oliveirense**: INE, pt/en-Wikipedia ja muut väestölähteet estetty verkon egress-proxyssa (403) ja WebSearch-budjetti täynnä (200/200). GitHubin sensusdatasetit eivät sisältäneet Oliveira de Azeméisin kuntakohtaista kokonaisväkilukua. Ei arvattu.

### `city_population_kind` (2)

- **União Desportiva da Serra**: SKEEMARISTIRIITA: kotipaikka Santa Catarina da Serra on freguesia (União das Freguesias de Santa Catarina da Serra e Chainça, 4 572 as. Censos 2021), ei município eikä cidade. Enum sallii vain 'municipio'/'cidade'/null, joten kind = null ja kenttään on kirjattu freguesian todellinen luku. Leirian kunnan (município) väkilukua ei varmistettu erikseen tässä ajossa — jos pisteytys tarvitsee kuntatason valuma-alueen, se on haettava erikseen.
- **AFS**: Vila das Aves on vila/freguesia Santo Tirson kunnassa — luku 7 946 (Censos 2021) koskee freguesiaa, joten kumpikaan sallituista arvoista ('municipio'/'cidade') ei sovellu; kind jätetty null ja asia selitetty lähdeviitteessä.

### `sources.primary_access` (2)

- **Lusitano Ginásio Clube**: LIMITAÇÃO DE AMBIENTE, não do clube: pt.wikipedia.org, en.wikipedia.org, zerozero.pt, transfermarkt, ojogo.pt, record.pt, craques.pt e radiocampanario.com estão todos bloqueados pelo egress proxy da organização (403 ao CONNECT; ver /root/.ccr/README.md). Todos os factos foram extraídos de resumos/snippets do motor de busca dessas mesmas páginas, corroborados entre fontes independentes. Recomenda-se revalidação numa sessão com acesso direto.
- **Sporting Clube da Covilhã**: LIMITAÇÃO DE AMBIENTE: wikipedia.org, zerozero.pt, transfermarkt, ojogo.pt, record.pt e outros domínios estão bloqueados pelo egress proxy da organização (403 ao CONNECT). Toda a recolha foi feita via resumos do motor de busca, com corroboração cruzada entre fontes independentes (radio-covilha.pt, ointerior.pt, urbietorbi.ubi.pt, observador.pt, RTP, SAPO Desporto). Recomenda-se revalidação numa sessão com acesso direto.

### `city/district/coords` (2)

- **Lusitano Ginásio Clube**: HUOM: täytetty sallittuna yleistietona (Lusitano GC = Évora, Évoran piiri; maantiede laskettu koordinaateista). Web-verifiointia ei voitu tehdä — QA-vaiheen syytä tarkistaa.
- **Sporting Clube da Covilhã**: HUOM: täytetty sallittuna yleistietona (nimi viittaa suoraan Covilhãan, Castelo Brancon piiri; maantiede laskettu koordinaateista). Web-verifiointia ei voitu tehdä — QA-vaiheen syytä tarkistaa.

### `METHOD-NOTE` (1)

- **Associação Desportiva de Machico**: TÄRKEÄ METODIRAJOITE KOKO ERÄLLE: kaikki WebFetch-kutsut epäonnistuivat egress-politiikan estoon (EGRESS_BLOCKED) — estetyt isännät mm. pt.wikipedia.org, en.wikipedia.org, www.zerozero.pt, www.transfermarkt.pt, admachico.com. Vain WebSearch toimi. Kaikki tässä erässä raportoidut kentät perustuvat siksi hakukoneen sisältöyhteenvetoihin nimetyistä lähde-URLeista, ei suoraan luettuun sivusisältöön. URLit on kirjattu sources-listoihin, jotta ne voidaan verifioida ajossa, jossa egress sallii nämä isännät. Politiikkaestoja ei kierretty.

### `metodologia` (1)

- **Futebol Clube de Alverca B**: YLEINEN RAJOITE TÄSSÄ ERÄSSÄ: WebFetch epäonnistui kaikkiin ensisijaisiin lähteisiin — pt.wikipedia.org, en.wikipedia.org, zerozero.pt, ogol.com.br, transfermarkt, fpf.pt, worldfootball.net kaikki palauttivat egress-proxyn 403 CONNECT (organisaation egress-politiikka). Kaikki tiedot on koottu WebSearch-tulosten tiivistelmistä, ja lähde-URLit viittaavat sivuihin, joita ei voitu avata suoraan. Suositus: aja tämä erä uudelleen ympäristössä, jossa wikipedia/zerozero ovat sallittuja, erityisesti stadionien kapasiteettien ja omistusten varmistamiseksi.

### `sources.access` (1)

- **Vitória Sport Clube B**: METODOLOGINEN HUOMAUTUS (koskee molempia seuroja): tämän session egress-proxy esti WebFetchin kaikkiin ensisijaisiin lähdedomaineihin — pt.wikipedia.org, en.wikipedia.org, www.zerozero.pt, www.transfermarkt.us ja gazetadascaldas.pt palauttivat kaikki EGRESS_BLOCKED. Kaikki data on kerätty WebSearch-tulosten sisältöyhteenvetojen kautta, jotka siteeraavat näitä samoja lähteitä. URL:t sources-listassa ovat siis oikeat alkuperäislähteet, mutta niitä ei ole voitu lukea suoraan — suositellaan varmistusta jos yksittäinen luku on päätöksenteon kannalta kriittinen.

### `ownership.entity_name` (1)

- **Lusitano Ginásio Clube**: Ambiguidade de entidade nas bases de dados: o Transfermarkt e o Maisfutebol listam 'Associação Lusitano de Évora 1911' (TM id 3275; MF id 47726) em paralelo com 'Lusitano Ginásio Clube' (MF id 2737), e a FPF regista 'Lusitano De Évora Clube' (id 5832). Provável resíduo do divórcio clube/SAD de 2019, mas não foi possível confirmar qual a denominação jurídica exata da entidade inscrita na Liga 3 2026/27. Campo 'name' preenchido com o nome histórico e corrente 'Lusitano Ginásio Clube'.

### `sale.status_confirmation` (1)

- **CD Trofense**: Yhtiökokous hyväksyi TSC-kaupan 28.10.2025 ja uusi SAD-hallitus aloitti 12/2025, mutta kaupan lopullista täytäntöönpanoa ei löytynyt eksplisiittisesti uutisista — status 'recently_sold' perustuu näihin; huomioitava aiemman S&A-kaupan kariutuminen.

### `yleinen_lähdehuomio` (1)

- **UD Oliveirense**: Ympäristörajoite: kaikki suorat verkkolähteet (pt/en-Wikipedia, zerozero.pt, Transfermarkt, FPF, uutissivustot, hakukoneet) estetty egress-proxyssa ja WebSearch-budjetti käytetty (200/200). Tiedot koottu GitHubiin arkistoiduista kopioista (en-Wikipedia-peiliteksti, Wikidata-johdetut stadion-CSV:t, sports-data-feedit, Diário da República -arkisto, uutisotsikko/Bluesky-arkistot elokuu 2025-heinäkuu 2026). Peililähteiden ajantasaisuus kannattaa varmentaa, kun ensisijaislähteet ovat taas saavutettavissa.

## Menetelmälliset rajoitteet

- Ajoympäristön egress-proxy estää suorat sivulataukset lähdesivustoille
  (wikipedia.org, zerozero.pt, fpf.pt, transfermarkt, useat pt-uutissivustot).
  Tutkimus nojaa siksi hakukonetulosten sisältöreferaatteihin. URL-lähteet on
  kirjattu, mutta niiden sisältöä ei voitu avata uudelleen verifiointia varten.
- Maantieteelliset kentät (`coords`, `coastal`, `coast_distance_km`,
  `nearest_major_city`) ovat kartta- ja koordinaattipäättelyä, joka on
  tehtävänannossa sallittu menetelmä. Ne eivät ole lähteistettyjä lukuja.
- Kun lähteet olivat ristiriidassa (esim. stadionkapasiteetti), valittu arvo ja
  ristiriita on kirjattu seuran `stadium.notes`-kenttään.
