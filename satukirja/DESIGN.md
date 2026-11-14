# Suunnitteluperiaatteet: miksi Satukirja näyttää ja toimii näin

Tämä tiedosto kertoo, mihin ulkoasu- ja toimintaratkaisut perustuvat.

## Mikä saa ihmiset palaamaan sovellukseen?

Tunnetuin malli on Nir Eyalin **Hook-malli**: *laukaisin → toiminto → palkinto → panostus*.
Kun kierros toistuu, käytöstä tulee tapa. Malli on tehokas, mutta sitä käytetään myös
manipuloivasti, esim. loputtomat syötteet ja päivittäiset "putket", joita ei uskalla katkaista.

**Lasten sovelluksissa tämä on erityisen tärkeää.** Ison-Britannian tietosuojaviranomaisen (ICO)
*Children's Code* -ohjeistus ja yhdysvaltalainen CARU varoittavat juuri "nudge"-tekniikoista,
kuten putkista ja palkintosilmukoista, jotka saavat lapsen viipymään sovelluksessa. Siksi
sovelsimme mallia **eettisesti**: rakennamme hyvää iltarutiinia, emme ruutuaikaa.

| Hook-mallin vaihe | Tavallinen (vältettävä) toteutus | Satukirjan toteutus |
|---|---|---|
| **Laukaisin** | Push-ilmoitukset, "ikävä sinua!" | Ei ilmoituksia. Laukaisin on perheen oma **iltarutiini**: illalla etusivulla on "Illan satu", ja yötila kytkeytyy päälle itsestään. |
| **Toiminto** (mahdollisimman helppo) | Automaattisesti alkava seuraava jakso | **Yksi napautus**: "Lue" tai "Kuuntele" pääkortissa ja "Jatka lukemista" heti sen alla. |
| **Palkinto** | Satunnaiset palkinnot, loot boxit | **Tarra** jokaisesta loppuun luetusta sadusta ja **tasot**, joita ei voi menettää. Ennalta tiedetty, rauhallinen palkinto. |
| **Panostus** | Pakollinen tili, keräyspisteet, jotka vanhenevat | Lapsen **nimi ja ikä** (vapaaehtoinen, vain laitteessa), **suosikit** ja **tarrakirja**. Sovellus tuntuu omalta. |

## Muut periaatteet

1. **Personointi alusta asti.** Kilpailevien satusovellusten (Storybook, Slumber, Kidly) analyyseissä
   lyhyt aloituskysely nostaa sitoutumista. Meillä kysely on kolme ruutua: tervetuloa, nimi ja ikä.
   Ei tiliä, ei maksumuuria, ei sähköpostia.
2. **Löytämisen ilo.** Suoratoistopalveluista tutut vaakasuuntaiset karusellit ("Sinulle sopivat",
   "Iltasadut", "Lyhyet satuhetket") tekevät selaamisesta helppoa. Lukemattomat sadut näytetään ensin.
3. **Selkeä lopetus.** Kun satu loppuu, juhlistuksessa on illalla pääpainikkeena **"Hyvää yötä"**.
   "Vielä yksi" on tarjolla, mutta toissijaisena. Seuraava satu ei ala koskaan automaattisesti.
4. **Ei pakkoa.** Ei putkia ("5 päivää peräkkäin!"), ei menetettäviä palkintoja, ei syyllistäviä
   tekstejä ("Etkö halua lukea?").
5. **Laadun tuntu.** Pyöreä Nunito-fontti, pehmeät liukuvärit ja varjot, kortit, jotka joustavat
   painettaessa, ja kevyt värinäpalaute (haptiikka) sydämestä ja tarrasta.
6. **Iltakäyttö.** Automaattinen yötila klo 19–07: tumma sininen tausta ja lämmin, himmeä teksti
   (ei kirkasta valkoista).
7. **Luottamus vanhempiin.** Ei mainoksia, ei ostoksia, ei ulkoisia linkkejä eikä tietojen keruuta.
   Asetuksissa kerrotaan tämä selvästi. Tämä täyttää myös App Storen Kids-kategorian ja Google
   Playn Families-ohjelman vaatimukset.

## Lähteet

- Nir Eyal, *Hooked*: mallin tiivistelmät, esim. [Amplitude: The Hook Model](https://amplitude.com/en-us/blog/the-hook-model.md)
  ja [Google Play: Optimize app retention with the Hooked model](https://medium.com/googleplaydev/optimize-app-retention-with-the-hooked-model-a0781f8e5d29)
- ICO, *Age Appropriate Design Code*, nudge-tekniikat: [IAPP-uutinen](https://iapp.org/news/a/ico-bans-use-of-nudge-techniques-in-new-draft-guidelines/),
  [ICO: suositellut toimenpiteet](https://ico.org.uk/for-organisations/childrens-code-hub/best-interests-of-the-child-self-assessment/step-4-prioritise-actions/recommended-actions-in-the-children-s-code/)
- BBB National Programs / CARU: [dark patterns lasten sovelluksissa](https://bbbprograms.org/media/insights/blog/in-app-and-in-game-ads-compliance-2022)
- Satusovellusten käyttöliittymäanalyysit: [Storybook](https://screensdesign.com/showcase/storybook-sleep-meditation),
  [Slumber](https://screensdesign.com/showcase/slumber-calm-stories-sleep), [Kidly](https://screensdesign.com/showcase/kidly-bedtime-books-for-kids)
