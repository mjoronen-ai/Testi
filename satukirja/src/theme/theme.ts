/**
 * Sovelluksen ulkoasu yhdessä paikassa: värit, fontit, mitat ja varjot.
 * Jos haluat vaihtaa sävyjä, muokkaa vain tätä tiedostoa.
 */
import { Platform, type ViewStyle } from 'react-native';

export interface Palette {
  background: string; // sivun tausta
  backgroundTop: string; // taustan liukuvärin yläosa (etusivun "taivas")
  surface: string; // korttien tausta
  surfaceAlt: string; // hieman erottuva pinta
  text: string; // pääteksti
  textMuted: string; // toissijainen teksti
  primary: string; // korostusväri (napit, aktiivinen välilehti)
  primarySoft: string; // korostusvärin vaalea versio (taustoihin)
  onPrimary: string; // teksti korostusvärin päällä
  accent: string; // toinen korostus (tarrat, tähdet)
  heart: string; // suosikkisydän
  border: string;
  highlight: string; // ääneen luettavan kappaleen korostus
  shadow: string;
}

/** Päivätila: lämmin kerma, aprikoosi ja syvä luumu. */
export const lightPalette: Palette = {
  background: '#FFF9F2',
  backgroundTop: '#FFE9D6',
  surface: '#FFFFFF',
  surfaceAlt: '#F7EEE4',
  text: '#2E2440',
  textMuted: '#7B7088',
  primary: '#E8734A',
  primarySoft: '#FDE3D6',
  onPrimary: '#FFFFFF',
  accent: '#F4B63F',
  heart: '#E5476A',
  border: '#EFE3D6',
  highlight: '#FFEDB8',
  shadow: '#5B3A1E',
};

/** Yötila: syvä yönsininen ja himmeä lämmin teksti (ei kirkasta valkoista). */
export const darkPalette: Palette = {
  background: '#12162A',
  backgroundTop: '#1E2547',
  surface: '#1E2440',
  surfaceAlt: '#272F52',
  text: '#F1E8DA',
  textMuted: '#A6A3BE',
  primary: '#F5A06F',
  primarySoft: '#3A3150',
  onPrimary: '#1A1F33',
  accent: '#F6CB6A',
  heart: '#FF8BA0',
  border: '#2C3456',
  highlight: '#3A4472',
  shadow: '#000000',
};

/** Fontit (Nunito on pyöreä ja helppolukuinen). Ladataan app/_layout.tsx:ssä. */
export const fonts = {
  regular: 'Nunito_400Regular',
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
};

/** Välistykset ja pyöristykset. */
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const radius = { sm: 12, md: 18, lg: 26, xl: 34, pill: 999 };

/** Pienin kosketusalue (suositus 48 pt, käytämme vähän isompaa). */
export const TOUCH_MIN = 52;

/** Lukunäkymän fonttikoon rajat ja oletus. */
export const FONT_SIZE = { min: 16, max: 34, step: 2, default: 22 };

/** Yötila kytkeytyy automaattisesti päälle näiden kellonaikojen välillä. */
export const NIGHT_HOURS = { start: 19, end: 7 };

/** Korttien oletusvärit kategorian mukaan, jos sadulla ei ole omaa väriä. */
export const categoryColors: Record<string, string> = {
  elainsadut: '#F6B98E',
  kansansadut: '#A9D18E',
  iltasadut: '#AFA6E8',
  seikkailusadut: '#8EC9DB',
  suomalaiset: '#9DBBE3',
  joulusadut: '#E58C8C',
  vuodenajat: '#9ED3B0',
  lyhyet: '#F3D27A',
};

/** Pehmeä varjo korteille. Toimii iOS:llä, Androidilla ja selaimessa. */
export function softShadow(color: string, strength = 1): ViewStyle {
  return Platform.select<ViewStyle>({
    android: { elevation: 3 * strength },
    default: {
      shadowColor: color,
      shadowOpacity: 0.12 * strength,
      shadowRadius: 14 * strength,
      shadowOffset: { width: 0, height: 6 * strength },
    },
  })!;
}

/**
 * Vaalentaa tai tummentaa värin. amount > 0 vaalentaa, < 0 tummentaa (−1…1).
 * Käytetään kansikuvien liukuväreihin.
 */
export function shade(hex: string, amount: number): string {
  const n = hex.replace('#', '');
  const full = n.length === 3 ? n.split('').map((c) => c + c).join('') : n;
  const num = parseInt(full, 16);
  const mix = (c: number) => {
    const target = amount > 0 ? 255 : 0;
    return Math.round(c + (target - c) * Math.abs(amount));
  };
  const r = mix((num >> 16) & 255);
  const g = mix((num >> 8) & 255);
  const b = mix(num & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
