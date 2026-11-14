/**
 * Sovelluksen värit, fontit ja mitat yhdessä paikassa.
 * Jos haluat vaihtaa sävyjä, muokkaa vain tätä tiedostoa.
 */

export interface Palette {
  background: string; // sivun tausta
  surface: string; // korttien tausta
  surfaceAlt: string; // hieman erottuva pinta (esim. lähdelaatikko)
  text: string; // pääteksti
  textMuted: string; // toissijainen teksti
  primary: string; // korostusväri (napit, aktiivinen välilehti)
  onPrimary: string; // teksti korostusvärin päällä
  heart: string; // suosikkisydän
  border: string;
  highlight: string; // ääneen luettavan kappaleen korostus
}

/** Päivätila: lämmin kerma, persikka ja salvia. */
export const lightPalette: Palette = {
  background: '#FFF8EE',
  surface: '#FFFFFF',
  surfaceAlt: '#F6EBDD',
  text: '#3B2F2A',
  textMuted: '#7A6A60',
  primary: '#D9764A',
  onPrimary: '#FFFFFF',
  heart: '#E0526B',
  border: '#EADBC8',
  highlight: '#FFE9B8',
};

/** Yötila: tumma sininen, himmeä lämmin teksti (ei kirkasta valkoista). */
export const darkPalette: Palette = {
  background: '#161B2E',
  surface: '#21283F',
  surfaceAlt: '#2A3250',
  text: '#EDE3D1',
  textMuted: '#A9A3B8',
  primary: '#F2A66B',
  onPrimary: '#1A1F33',
  heart: '#FF8A9B',
  border: '#323B5C',
  highlight: '#3A4470',
};

/** Fontit (Nunito on pyöreä ja helppolukuinen). Ladataan app/_layout.tsx:ssä. */
export const fonts = {
  regular: 'Nunito_400Regular',
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_800ExtraBold',
};

/** Välistykset ja pyöristykset. */
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radius = { md: 16, lg: 24, pill: 999 };

/** Pienin kosketusalue (suositus 48 pt, käytämme vähän isompaa). */
export const TOUCH_MIN = 52;

/** Lukunäkymän fonttikoon rajat ja oletus. */
export const FONT_SIZE = { min: 16, max: 34, step: 2, default: 22 };

/** Korttien oletusvärit kategorian mukaan, jos sadulla ei ole omaa väriä. */
export const categoryColors: Record<string, string> = {
  elainsadut: '#F6C9A8',
  kansansadut: '#C9DDB8',
  iltasadut: '#C8C3E8',
  seikkailusadut: '#B8D8E0',
  lyhyet: '#F3DFA2',
};
