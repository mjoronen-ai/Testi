# Satukirja 📖

Lasten satusovellus Androidille ja iPhonelle (React Native + Expo).
Sovellus toimii ilman nettiä, eikä siinä ole mainoksia eikä ulkoisia linkkejä.

Suunnitteluperiaatteet ja niiden perustelut löytyvät tiedostosta [DESIGN.md](DESIGN.md).

---

## 1. Kokeile puhelimellasi (Expo Go)

**Tarvitset:** tietokoneen, jossa on [Node.js](https://nodejs.org) (versio 20 tai uudempi), ja puhelimen, johon on asennettu **Expo Go** (App Store tai Google Play).

```bash
git clone <repon osoite>
cd Testi
git checkout claude/busy-thompson-fkfq4z
cd satukirja
npm install
npx expo start
```

Ruudulle tulee QR-koodi.
- **iPhone:** avaa Kamera-sovellus ja osoita QR-koodia. Napauta ilmoitusta, ja sovellus aukeaa Expo Gossa.
- **Android:** avaa Expo Go ja valitse *Scan QR code*.

Puhelimen ja tietokoneen pitää olla **samassa wifi-verkossa**. Jos yhteys ei toimi
(esim. työpaikan verkossa), käynnistä näin: `npx expo start --tunnel`.

Kun muutat koodia ja tallennat, puhelin päivittyy automaattisesti.

> **Huom:** Expo Go -sovelluksen pitää tukea projektin Expo-versiota (SDK 58).
> Jos Expo Go ilmoittaa versio-ongelmasta, päivitä Expo Go sovelluskaupasta.

### Testauslista

| Ominaisuus | Miten testaat |
|---|---|
| Aloitusopastus | Ensimmäisellä käynnistyskerralla: tervetuloa → nimi → ikä. Jos haluat nähdä sen uudelleen, poista sovellus Expo Gosta tai tyhjennä sen tiedot. |
| Etusivu | Tervehdys nimellä. Päivällä "Päivän satu", klo 17 jälkeen "Illan satu". Alempana karusellit, joita voi vierittää sivuttain. |
| Kuuntele | Pääkortin 🎧 Kuuntele avaa sadun, ja ääneen luku alkaa heti. |
| Selaa | Haku, aiheet, ikäryhmät ja kaikki sadut. |
| Fonttikoko | Avaa satu ja paina **A−** / **A+** (myös Asetuksissa). |
| Yötila | Automaattisesti klo 19–07, tai kuu-napista. Asetuksissa: Automaattinen / Päivä / Yö. |
| Suosikit | Paina sydäntä (puhelin värisee kevyesti) ja katso Suosikit-välilehti. |
| Jatka lukemista | Vieritä satua puoliväliin ja palaa takaisin. Etusivulle tulee "Jatka lukemista". |
| Tarrat | Lue satu loppuun (vieritä loppuun tai paina "Luin sadun!"). Esiin tulee juhlistus ja tarra, ja Tarrat-välilehdellä taso nousee. |
| Ääneen luku | ▶ lukunäkymän alalaidassa. Luettava kappale korostuu. ⏸ pitää tauon, ⏹ lopettaa. Kun satu loppuu, saat tarran. |
| Asetukset | Etusivun ratas: nimi, ikä, yötila, tekstin koko ja tarrakirjan tyhjennys. |

**Ääneen luku:** jos ääni ei kuulosta suomelta, asenna puhelimeen suomenkielinen puheääni:
- **iPhone:** Asetukset → Käyttöapu → Puhuttu sisältö → Äänet → Suomi
- **Android:** Asetukset → Tekstistä puheeksi → Googlen puhepalvelu → Asenna äänidata → Suomi

Tarkista myös, ettei iPhonen äänetön-kytkin ole päällä.

---

## 2. Satujen lisääminen

Sadut ovat kansiossa **`content/`**, yksi tiedosto per satu.

### Uusi satu kahdella komennolla

```bash
npm run new-story -- "Kissa ja kuu"     # luo pohjan content/kissa-ja-kuu.md
# ...kirjoita satu tiedostoon...
npm run import-stories                  # tarkistaa ja kokoaa sadut sovellukseen
```

### Tiedoston muoto (Markdown)

```md
---
title: Kissa ja kuu
categories: [iltasadut, elainsadut]
ageMin: 4
keywords: [kissa, kuu, yö]
source: Kirjoitettu tätä sovellusta varten
author: Oma nimesi
license: Oma teos
emoji: 🐈
color: "#C8C3E8"
---
Olipa kerran kissa...

Uusi kappale alkaa tyhjän rivin jälkeen.
```

| Kenttä | Pakollinen | Selitys |
|---|---|---|
| `title` | ✅ | Sadun nimi |
| `categories` | ✅ | `elainsadut`, `kansansadut`, `suomalaiset`, `iltasadut`, `seikkailusadut`, `joulusadut`, `vuodenajat` (yksi tai useampi) |
| `ageMin` | ✅ | Pienin suositeltu ikä (vuotta) |
| `source` | ✅ | Mistä teksti on peräisin |
| `author` | ✅ | Kirjoittaja tai kääntäjä |
| `license` | ✅ | `CC0 1.0`, `Public domain`, `CC BY 4.0`, `CC BY-SA 4.0` tai `Oma teos` |
| `keywords` | suositeltu | Hakusanat |
| `emoji`, `color` | – | Kortin kuva ja väri |
| `readingMinutes` | – | Lasketaan automaattisesti (n. 80 sanaa/min) |
| `series`, `seriesTitle`, `chapter` | – | Vain jatkokertomuksille, katso alta |

### Jatkokertomukset

Jatkokertomuksen jokainen luku on oma tiedostonsa, esim. `content/oma-tarina-1.md`, `oma-tarina-2.md` jne.
Lisää kaikkiin lukuihin samat kentät:

```md
series: oma-tarina
seriesTitle: Oma tarina
chapter: 1
title: Oma tarina – 1. Luvun nimi
```

Sovellus näyttää luvut Jatkokertomukset-karusellissa. Luvun lopussa tulee "Tarina jatkuu huomenna" ja nappi seuraavaan lukuun.
Tuontityökalu tarkistaa, että luvut on numeroitu 1, 2, 3… ilman aukkoja.

Satu voi olla myös **JSON-tiedosto** (katso esimerkki `content/paperivene.json`).
Yhdessä JSON-tiedostossa voi olla myös lista satuja.

"Lyhyet"-kategoria ja ikäryhmät muodostuvat automaattisesti lukuajasta ja `ageMin`-kentästä.

### ⚖️ Tekijänoikeudet

Lisää vain tekstejä, joihin sinulla on oikeus: itse kirjoitettuja tai tekijänoikeusvapaita.
Kansansadun **juoni** on vapaa, mutta **käännös** voi olla suojattu (käännöksen tekijän
kuolemasta pitää olla kulunut yli 70 vuotta). Tuontityökalu ei hyväksy satua, josta puuttuu lähde,
tekijä tai lisenssi.

---

## 3. Kansiorakenne

```
satukirja/
├── src/app/               Näkymät (Expo Router: jokainen tiedosto on yksi ruutu)
│   ├── _layout.tsx        Fontit, tallennus ja navigointi
│   ├── (tabs)/            Alapalkin välilehdet: Koti, Selaa, Suosikit, Tarrat
│   ├── onboarding.tsx     Aloitusopastus (nimi ja ikä)
│   ├── settings.tsx       Asetukset
│   ├── category/[id].tsx  Kategorian tai ikäryhmän sadut
│   └── story/[id].tsx     Lukunäkymä ja juhlistus
├── src/components/        Uudelleenkäytettävät palat (kansikuva, satukortit, karuselli, napit...)
├── src/data/              Satuvarasto, suositukset, tarrakirjan tasot ja satujen JSON
├── src/hooks/useSpeech.ts Ääneen luku
├── src/storage/           SQLite-tallennus: profiili, suosikit, lukukohta, tarrat, asetukset
├── src/theme/theme.ts     Värit, fontit, koot: muuta ulkoasua täältä
├── src/types/story.ts     Sadun tietomalli
├── content/               Satujen lähdetiedostot
└── scripts/               Tuontityökalu ja satupohjan luonti
```

Hyödyllisiä komentoja:

```bash
npm run typecheck     # tarkistaa koodin virheet
npm run web           # avaa sovelluksen selaimessa (nopea kokeilu)
```

---

## 4. Julkaisu: Google Play ja App Store (EAS Build)

EAS (Expo Application Services) rakentaa sovelluksen pilvessä, joten et tarvitse
Macia etkä Android Studiota.

### Vaihe 0: Valmistelu (kerran)

1. Luo ilmainen tili osoitteessa **expo.dev**.
2. Kirjaudu terminaalissa:
   ```bash
   npx eas-cli@latest login
   npx eas-cli@latest init        # yhdistää projektin Expo-tiliisi
   ```
3. Vaihda `app.json`-tiedostosta tunnisteet omiksesi (ne eivät voi muuttua julkaisun jälkeen):
   - `ios.bundleIdentifier`: esim. `fi.omanimi.satukirja`
   - `android.package`: sama muoto
4. Tee oma sovelluskuvake (1024×1024 px PNG) ja korvaa `assets/icon.png`
   ja `assets/android-icon-*.png`.

### Vaihe 1: Testiversio Androidille (APK)

```bash
npx eas-cli@latest build --platform android --profile preview
```
Valmiin APK-tiedoston voi asentaa suoraan Android-puhelimeen linkistä tai QR-koodista.

### Vaihe 2: Google Play

1. Luo **Google Play Console** -tili (kertamaksu 25 $).
2. Rakenna julkaisuversio (AAB):
   ```bash
   npx eas-cli@latest build --platform android --profile production
   ```
3. Luo Play Consolessa uusi sovellus ja lataa ensimmäinen AAB-tiedosto käsin
   (*Testaus → Sisäinen testaus*). Myöhemmin voit lähettää automaattisesti:
   `npx eas-cli@latest submit --platform android`
   (vaatii Google-palvelutiliavaimen, ohje: docs.expo.dev/submit/android).
4. Täytä Play Consolessa:
   - **Kohdeyleisö ja sisältö:** valitse ikäryhmät (alle 13). Sovellus kuuluu
     **Families-ohjelman** piiriin, ja sen säännöt pitää hyväksyä.
   - **Tietoturvaosio (Data safety):** sovellus *ei kerää eikä jaa* tietoja, koska kaikki on vain puhelimessa.
   - **Tietosuojakäytäntö:** pakollinen lastensovelluksille. Lyhyt sivu riittää: "Sovellus ei kerää
     henkilötietoja. Suosikit ja asetukset tallentuvat vain laitteelle."
   - Kuvakaappaukset, kuvaus ja sisällön ikäluokitus (kyselylomake).
5. Uusien henkilökohtaisten kehittäjätilien pitää ajaa **suljettu testi** (vähintään 12 testaajaa
   14 päivän ajan) ennen tuotantojulkaisua. Tarkista ajantasainen vaatimus Play Consolesta.

### Vaihe 3: App Store (iPhone)

1. Liity **Apple Developer Programiin** (99 $/vuosi), developer.apple.com.
2. Rakenna:
   ```bash
   npx eas-cli@latest build --platform ios --profile production
   ```
   EAS kysyy Apple-tunnuksesi ja hoitaa sertifikaatit automaattisesti.
3. Lähetä App Store Connectiin:
   ```bash
   npx eas-cli@latest submit --platform ios
   ```
4. Kokeile ensin **TestFlightissa** omalla iPhonellasi.
5. Täytä App Store Connectissa:
   - **Kids-kategoria** (valitse ikäryhmä, esim. 5 ja alle tai 6–8). Kids-sovelluksissa
     ei saa olla mainoksia, analytiikkaa eikä ulkoisia linkkejä ilman vanhempien porttia.
     Tämä sovellus täyttää ehdot jo valmiiksi.
   - **App Privacy:** "Data Not Collected".
   - Tietosuojakäytännön osoite, kuvakaappaukset (vähintään 6,9" iPhone) ja kuvaus.
6. Lähetä arvioitavaksi (*Submit for Review*). Arviointi kestää yleensä 1–3 päivää.

### Päivitykset

- **Uusia satuja tai pieniä muutoksia:** `npx eas-cli@latest update` toimittaa päivityksen
  suoraan käyttäjille ilman kauppojen arviointia (vaatii `expo-updates`-paketin, ohje: docs.expo.dev/eas-update).
- **Isommat muutokset:** tee uusi `build` ja `submit`. Versionumero kasvaa automaattisesti.
