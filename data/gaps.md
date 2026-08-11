# Puuttuvat ja epävarmat tiedot (gaps)

Kirjanpito tiedoista, joita ei löydetty julkisista lähteistä tai jotka jäivät
epävarmoiksi. Sääntö: lukua ei koskaan keksitä — puuttuva tieto on `null`
datassa ja rivi tässä tiedostossa.

Päivitetty: 2026-08-11

## Sarjakokoonpanot

- **CdP Série D, avoin paikka ("clube a designar")**: Liga 3:sta pudonneen
  1.º Dezembron (Sintra) osallistuminen oli lohkoarvonnan (25.7.2026) hetkellä
  auki osallistumisedellytysten (uutisoidut palkkarästiväitteet, seura kiisti)
  vuoksi; Sacavenense on vaatinut paikkaa itselleen. Paikan lopullista saajaa
  ei löytynyt julkisista lähteistä 11.8.2026 mennessä. Série D:ssä on datassa
  siksi 13 seuraa. Lähteet: record.pt (sorteio-uutinen), abola.pt (24.7.2026).
- **GD Fabril (Barreiro)**: tehtävänannossa mainittu tason 4 seurana, mutta ei
  esiinny minkään CdP-lohkon 2026/27-listassa (kaksi riippumatonta hakua).
  Syytä ei varmistettu — ilmeisesti seura ei pelaa CdP:ssä 2026/27.
- **CdP-seurojen viralliset nimietuliitteet** (GD/AD/FC…): osa lähteistä
  käyttää lyhytmuotoja (esim. "Vinhais", "Celoricense", "Vila Meã", "Cinfães",
  "União de Lamas") — etuliitteet vahvistetaan seurakohtaisessa tutkimuksessa
  (vaihe 3c).
- **AD Nogueirense / UD Serra (CdP Série C)**: seuran tarkka identiteetti ja
  kotipaikka vahvistettava seurakohtaisessa tutkimuksessa (kaksi lähdettä
  käytti eri nimimuotoja, kotipaikka ei varmistunut kokoonpanohaussa).

## Tekniset rajoitteet

- Ympäristön egress-proxy estää suorat sivulataukset useille lähdesivustoille
  (wikipedia.org, zerozero.pt, fpf.pt, transfermarkt, useat pt-uutissivustot →
  403). Tutkimus nojaa siksi hakukonetulosten sisältöreferaatteihin ja
  ristiinvarmistukseen useasta riippumattomasta lähteestä. Kokoonpanot on
  varmistettu vähintään kahdesta riippumattomasta lähteestä.

## Seurakohtaiset aukot

Täydentyy tutkimusvaiheissa 3a–3c (ks. myös kunkin seuran `sources`- ja
`confidence`-kentät datassa).

### Liga 2 -tutkimusaalto (2026-08-11)

- **Kaikki tason 2–3 seurat (38)** · `attendance.average`: Transfermarkt ja varalähteet estetty ympäristön egress-proxyssa (403) ja session WebSearch-kiintiö (200 hakua) täyttyi — kauden 2025-26 yleisökeskiarvoja ei voitu varmentaa mistään lähteestä. Lukuja ei arvattu. Täydennetään erillisajossa (ks. scripts/research-club.md).
- **Lähes kaikki seurat** · `academy.fpf_certification`: FPF:n Entidades Formadoras -sertifiointilistaa (fpf.pt) ei voitu hakea (egress-proxy 403 + WebSearch-kiintiö täynnä). Vain kahdelle seuralle (mm. FC Vizela, 4 ★) taso löytyi seurakohtaisista uutislähteistä. Täydennetään erillisajossa.
- **academica** · `academy.notable_products`: Nimekkäistä kasvateista ei löytynyt luotettavaa koostavaa lähdettä kohtuullisella haulla (pt/en-Wikipedia ja seuran oma sivusto estetty proxyssa). Hakutuloksissa vain viitteitä nykyisistä/viimeaikaisista omista kasvateista (Costinha, Pedro Nuno, Hugo Seco ym.) ilman riittävää vahvistusta 'tunnetuiksi kasvateiksi'.
- **academica** · `estimated_price_eur`: Ei toteutunutta kauppaa eikä yksiselitteistä hintapyyntöä. SAD-hankkeen uutisoidut ehdot (sijoittajalle 70 %; ~7,5 M€ velkojen kattaminen + 3,4 M€ pääomitus; amerikkalainen alkuinvestointi ~5 M€) kirjattu sale.notes-kenttään — lukuja ei voi luotettavasti muuntaa kauppahinnaksi, ja lähteiden summat poikkeavat toisistaan.
- **afs** · `academy.notable_products`: Seura(yhtiö) nykymuodossaan vuodelta 2023 — ei vielä tunnettuja ammattilaiskasvatteja; ainoa löydetty esimerkki on U19-kasvatin (António Machado) nosto edustukseen.
- **afs** · `city_population_kind`: Vila das Aves on vila/freguesia Santo Tirson kunnassa — luku 7 946 (Censos 2021) koskee freguesiaa, joten kumpikaan sallituista arvoista ('municipio'/'cidade') ei sovellu; kind jätetty null ja asia selitetty lähdeviitteessä.
- **amarante-fc** · `stadium.capacity`: Lähteet ristiriitaisia: zerozero 5 000 (käytetty), Liga Portugal 2 500, yksi lähde 8 000. Suora fetch zerozeroon/Wikipediaan estetty proxyssa, joten lukua ei voitu varmistaa alkuperäissivulta — ristiriita kirjattu stadium.notes-kenttään.
- **cd-feirense** · `estimated_price_eur`: Ei seurakohtaista hintaevidenssiä (ei uutisoitua hintapyyntöä eikä toteutunutta kauppaa; Tavistockin 2015-kaupan hintaa ei uutisoitu hauissa). Sarjatason tyyppihaarukka lisätään keskitetysti.
- **cd-tondela** · `academy.notable_products`: Haut ('Tondela formação jogadores formados') eivät tuottaneet nimettyjä laajasti tunnettuja kasvatteja; akatemia tuottaa pelaajia edustusjoukkueeseen mutta ei tunnistettuja tähtikasvatteja.
- **fc-felgueiras-1932** · `academy.notable_products`: Seurassa pelanneita tunnettuja nimiä (Sérgio Conceição, Fernando Meira, José Fonte) löytyi, mutta yksikään lähde ei vahvistanut heitä akatemian kasvateiksi → null, ei arvata.
- **fc-felgueiras-1932** · `estimated_price_eur`: Ei ajantasaista seurakohtaista hintaevidenssiä: ainoa datapiste on toteutumaton 1 M€ tarjous 80 %:sta (4/2022) → null; sarjatason tyyppihaarukka lisätään keskitetysti.
- **fc-penafiel** · `academy.notable_products`: Kohtuullisella haulla ei löytynyt lähteistettyä listaa Penafielin akatemian tunnetuista kasvateista → null.
- **fc-porto-b** · `attendance`: Transfermarkt, zerozero.pt ja playmakerstats.com estetty egress-proxyssa; yleisökeskiarvoa 2025/26 ei löytynyt hakutulosten tiivistelmistä. Kotistadion pieni (3 800), luku jäänee matalaksi mutta ei arvata.
- **fc-porto-b** · `ownership.owners (ajantasainen omistusosuus)`: Tuorein varmennettu prosenttiluku FC Porton osuudesta SAD:ssa on vuoden 2016 dokumentista (74,59 %); nykyinen tarkka osuus vaatisi Euronext/CMVM-ilmoitusten läpikäyntiä, joita ei voitu hakea suoraan (finanssisivustot estetty/ei löytynyt hauilla).
- **fc-vizela** · `attendance`: Transfermarkt ja zerozero.pt estetty egress-proxyssa; 2025/26 yleisökeskiarvoa ei löytynyt hakutulosten kautta.
- **fc-vizela** · `academy.notable_products`: Haulla ei löytynyt luotettavaa listaa tunnetuista FC Vizelan kasvateista; akatemia on FPF 4 tähden tasoinen, mutta yksittäisiä nimekkäitä ammattilaiskasvatteja ei varmennettu.
- **fc-vizela** · `ownership (Efkarpian tosiasiallinen edunsaaja)`: Liga Portugalin läpinäkyvyysdokumentti kertoo Efkarpia Trades and Investment Ltd:n olevan 100 % yhden luonnollisen henkilön omistuksessa, mutta henkilön nimeä ei julkisteta; 2022 uutisointi puhui malesialaisesta sijoittajaryhmästä ilman nimiä.
- **leixoes-sc** · `academy.notable_products`: Haut (pt: 'jogadores formados no Leixões') eivät tuottaneet nimettyjä tunnettuja kasvatteja luotettavasta lähteestä; zerozero-kasvattilistaus estetty proxyssa.
- **leixoes-sc** · `sale.price_indication_eur`: Aliya Capital Partners -periaatesopimuksen (8/2025) arvoja ei julkistettu missään löydetyssä lähteessä.
- **gd-chaves** · `sources (Wikipedia/zerozero suorat haut)`: pt.wikipedia.org, en.wikipedia.org, zerozero.pt, gdchaves.pt ja stadiumdb.com estetty egress-proxyssa — tiedot poimittu WebSearch-tulosten kautta samoista lähteistä; luvut syytä varmentaa QA-vaiheessa suoraan lähteistä.
- **lusitania-de-lourosa-fc** · `attendance`: Yleisökeskiarvoa 2025/26 ei löytynyt: kausi pelattiin yhdeksällä lainastadionilla, ja Transfermarkt/zerozero on estetty verkkoproxyssa (EGRESS_BLOCKED).
- **lusitania-de-lourosa-fc** · `ownership.owners`: SAD:n 90 % pääosakkaan nimeä ei löytynyt hauista (Iberinform/Racius-rekisterisivuja ei voitu avata — egress-esto). Vain jako 90 % yksi osakas / 10 % perustajaseura vahvistui hakutiivisteestä.
- **lusitania-de-lourosa-fc** · `academy.notable_products`: Tunnettuja kasvatteja ei löytynyt kohtuullisella haulla (Wikipedia/zerozero estetty proxyssa; hakutulokset eivät nimenneet kasvatteja).
- **lusitania-de-lourosa-fc** · `estimated_price_eur`: Ei seurakohtaista hintaevidenssiä (ei uutisoitua hintapyyntöä eikä vertailukauppaa) — jätetty keskitetylle sarjatasohaarukalle.
- **portimonense-sc** · `stadium.capacity`: Luku 4 961 saatiin en.wikipedian hakutiivisteestä, mutta lähteissä esiintyy poikkeavia lukuja; ristiinvarmistus zerozero/Transfermarkt jäi tekemättä (egress-esto + WebSearch-budjetti 200/200 täynnä). Vaatii varmistuksen.
- **portimonense-sc** · `ownership`: SAD-rakenne ja Theodoro Fonseca -omistus perustuvat yleistietoon (tietämysraja 1/2026); SAD/acionistas/venda-hakuja ei ehditty ajaa ennen WebSearch-budjetin täyttymistä. 2026-tilanne (mahd. omistajanvaihdos) varmistettava.
- **portimonense-sc** · `sale`: Myynti-/sijoittajasignaalihakuja (venda OR investidor OR acionistas) ei voitu suorittaa — session WebSearch-budjetti täyttyi. Status jätetty unknown.
- **portimonense-sc** · `ownership.debt_or_insolvency_notes`: Insolvência/PER/dívidas-hakua ei voitu suorittaa (WebSearch-budjetti täynnä). Ei tietoa kumpaankaan suuntaan.
- **portimonense-sc** · `attendance`: Yleisökeskiarvoa 2025/26 ei saatu: Transfermarkt estetty proxyssa eikä hakubudjettia jäljellä.
- **portimonense-sc** · `city_population`: Censos 2021 -luku 59 896 (município) annettu yleistiedosta; INE/Wikipedia-sivua ei voitu avata verifiointiin (egress-esto). Merkitty lähteeseen varmistettavaksi.
- **portimonense-sc** · `academy.notable_products`: Kasvattihakua ei voitu suorittaa (WebSearch-budjetti täynnä); akatemian olemassaolo merkitty yleistiedon perusteella.
- **portimonense-sc** · `estimated_price_eur`: Ei seurakohtaista hintaevidenssiä käytettävissä olevissa lähteissä.
- **sc-farense** · `founded`: Kaikki tutkimuskanavat estyneet: WebSearch-istuntokiintiö täynnä (200/200) ennen tämän seuran tutkimusta; egress-proxy palautti 403/000 kaikille lähdedomaineille (pt/en.wikipedia.org, zerozero.pt, transfermarkt); pilviscraper-MCP vaati hyväksynnän jota headless-ajo ei saanut. Ei keksitty muistinvaraista arvoa.
- **sc-farense** · `stadium.name`: Wikipedia- ja zerozero.pt-haut estetty (egress-proxy 403, WebSearch-kiintiö täynnä). Ei varmistettua lähdettä.
- **sc-farense** · `stadium.capacity`: Wikipedia/zerozero/transfermarkt estetty (egress-proxy), WebSearch-kiintiö täynnä. Kapasiteettilukua ei kirjattu muistista sääntöjen mukaisesti.
- **sc-farense** · `stadium.owner`: Omistusperustetta (municipal vs. seuran oma) ei voitu varmistaa mistään lähteestä verkkorajoitusten vuoksi.
- **sc-farense** · `city_population`: INE- ja Wikipedia-haut estetty (egress-proxy); väkilukua ei kirjattu muistista.
- **sc-farense** · `ownership.structure`: SAD vs. clube -rakennetta ei voitu varmistaa: portugalinkieliset uutishaut eivät olleet mahdollisia (WebSearch-kiintiö täynnä, uutissivustot estetty proxyssa).
- **sc-farense** · `sale`: Myynti-/sijoittajasignaalien uutishaku (venda/investidor/acionistas/insolvência/PER) ei ollut mahdollinen verkkorajoitusten vuoksi; status jäi oletusarvoon unknown.
- **sc-farense** · `academy`: Akatemian olemassaoloa ja kasvatteja ei voitu varmistaa (wikipedia/zerozero estetty). academy.exists jäi null, ei false.
- **scu-torreense** · `founded`: Kaikki tutkimuskanavat estyneet: WebSearch-istuntokiintiö täynnä (200/200) ennen tämän seuran tutkimusta; egress-proxy palautti 403/000 kaikille lähdedomaineille (pt/en.wikipedia.org, zerozero.pt, transfermarkt); pilviscraper-MCP vaati hyväksynnän jota headless-ajo ei saanut. Ei keksitty muistinvaraista arvoa.
- **scu-torreense** · `stadium.name`: Wikipedia- ja zerozero.pt-haut estetty (egress-proxy 403, WebSearch-kiintiö täynnä). Ei varmistettua lähdettä.
- **scu-torreense** · `stadium.capacity`: Wikipedia/zerozero/transfermarkt estetty (egress-proxy), WebSearch-kiintiö täynnä. Kapasiteettilukua ei kirjattu muistista sääntöjen mukaisesti.
- **scu-torreense** · `stadium.owner`: Omistusperustetta (municipal vs. seuran oma) ei voitu varmistaa mistään lähteestä verkkorajoitusten vuoksi.
- **scu-torreense** · `city_population`: INE- ja Wikipedia-haut estetty (egress-proxy); väkilukua ei kirjattu muistista.
- **scu-torreense** · `ownership.structure`: SAD vs. clube -rakennetta ei voitu varmistaa: portugalinkieliset uutishaut eivät olleet mahdollisia (WebSearch-kiintiö täynnä, uutissivustot estetty proxyssa).
- **scu-torreense** · `sale`: Myynti-/sijoittajasignaalien uutishaku (venda/investidor/acionistas/insolvência/PER) ei ollut mahdollinen verkkorajoitusten vuoksi; status jäi oletusarvoon unknown.
- **scu-torreense** · `academy`: Akatemian olemassaoloa ja kasvatteja ei voitu varmistaa (wikipedia/zerozero estetty). academy.exists jäi null, ei false.
- **sporting-cp-b** · `founded`: Verkkopääsy estetty: WebSearch-kiintiö täynnä (200/200) ja egress-proxy 403 kaikille lähdedomaineille (pt/en.wikipedia.org, zerozero.pt, transfermarkt). Yritetty WebFetch + curl 2026-08-11.
- **sporting-cp-b** · `stadium.name`: 2026/27-kotikenttää ei voitu selvittää — Wikipedia/zerozero/ligaportugal.pt estetty egress-proxyssa. Venue voi olla Alcochetessa (Setúbalin piiri), joten myös city/district vaatii varmistuksen venue-mielessä.
- **sporting-cp-b** · `stadium.capacity`: Sama esto: kaikki lähdedomainit palauttivat 403 CONNECT-vaiheessa.
- **sporting-cp-b** · `stadium.owner`: Ei lähdettä saatavilla verkkoeston takia.
- **sporting-cp-b** · `city_population`: INE/Wikipedia estetty (www.ine.pt ja pt.wikipedia.org 403 egress-proxyssa).
- **sporting-cp-b** · `ownership`: SAD-rakenne merkitty yleistietona (B-joukkue osa Sporting CP:n futebol-SAD:ia), mutta lähde-URL puuttuu — uutis- ja rekisterilähteet estetty. Vaatii lähdeviitteen jälkikäteen.
- **sporting-cp-b** · `academy.notable_products`: Kasvattilistaa ei kirjattu ilman verifioitavaa lähdettä (Wikipedia estetty).
- **uniao-de-leiria** · `founded`: Verkkopääsy estetty: WebSearch-kiintiö täynnä (200/200) ja egress-proxy 403 kaikille lähdedomaineille. Yritetty WebFetch + curl 2026-08-11.
- **uniao-de-leiria** · `stadium.name`: Wikipedia/zerozero/uniaodeleiria.pt estetty (403 CONNECT) — stadionia ei voitu verifioida.
- **uniao-de-leiria** · `stadium.capacity`: Sama esto kuin yllä.
- **uniao-de-leiria** · `stadium.owner`: Kunnan/seuran omistusta ei voitu selvittää ilman lähteitä (câmara municipal -lähteet estetty).
- **uniao-de-leiria** · `city_population`: INE ja Wikipedia estetty egress-proxyssa.
- **uniao-de-leiria** · `ownership.structure`: SAD/clube-rakennetta ei voitu varmistaa — portugalilaiset uutishaut (SAD, venda, investidor, insolvência) eivät olleet mahdollisia hakukiintiön ja egress-eston takia.
- **uniao-de-leiria** · `sale.status`: Myynti-/sijoittajasignaaleja ei voitu hakea (hakukiintiö täynnä, uutissivustot estetty) — status jää unknown.
- **uniao-de-leiria** · `academy.exists`: Juniorijoukkueita ei voitu vahvistaa zerozero/Wikipedia-eston takia.

### Liga 3 -tutkimusaalto (2026-08-11)

- **Kaikki aallon seurat (16 kpl)** · `attendance.average`: Transfermarkt ja varalähteet estetty ympäristön egress-proxyssa (403) ja session WebSearch-kiintiö (200 hakua) täyttyi — kauden 2025-26 yleisökeskiarvoja ei voitu varmentaa mistään lähteestä. Lukuja ei arvattu. Täydennetään erillisajossa (ks. scripts/research-club.md).
- **Kaikki seurat (8 kpl)** · `academy.fpf_certification`: FPF:n Entidades Formadoras -sertifiointilistaa (fpf.pt) ei voitu hakea (egress-proxy 403 + WebSearch-kiintiö täynnä). Kahdelle seuralle taso löytyi seurakohtaisista lähteistä. Täydennetään erillisajossa.
- **ad-fafe** · `academy.notable_products`: Haku 'AD Fafe jogadores formados' ei tuottanut nimettyjä akatemiakasvatteja; vain lainapelaajamaininta (Rui Costa laina Benficasta 1990-91, ei kasvatti).
- **ad-fafe** · `ownership.owners`: SAD:n tarkka omistusjakauma 8/2026 epäselvä: 2023 Felmargest-kauppa (75 %) hyväksytty, 2024 Felgueiras-sijoittaja myi osuutensa ja Ulisses Jorgen ryhmän ~80 %:n kauppa uutisoitiin, mutta lopullista toteutumista/rekisteröityä omistusta ei voitu vahvistaa (FPF:n transparency-dokumenttia ei voitu avata proxy-eston takia); foreign_investor jätetty null.
- **ad-marco-09** · `academy.notable_products`: Ei löytynyt nimettyjä tunnettuja kasvatteja hauilla; vain maininta juniorista (Paulo Violante), joka debytoi edustusjoukkueessa — ei riitä 'tunnetuksi kasvatiksi'.
- **ad-marco-09** · `estimated_price_eur`: Ei seurakohtaista hintaevidenssiä: SAD:n perustamisessa 2024 ei uutisoitu kauppahintaa (osakepääoma 200 000 € ei ole kauppahinta); sarjatason tyyppihaarukka lisätään keskitetysti.
- **cd-trofense** · `academy.notable_products`: Wikipedia (pt/en) ja zerozero.pt estetty proxyssa; hakutuloksista ei löytynyt nimettyjä tunnettuja kasvatteja. Akatemian olemassaolo vahvistettu (O Notícias da Trofa).
- **cd-trofense** · `ownership.foreign_investor`: TSC – Trof Sports Centerin kotipaikka on Trofassa (NSS Vila do Condessa), mutta yksittäisten sijoittajien (mm. Anderson Gonçalves / Brights Height) kansallisuus ei selvinnyt lähteistä; aiempi yhdysvaltalainen S&A-kauppa purettiin.
- **cd-trofense** · `sale.status_confirmation`: Yhtiökokous hyväksyi TSC-kaupan 28.10.2025 ja uusi SAD-hallitus aloitti 12/2025, mutta kaupan lopullista täytäntöönpanoa ei löytynyt eksplisiittisesti uutisista — status 'recently_sold' perustuu näihin; huomioitava aiemman S&A-kaupan kariutuminen.
- **fc-pacos-de-ferreira** · `academy.notable_products`: Wikipedia (pt/en), zerozero.pt ja Transfermarktin jugendarbeit-sivu estetty proxyssa; hakutuloksista ei löytynyt nimettyjä tunnettuja kasvatteja. Akatemian olemassaolo vahvistettu (fcpf.pt).
- **leca-fc** · `academy.notable_products`: Haut (pt/en-wikipedia-tiivistelmät, seuran historia- ja formação-sivut) eivät nimenneet tunnettuja ammattilaiskasvatteja; suorat wikipedia-haut estetty proxyssa
- **leca-fc** · `estimated_price_eur`: Ei seurakohtaista hintaevidenssiä (ei uutisoitua hintapyyntöä eikä toteutunutta vertailukauppaa); sarjatason haarukka lisätään keskitetysti
- **leca-fc** · `ownership.owners`: SAD:n tarkat omistusosuudet (%) eivät selvinneet: racius/einforma-rekisteritiedot maksumuurin takana, FPF:n transparência-PDF:t eivät noudettavissa proxy-eston takia — vain johtohenkilöt vahvistettu
- **leca-fc** · `ownership.foreign_investor`: Ei viitteitä ulkomaisesta sijoittajasta, mutta osakasrakennetta ei saatu vahvistettua → null eikä false
- **sc-sao-joao-de-ver** · `academy.notable_products`: Haut (wikipedia-tiivistelmät, seuran sivut, 'jogadores formados') eivät nimenneet tunnettuja kasvatteja
- **sc-sao-joao-de-ver** · `estimated_price_eur`: Dani Alves -kaupan (50 % SAD:sta, 1/2026) hintaa ei julkistettu missään löydetyssä lähteessä
- **sc-sao-joao-de-ver** · `stadium.owner`: Omistajaa ei vahvistettu: cm-feira.pt:n liikuntapaikkasivu ja zerozero-tiivistelmä eivät kerro omistajaa; stadionin nimi viittaa seuran omaan kenttään mutta se ei riitä → unknown
- **sc-sao-joao-de-ver** · `ownership.debt_or_insolvency_notes`: Ei löydöksiä hauilla 'insolvência OR PER OR dívidas' — tulokset koskivat muita seuroja (Boavista, UD Leiria)
- **sc-sao-joao-de-ver** · `sale.notes`: Lopun 50 %:n oston toteutumista kauden 2025/26 päätyttyä ei saatu vahvistettua elokuun 2026 hauilla — kirjattu recently_sold tammikuun 2026 vahvistetun 50 %:n kaupan perusteella
- **sc-vianense** · `ownership.owners (tarkka osakejakauma)`: Lähteiden prosentit ristiriitaisia (rahasto 69 % + seura 33 % = 102 %); tarkka jakauma vaatisi kaupparekisteriotteen. Kirjattu haarukkana ~31–33 % / ~67–69 %.
- **usc-paredes** · `academy.notable_products`: Kohtuullisella haulla ei löytynyt dokumentoituja ammattilaisiksi nousseita kasvatteja (juniorityö vahvaa, mutta nimettyjä huippukasvatteja ei uutisoitu).
- **usc-paredes** · `sale.price_indication_eur`: SAD perustettiin 5/2026 sijoittaja Rui Caetanon kanssa, mutta sijoitussummaa tai osuusprosentteja ei julkistettu uutislähteissä.
- **usc-paredes** · `estimated_price_eur`: Ei seurakohtaista hintaevidenssiä (ei uutisoitua kauppahintaa tai hintapyyntöä); sarjatason tyyppihaarukka lisätään keskitetysti.
- **usc-paredes** · `stadium.capacity (varmistus)`: 3 000 perustuu Transfermarkt/en.wikipedia-hakutiivisteisiin; uudelleenrakennetun (2022) stadionin tarkkaa virallista lukua ei voitu varmistaa suoralla fetchillä (egress estetty), ja kunnostussuunnitelmissa mainittiin laajennus 5 000 paikkaan.
- **varzim-sc** · `city_population`: WebSearch-budjetti (200/200) täyttyi ennen INE/Censos 2021 -hakua; pt.wikipedia.org, en.wikipedia.org ja INE eivät saavutettavissa (egress-proxy estää suorat haut). Ei lukua ilman lähdettä.
- **varzim-sc** · `academy.notable_products`: Wikipedia/zerozero estetty egress-proxyssa ja hakubudjetti loppui — kasvattilistaa ei voitu varmentaa, jätetty null.
- **vitoria-de-guimaraes-b** · `stadium`: WebSearch-budjetti täyttyi ennen tämän seuran tutkimista ja zerozero/Wikipedia/Transfermarkt estetty egress-proxyssa — B-joukkueen kotikenttä, kapasiteetti ja omistaja varmentamatta.
- **vitoria-de-guimaraes-b** · `city_population`: Guimarãesin väkilukua (INE/Censos 2021, município vs cidade) ei voitu varmentaa — lähteet estetty, hakubudjetti loppu.
- **vitoria-de-guimaraes-b** · `founded`: Kenttään kirjattu emoseuran perustamisvuosi 1922 (yleistieto, varmentamatta istunnossa). B-joukkueen oma historia (Segunda Liga -kausi 2010-luvulla, uudelleenaktivointi Liga 3:een) jäi varmentamatta — hakubudjetti loppu.
- **vitoria-de-guimaraes-b** · `ownership`: SAD-rakenne kirjattu yleistietona; omistusosuuksia, osakkaita ja velkatilannetta ei voitu varmentaa (lähteet estetty). Varmennettava QA-vaiheessa.
- **vitoria-de-guimaraes-b** · `academy.notable_products`: Ei voitu varmentaa — lähteet estetty, hakubudjetti loppu; jätetty null.
- **atletico-cp** · `city_population`: pt/en.wikipedia.org ja INE estetty egress-proxyssa; WebSearch-kiintiö (200/200) täyttyi ennen väkilukuhakua. Ei lukua ilman lähdettä.
- **atletico-cp** · `attendance`: Transfermarkt ei tavoitettavissa (egress-esto), hakukiintiö täynnä; Liga 3 -tason yleisödata jäi saamatta.
- **atletico-cp** · `ownership.structure`: SAD todistetusti olemassa 2013/14 (ligaportugal.pt-seurasivu 'Atlético Clube de Portugal – Futebol, SAD'), mutta nykytilaa 2026 (SAD aktiivinen vai futebol clube-yhdistyksen alla) ei voitu varmistaa — jatkohaut estyivät.
- **atletico-cp** · `ownership.debt_or_insolvency_notes`: Haku '"Atlético Clube de Portugal" insolvência OR PER OR dívidas OR investidor' epäonnistui: WebSearch-kiintiö oli juuri täyttynyt.
- **atletico-cp** · `sale`: Venda/investidor/acionistas-uutishakuja ei voitu suorittaa (kiintiö). Status jätetty unknown.
- **atletico-cp** · `academy`: zerozero.pt ja Wikipedia estetty; juniorijoukkueita, kasvatteja tai FPF-sertifiointia ei voitu varmistaa.
- **atletico-cp** · `stadium.owner`: Tapadinhan omistajaa (seura vs. kunta) ei löytynyt saatavilla olleista hakutiivistelmistä; seuran oma sivu atleticocp.pt ja maisfutebol.iol.pt estetty.
- **caldas-sc** · `founded`: WebSearch-kiintiö täyttyi ennen yhtäkään Caldas SC -hakua; Wikipedia/zerozero estetty egress-proxyssa. Perustamisvuotta ei kirjattu ilman lähdettä.
- **caldas-sc** · `stadium.capacity`: Ei tavoitettavaa lähdettä (egress-esto + hakukiintiö). Kentän nimi Campo da Mata annettu yleistietona, kapasiteetti null.
- **caldas-sc** · `stadium.owner`: Ei tavoitettavaa lähdettä; omistus (kunta/seura) varmistamatta.
- **caldas-sc** · `city_population`: INE/Wikipedia-väkilukua (município vs. cidade) ei voitu hakea — kaikki lähteet estetty.
- **caldas-sc** · `ownership`: SAD/clube-rakennetta, omistajia ja velkatilannetta ei voitu tutkia lainkaan (hakukiintiö täynnä, sivulataukset estetty).
- **caldas-sc** · `sale`: Myynti-/sijoittajahakuja ei voitu suorittaa; status unknown ilman evidenssiä.
- **caldas-sc** · `academy`: Juniorirakennetta ja kasvatteja ei voitu varmistaa mistään lähteestä tässä sessiossa.
- **caldas-sc** · `attendance`: Transfermarkt ei tavoitettavissa; yleisökeskiarvo 2025-26 jäi saamatta.
- **cd-mafra** · `stadium.capacity`: Lähteet ristiriitaisia: 2 900 (api-football + worldfootball-johdetut aineistot, kirjattu arvoksi) vs 6 000 (Transfermarkt-johdettu). Ensisijaiset lähteet (zerozero.pt, Wikipedia) estetty egress-proxyssa, ristiriitaa ei voitu ratkaista — vaatii QA-varmistuksen.
- **cd-mafra** · `ownership.structure`: Uutishakuja ('CD Mafra' SAD / venda / investidor / acionistas) ei voitu tehdä: WebSearch-kiintiö täynnä (200/200) ja pt-uutissivustot, Wikipedia ja zerozero estetty verkon egress-proxyssa. GitHub-aineistoista ei löytynyt SAD/SDUQ-mainintaa.
- **cd-mafra** · `ownership.debt_or_insolvency_notes`: Insolvência/PER/dívidas-hakuja ei voitu tehdä (WebSearch-kiintiö täynnä, uutissivustot estetty).
- **cd-mafra** · `sale.status`: Julkisia seurakohtaisia myynti-/sijoittajasignaaleja ei voitu hakea (haut estetty); elokuun 2026 Brands Capital -listaukset anonyymejä → status jää 'unknown'.
- **cd-mafra** · `academy.exists`: zerozero.pt ja Wikipedia estetty; juniorijoukkueiden/akatemian olemassaoloa ei voitu vahvistaa saavutettavissa olevista lähteistä.
- **cd-mafra** · `academy.notable_products`: Ei löytynyt kasvattitietoja saavutettavissa olevista aineistoista (GitHub-peilit); Wikipedia estetty.
- **cd-mafra** · `city_population`: Vain vuoden 2011 väestölaskennan luku (76 685, município) oli varmistettavissa lähteellä; INE:n/Wikipedian 2021-luku ei saatavilla estojen takia — luku todennäköisesti vanhentunut alakanttiin.
- **cf-os-belenenses** · `stadium.owner`: Restelon omistus-/maapohjajärjestelyä (seura vs Lissabonin kaupunki) ei voitu varmistaa: ensisijaiset lähteet (Wikipedia, zerozero, seuran sivut) estetty egress-proxyssa → unknown.
- **cf-os-belenenses** · `ownership.owners`: Clube-rakenne (jäsenomisteinen, erillään entisestä SAD:sta) vahvistettu, mutta nykyisen johdon/hallituksen yksityiskohtia ei voitu hakea (uutishaut estetty).
- **cf-os-belenenses** · `ownership.debt_or_insolvency_notes`: Insolvência/PER/dívidas-hakuja ei voitu tehdä (WebSearch-kiintiö täynnä, uutissivustot estetty).
- **cf-os-belenenses** · `sale.status`: Julkisia seurakohtaisia myynti-/sijoittajasignaaleja ei voitu hakea (haut estetty); Brands Capital -listaukset anonyymejä → 'unknown'.
- **cf-os-belenenses** · `academy.exists`: Nykyisen juniori-/akatemiatoiminnan olemassaoloa ei voitu vahvistaa lähteellä (zerozero ja Wikipedia estetty), vaikka seura on historiallisesti tunnettu monilaji- ja kasvattiseura.
- **cf-os-belenenses** · `academy.notable_products`: Kasvattilistaa ei voitu vahvistaa saavutettavissa olevista aineistoista; Wikipedia ja zerozero estetty.
- **gd-vitoria-de-sernache** · `founded`: Kaikki lähdereitit estetty tässä ajossa: WebSearch-kiintiö täynnä (200/200) ennen tämän aliagentin käynnistymistä; egress-proxy palautti 403 kaikille yleisille verkkotunnuksille (pt.wikipedia.org, en.wikipedia.org, zerozero.pt, transfermarkt, jopa example.com); scraper-MCP vaati interaktiivisen hyväksynnän, jota headless-ajossa ei saatu. Ei vahvistettua perustamisvuotta ilman lähdettä.
- **gd-vitoria-de-sernache** · `stadium`: Stadionin nimi, kapasiteetti ja omistus (municipal vs. seura) olisi haettu zerozero.pt:sta ja Wikipediasta — molemmat estetty egress-proxyssa (403). Ei kirjattu ilman lähdettä.
- **gd-vitoria-de-sernache** · `city_population`: INE/Wikipedia-väkilukua Cernache do Bonjardimille (freguesia) tai Sertãn kunnalle ei voitu hakea: wikipedia.org estetty (403), WebSearch-kiintiö täynnä.
- **gd-vitoria-de-sernache** · `ownership.structure`: Portugalinkielisia hakuja ('Vitória de Sernache' SAD / venda / investidor / insolvência / PER) ei voitu ajaa: WebSearch-kiintiö täynnä, uutissivustot estetty proxyssa. structure jätetty 'unknown'.
- **gd-vitoria-de-sernache** · `academy`: Juniorirakenne/kasvatit olisi tarkistettu zerozero.pt:sta ja Wikipediasta — estetty (403). Ei merkitty exists=true/false ilman lähdettä.
- **gd-vitoria-de-sernache** · `city`: HUOM (ei puuttuva, mutta vahvistamaton): kotipaikka Cernache/Sernache do Bonjardim (Sertãn kunta, Castelo Brancon piiri) on johdettu seuran nimestä ja yleistiedosta; koordinaatit, rannikkoetäisyys (~80 km, sisämaa) ja lähin suurkaupunki Coimbra (~50 km) ovat sallittua karttapäättelyä. Verkkolähteellä vahvistaminen ei ollut mahdollista tässä ajossa.
- **louletano-dc** · `founded`: Kaikki lähdereitit estetty (WebSearch 200/200 täynnä; wikipedia/zerozero/transfermarkt 403 egress-proxyssa). Yleistieto viittaa vahvasti vuoteen 1923 (seura vietti satavuotisjuhlaa 2023), mutta ilman vahvistettavaa lähde-URL:ia arvo jätettiin sääntöjen mukaisesti null — seuraavan ajon helppo vahvistuskohde.
- **louletano-dc** · `stadium`: Stadionin nimi, kapasiteetti ja omistaja (todennäköisesti kunnallinen, mutta ei vahvistettu) olisi haettu zerozero.pt:sta — estetty (403). Ei kirjattu ilman lähdettä.
- **louletano-dc** · `city_population`: Loulén kunnan (município) ja kaupungin (cidade) väkilukuja ei voitu vahvistaa INE:stä/Wikipediasta: estetty proxyssa, hakukiintiö täynnä. Ei lukua ilman lähdettä.
- **louletano-dc** · `ownership.structure`: Portugalinkielisia hakuja ('Louletano' SAD / venda / investidor / insolvência / PER) ei voitu ajaa: WebSearch-kiintiö täynnä, uutissivustot estetty proxyssa. structure jätetty 'unknown'.
- **louletano-dc** · `academy`: Louletano tunnetaan Algarvessa laajasta junioritoiminnasta (yleistieto), mutta exists=true vaatisi lähteen (zerozero/Wikipedia) — estetty (403). Jätetty null.
- **louletano-dc** · `city`: HUOM (ei puuttuva, mutta vahvistamaton): kotipaikka Loulé (Faron piiri) on johdettu suoraan seuran nimestä (Louletano = louléláinen); koordinaatit, rannikkoetäisyys (~10 km, kaupunki sisämaassa vaikka kunta ulottuu rannikolle) ja lähin suurkaupunki Faro (~15 km) ovat sallittua karttapäättelyä. Verkkolähteellä vahvistaminen ei ollut mahdollista tässä ajossa.
- **lusitano-gc** · `founded`: Ei verkkoyhteyttä: WebSearch-kiintiö täynnä (200/200) ja egress-proxy palautti EGRESS_BLOCKED pt.wikipedia.org/en.wikipedia.org/zerozero.pt-osoitteille. Ei arvattu muistista, koska lähde-URL vaaditaan.
- **lusitano-gc** · `stadium.name`: Wikipedia ja zerozero.pt estetty egress-proxyssa; Ultimate Web Scraper -MCP vaati hyväksynnän, jota headless-ajossa ei voi antaa.
- **lusitano-gc** · `stadium.capacity`: Sama kuin stadium.name: kaikki lähdesivustot estetty, hakukiintiö täynnä.
- **lusitano-gc** · `stadium.owner`: Kunnan/seuran omistusta ei voitu selvittää ilman verkkolähteitä.
- **lusitano-gc** · `city_population`: INE (www.ine.pt) ja Wikipedia estetty egress-proxyssa; väkilukua ei kirjattu ilman lähdettä.
- **lusitano-gc** · `ownership.structure`: PT-uutishaut ('Lusitano SAD', 'venda/investidor/acionistas', 'insolvência/PER/dívidas') eivät onnistuneet: WebSearch-kiintiö täynnä ja record.pt/abola.pt/ojogo.pt/maisfutebol estetty.
- **lusitano-gc** · `academy.exists`: zerozero.pt (juniorijoukkueet) ja Wikipedia (kasvatit) estetty; ei kirjattu ilman lähdettä.
- **lusitano-gc** · `city/district/coords`: HUOM: täytetty sallittuna yleistietona (Lusitano GC = Évora, Évoran piiri; maantiede laskettu koordinaateista). Web-verifiointia ei voitu tehdä — QA-vaiheen syytä tarkistaa.
- **sporting-da-covilha** · `founded`: Ei verkkoyhteyttä: WebSearch-kiintiö täynnä (200/200) ja egress-proxy palautti EGRESS_BLOCKED pt.wikipedia.org/en.wikipedia.org/zerozero.pt-osoitteille. Ei arvattu muistista, koska lähde-URL vaaditaan.
- **sporting-da-covilha** · `stadium.name`: Wikipedia ja zerozero.pt estetty egress-proxyssa; Ultimate Web Scraper -MCP vaati hyväksynnän, jota headless-ajossa ei voi antaa.
- **sporting-da-covilha** · `stadium.capacity`: Sama kuin stadium.name: kaikki lähdesivustot estetty, hakukiintiö täynnä.
- **sporting-da-covilha** · `stadium.owner`: Kunnan/seuran omistusta ei voitu selvittää ilman verkkolähteitä.
- **sporting-da-covilha** · `city_population`: INE (www.ine.pt) ja Wikipedia estetty egress-proxyssa; väkilukua ei kirjattu ilman lähdettä.
- **sporting-da-covilha** · `ownership.structure`: PT-uutishaut ('Sporting da Covilhã SAD', 'venda/investidor/acionistas', 'insolvência/PER/dívidas') eivät onnistuneet: WebSearch-kiintiö täynnä ja record.pt/abola.pt/ojogo.pt/maisfutebol estetty.
- **sporting-da-covilha** · `academy.exists`: zerozero.pt (juniorijoukkueet) ja Wikipedia (kasvatit) estetty; ei kirjattu ilman lähdettä.
- **sporting-da-covilha** · `city/district/coords`: HUOM: täytetty sallittuna yleistietona (nimi viittaa suoraan Covilhãan, Castelo Brancon piiri; maantiede laskettu koordinaateista). Web-verifiointia ei voitu tehdä — QA-vaiheen syytä tarkistaa.
- **ud-oliveirense** · `city_population`: INE, pt/en-Wikipedia ja muut väestölähteet estetty verkon egress-proxyssa (403) ja WebSearch-budjetti täynnä (200/200). GitHubin sensusdatasetit eivät sisältäneet Oliveira de Azeméisin kuntakohtaista kokonaisväkilukua. Ei arvattu.
- **ud-oliveirense** · `attendance`: Transfermarkt estetty egress-proxyssa; alempien sarjojen yleisödataa ei löytynyt vaihtoehtoisista (GitHub-)lähteistä kaudelle 2025-26.
- **ud-oliveirense** · `stadium.owner`: Ei löytynyt lähdettä Estádio Carlos Osórion omistajasta (kunta vs. seura); zerozero.pt ja uutislähteet estetty. Nimessä ei 'Municipal'-etuliitettä, mikä ei riitä perusteeksi → unknown.
- **ud-oliveirense** · `academy`: Wikipedia/zerozero estetty; saavutettu en-wikin peilikopio ei kattanut junior+kasvattiosiota → exists ja notable_products null. FPF-sertifiointi jätetty keskitetylle agentille.
- **ud-oliveirense** · `sale`: Portugalinkieliset uutishaut (SAD venda/investidor/insolvência) eivät olleet mahdollisia: WebSearch-budjetti täynnä ja uutissivustot (Record, A Bola, Público ym.) estetty egress-proxyssa. Tiedossa vain Onodera Groupin enemmistöomistus 11/2022 → status unknown.
- **ud-oliveirense** · `ownership.debt_or_insolvency_notes`: Insolvência/PER/dívidas-hakuja ei voitu tehdä (haku- ja egress-estot) → null.
- **ud-oliveirense** · `estimated_price_eur`: Ei seurakohtaista hintaevidenssiä (uutisoitu hintapyyntö tai vertailukauppa) saavutettavissa lähteissä → null; sarjatason haarukka lisätään keskitetysti.
- **ud-santarem** · `founded`: Perustamisvuotta ei löytynyt: Wikipedia/zerozero estetty, eikä GitHub-arkistoista (DRE-asiakirjat 1971-2003, wiki-peilit) löytynyt perustamisvuotta. Seura oli olemassa viimeistään 1954 (vuokrasopimus, DRE 382/2003), mutta tarkka vuosi jäi varmistamatta.
- **ud-santarem** · `stadium.capacity`: Campo Chã das Padeirasin kapasiteettia ei löytynyt luotettavasta lähteestä (zerozero/Wikipedia estetty; venues.csv-datseteissä kapasiteettikenttä 0/puuttuu; pelidatan '10000' ei ole luotettava) → null.
- **ud-santarem** · `stadium.owner`: DRE 2003: kenttä oli tuolloin yksityisomistuksessa ja kunnan comodato/valtion rekvisitio käytössä; nykyistä (2026) omistajaa (mahd. kunta) ei voitu varmistaa uutis-/kuntalähteistä (egress-estot) → unknown.
- **ud-santarem** · `city_population`: INE/Wikipedia estetty egress-proxyssa, WebSearch-budjetti täynnä; GitHub-datasetit eivät sisältäneet Santarémin kunnan/kaupungin väkilukua → null.
- **ud-santarem** · `attendance`: Transfermarkt estetty; nousijaseuran CdP-kauden 2025-26 yleisödataa ei tyypillisesti ole saatavilla eikä sitä löytynyt vaihtoehtoisista lähteistä → null.
- **ud-santarem** · `ownership`: SAD vs. clube -rakennetta ei voitu varmistaa: portugalinkieliset uutishaut estyneet (hakubudjetti + egress-estot), eikä GitHub-arkistoista löytynyt mainintaa SAD:sta → structure unknown, owners null.
- **ud-santarem** · `sale`: Myynti-/sijoittajauutisia ei voitu hakea (haku- ja egress-estot). Brands Capital -tyyppiset listaukset anonyymejä → status unknown.
- **ud-santarem** · `academy`: Juniorirakennetta ei voitu varmistaa: DRE 2003 mainitsee kentällä pelattavat piirin juniorisarjat muttei yksilöi UD Santarémin omia joukkueita; zerozero/Wikipedia estetty → exists null.
- **ud-santarem** · `estimated_price_eur`: Ei seurakohtaista hintaevidenssiä → null; sarjatason haarukka lisätään keskitetysti.
- **ud-oliveirense** · `yleinen_lähdehuomio`: Ympäristörajoite: kaikki suorat verkkolähteet (pt/en-Wikipedia, zerozero.pt, Transfermarkt, FPF, uutissivustot, hakukoneet) estetty egress-proxyssa ja WebSearch-budjetti käytetty (200/200). Tiedot koottu GitHubiin arkistoiduista kopioista (en-Wikipedia-peiliteksti, Wikidata-johdetut stadion-CSV:t, sports-data-feedit, Diário da República -arkisto, uutisotsikko/Bluesky-arkistot elokuu 2025-heinäkuu 2026). Peililähteiden ajantasaisuus kannattaa varmentaa, kun ensisijaislähteet ovat taas saavutettavissa.
### Hintavertailukaupat (_pricebasis, 2026-08-11)

- **_pricebasis** · `haarukka`: Sarjatasokohtaista tyyppihinta-haarukkaa EI voitu muodostaa tässä ajossa:
  WebSearch-kiintiö oli täynnä eikä uutissivustoihin päässyt egress-proxyn takia. Seurakohtaiset
  toteutuneet kaupat/hintaindikaatiot on kirjattu seurojen sale-/estimated_price_eur-kenttiin silloin
  kun seuratutkimus ne löysi (esim. AD Fafe 75 % / 500 t€ 2023). estimated_price_eur jää muilta null.

### Campeonato de Portugal -aalto (2026-08-11) — RAJOITETTU AJO

Session WebSearch-kiintiö (200 hakua) oli täyttynyt Liga 2/3 -aaltojen aikana
ja egress-proxy estää kaikki lähdesivustot (wikipedia, zerozero, fpf.pt,
transfermarkt, pt-uutissivustot; vain github.com on auki). CdP-seuroille
kerättiin siksi vain:

- **kaupunki** (50/55): lohkoarvontauutisoinnin lähteistä (ks. `sources` per
  seura ja data/cdp-groups.json) tai seuran yksiselitteisestä nimestä
- **piiri, koordinaatit, rannikkostatus, etäisyydet** (50/55):
  karttapäättelyä (tehtävänannon sallima menetelmä)

Kaikilta 55 CdP-seuralta PUUTTUU (null + confidence: low): perustamisvuosi,
väkiluku, stadionin nimi/kapasiteetti/omistus, yleisökeskiarvo, akatemiatiedot,
omistusrakenne (SAD/clube), myyntisignaalit. Nämä vaativat täydennysajon
(ks. README "Datan täydennys"). Omistusrakenne on merkitty `unknown`
perustellusti: lähteitä ei ollut saatavilla tässä ajossa.

Kaupunki jäi vahvistamatta (null) viidellä seuralla:

- **celoricense**: Celorico de Basto vai Celorico da Beira — ei vahvistavaa lähdettä.
- **ad-nogueirense**: useita Nogueirense-seuroja Portugalissa; identiteetti varmistamatta.
- **ud-serra**: lähteet käyttivät kahta nimimuotoa (União da Serra / UD Serra); kotipaikka varmistamatta.
- **gd-lagoa**: lähteet ristiriidassa — toinen tutkimusagentti sijoitti seuran Azoreille (dnoticias-konteksti), toinen Algarven Lagoaan. Ei ratkaistu ilman lähdettä.
- **jd-lajense**: Azorit, mutta saari (Pico/Flores/Terceira) varmistamatta.
