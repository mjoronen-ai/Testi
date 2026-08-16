// Luo kolme kuvitteellista esimerkkitiedostoa eri CSV-muodoissa (erotin, valuutta,
// palkkajakso, otsikkokieli). Data on keksittyä — seurat, pelaajat ja palkat eivät
// vastaa mitään todellista sarjaa. Ajo: npm run samples

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'esimerkkidata')

// Deterministinen satunnaisluku, jotta tiedostot pysyvät samoina ajojen välillä.
function rng(seed) {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

const FIRST_FI = ['Mikko', 'Jere', 'Aleksi', 'Onni', 'Väinö', 'Santeri', 'Eetu', 'Rasmus', 'Joona', 'Leevi', 'Kasper', 'Ilari', 'Topias', 'Verneri', 'Aarne']
const LAST_FI = ['Virtanen', 'Nieminen', 'Koskinen', 'Hakala', 'Salo', 'Rantanen', 'Lehtinen', 'Manninen', 'Ahonen', 'Peltola', 'Kinnunen', 'Sivonen', 'Haapala', 'Ojanen', 'Ruusunen']
const FIRST_SE = ['Anton', 'Gustav', 'Nils', 'Elias', 'Melker', 'Hampus', 'Viggo', 'Måns', 'Love', 'Sixten', 'Alvar', 'Folke']
const LAST_SE = ['Bergqvist', 'Lindgren', 'Sandell', 'Hjalmarsson', 'Norling', 'Wikström', 'Palmgren', 'Ekholm', 'Sjöberg', 'Dahlin', 'Åkerlund', 'Ryding']
const FIRST_EN = ['Callum', 'Reece', 'Dominic', 'Jarrod', 'Kieran', 'Ashton', 'Marcus', 'Owen', 'Leon', 'Tobias', 'Ellis', 'Rowan']
const LAST_EN = ['Ashworth', 'Carrick', 'Devlin', 'Fairhurst', 'Gorton', 'Halliwell', 'Maddox', 'Northrop', 'Prentice', 'Rushton', 'Thorne', 'Winslow']

const POSITIONS_FI = ['Maalivahti', 'Puolustaja', 'Keskikenttä', 'Hyökkääjä']
const POSITIONS_SE = ['Målvakt', 'Försvarare', 'Mittfältare', 'Anfallare']
const POSITIONS_EN = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']

const NATIONS_FI = ['Suomi', 'Viro', 'Ruotsi', 'Nigeria', 'Brasilia', 'Islanti']
const NATIONS_EN = ['England', 'Scotland', 'Ireland', 'Nigeria', 'Portugal', 'Sweden']

/** Palkka: joukkueen tason mukaan skaalattu, oikealle vino jakauma. */
function salaryFor(random, base, teamFactor) {
  const skew = Math.exp((random() + random() + random() - 1.5) * 0.9)
  return base * teamFactor * skew
}

function makeTeams(names, random) {
  // Ensimmäiset joukkueet ovat rikkaampia — sarjan sisäinen budjettiero näkyy vertailussa.
  return names.map((name, i) => ({
    name,
    factor: 2.4 * Math.exp(-i / (names.length / 1.6)) + 0.35 + random() * 0.15,
  }))
}

function pick(random, list) {
  return list[Math.floor(random() * list.length)]
}

function uniqueNamer(random, firsts, lasts) {
  const used = new Set()
  return () => {
    for (let i = 0; i < 500; i += 1) {
      // Nimivalikoima loppuisi kesken ilman keskimmäistä kirjainta, kun rivejä on satoja.
      const initial = i < 100 ? '' : `${String.fromCharCode(65 + Math.floor(random() * 26))}. `
      const name = `${pick(random, firsts)} ${initial}${pick(random, lasts)}`
      if (!used.has(name)) {
        used.add(name)
        return name
      }
    }
    return `Pelaaja ${used.size + 1}`
  }
}

function spaced(value) {
  return Math.round(value).toLocaleString('fi-FI').replace(/ /g, ' ')
}

// 1. Suomalainen muoto: pilkku, välilyönti tuhaterottimena, vuosipalkka euroina.
function finnish() {
  const random = rng(11)
  const teams = makeTeams(
    ['FC Esimerkki', 'Kuvitteellinen Pallo', 'HJK Testi', 'Rantalan Reipas', 'Järvenpään Jyske',
     'Pohjolan Palloilijat', 'Saaristo United', 'Metsäkylän Veikot', 'Lakeuden Lohi', 'Vuorenrinteen Vauhti'],
    random,
  )
  const name = uniqueNamer(random, FIRST_FI, LAST_FI)
  const lines = ['Pelaaja,Joukkue,Sarja,Pelipaikka,Ikä,Kansallisuus,Vuosipalkka,Kausi']
  for (const team of teams) {
    for (let i = 0; i < 22; i += 1) {
      const salary = salaryFor(random, 52_000, team.factor)
      lines.push(
        [
          `"${name()}"`,
          `"${team.name}"`,
          'Esimerkkiliiga (FIN)',
          pick(random, POSITIONS_FI),
          18 + Math.floor(random() * 19),
          pick(random, NATIONS_FI),
          `"${spaced(salary)}"`,
          '2026',
        ].join(','),
      )
    }
  }
  return lines.join('\n')
}

// 2. Ruotsalainen muoto: puolipiste, desimaalipilkku, KUUKAUSIpalkka kruunuina.
function swedish() {
  const random = rng(23)
  const teams = makeTeams(
    ['Exempel IF', 'Fiktiva BK', 'Norrby Testklubb', 'Söderhamns SK', 'Västviks IF',
     'Bergsjö United', 'Lindholmens FF', 'Kvarnby BK', 'Åsheds IK'],
    random,
  )
  const name = uniqueNamer(random, FIRST_SE, LAST_SE)
  const lines = ['Spelare;Lag;Liga;Position;Ålder;Månadslön;Valuta;Säsong']
  for (const team of teams) {
    for (let i = 0; i < 20; i += 1) {
      const monthly = salaryFor(random, 41_000, team.factor)
      lines.push(
        [
          name(),
          team.name,
          'Exempelligan (SWE)',
          pick(random, POSITIONS_SE),
          18 + Math.floor(random() * 19),
          `${spaced(monthly)},${String(Math.floor(random() * 100)).padStart(2, '0')}`,
          'SEK',
          '2026',
        ].join(';'),
      )
    }
  }
  return lines.join('\n')
}

// 3. Englantilainen muoto: pilkku, puntasymboli ja VIIKKOpalkka.
function english() {
  const random = rng(37)
  const teams = makeTeams(
    ['Northgate Rovers', 'Example City', 'Fictional Wanderers', 'Kingsmoor Athletic', 'Harborough Town',
     'Westfield United', 'Ashcombe FC', 'Brackenhill Albion', 'Dunmore County', 'Ravensworth FC',
     'Elmsbury Rangers', 'Thornbridge FC'],
    random,
  )
  const name = uniqueNamer(random, FIRST_EN, LAST_EN)
  const lines = ['Player,Club,League,Position,Age,Nationality,Weekly Wage,Contract until,Season']
  for (const team of teams) {
    for (let i = 0; i < 24; i += 1) {
      const weekly = salaryFor(random, 6_500, team.factor)
      lines.push(
        [
          `"${name()}"`,
          `"${team.name}"`,
          'Example League (ENG)',
          pick(random, POSITIONS_EN),
          18 + Math.floor(random() * 19),
          pick(random, NATIONS_EN),
          `"£${Math.round(weekly).toLocaleString('en-GB')}"`,
          `30.6.${2027 + Math.floor(random() * 4)}`,
          '2026/27',
        ].join(','),
      )
    }
  }
  return lines.join('\n')
}

mkdirSync(OUT_DIR, { recursive: true })
const files = [
  ['esimerkkiliiga-fin-2026.csv', finnish()],
  ['exempelligan-swe-2026.csv', swedish()],
  ['example-league-eng-2026.csv', english()],
]
for (const [fileName, content] of files) {
  writeFileSync(resolve(OUT_DIR, fileName), `${content}\n`, 'utf8')
  console.log(`${fileName}: ${content.split('\n').length - 1} riviä`)
}
