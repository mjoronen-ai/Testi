/**
 * Luo uuden satupohjan content/-kansioon.
 *
 * Käyttö:   npm run new-story -- "Sadun nimi"
 *
 * Avaa syntynyt tiedosto, kirjoita satu ja täytä tiedot. Aja sitten:
 *           npm run import-stories
 */
import fs from 'node:fs';
import path from 'node:path';

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('Anna sadun nimi, esim:  npm run new-story -- "Kissa ja kuu"');
  process.exit(1);
}

const id = title
  .toLowerCase()
  .replace(/ä/g, 'a')
  .replace(/ö/g, 'o')
  .replace(/å/g, 'a')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const file = path.resolve(__dirname, '..', 'content', `${id}.md`);
if (fs.existsSync(file)) {
  console.error(`Tiedosto on jo olemassa: ${file}`);
  process.exit(1);
}

const template = `---
title: ${title}
# Kategoriat: elainsadut, kansansadut, suomalaiset, iltasadut, seikkailusadut, joulusadut (yksi tai useampi)
categories: [iltasadut]
# Pienin suositeltu ikä vuosina
ageMin: 4
keywords: [avainsana1, avainsana2]
# Mistä satu on peräisin? Käytä vain tekstejä, joihin sinulla on oikeus.
source: Kirjoitettu tätä sovellusta varten
author: Oma nimesi
# Sallitut: CC0 1.0, Public domain, CC BY 4.0, CC BY-SA 4.0, Oma teos
license: Oma teos
emoji: 📖
---
Olipa kerran...

Uusi kappale alkaa tyhjän rivin jälkeen.
`;

fs.writeFileSync(file, template, 'utf8');
console.log(`✅ Luotiin ${path.relative(process.cwd(), file)}. Kirjoita satu ja aja sitten: npm run import-stories`);
