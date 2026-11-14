/**
 * useSpeech: ääneen luku suomeksi (expo-speech).
 *
 * Teksti luetaan kappale kerrallaan. Siitä on kolme hyötyä:
 *  1. Tauko toimii myös Androidilla. Androidissa ei ole valmista pause-toimintoa,
 *     joten tauko pysäyttää luvun ja jatko aloittaa samasta kappaleesta.
 *  2. Luettava kappale voidaan korostaa ruudulla.
 *  3. Pitkätkään sadut eivät ylitä puhemoottorin tekstin enimmäispituutta.
 *
 * Vinkki: jos ääni ei ole suomea, asenna puhelimeen suomenkielinen puheääni
 * (Android: Asetukset → Tekstistä puheeksi, iOS: Asetukset → Käyttöapu → Puhuttu sisältö → Äänet).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import * as Speech from 'expo-speech';

export type SpeechStatus = 'idle' | 'playing' | 'paused';

export function useSpeech(paragraphs: string[], onFinished?: () => void) {
  // Viimeisin onFinished-funktio talteen, jotta lukeminen ei katkea, jos se vaihtuu kesken.
  const onFinishedRef = useRef(onFinished);
  onFinishedRef.current = onFinished;

  const [status, setStatus] = useState<SpeechStatus>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);

  // "Sukupolvi"-laskuri: jokainen uusi aloitus kasvattaa lukua, jolloin vanhan luvun
  // myöhässä tulevat "valmis"-ilmoitukset tunnistetaan ja jätetään huomiotta.
  const generation = useRef(0);
  const indexRef = useRef(0);

  const speakFrom = useCallback(
    (index: number) => {
      const gen = ++generation.current;
      const speakOne = (i: number) => {
        if (gen !== generation.current) return;
        if (i >= paragraphs.length) {
          // Satu luettu loppuun: palataan alkuun.
          indexRef.current = 0;
          setCurrentIndex(0);
          setStatus('idle');
          onFinishedRef.current?.();
          return;
        }
        indexRef.current = i;
        setCurrentIndex(i);
        Speech.speak(paragraphs[i], {
          language: 'fi-FI',
          rate: 0.9, // vähän tavallista hitaammin, lapselle sopivasti
          pitch: 1.0,
          onDone: () => speakOne(i + 1),
          onError: () => {
            if (gen === generation.current) setStatus('idle');
          },
        });
      };
      setStatus('playing');
      speakOne(index);
    },
    [paragraphs],
  );

  /** Aloita (tai jatka) lukeminen. startIndex: mistä kappaleesta aloitetaan, jos ollaan alussa. */
  const play = useCallback(
    (startIndex?: number) => {
      const from = status === 'paused' ? indexRef.current : startIndex ?? 0;
      Speech.stop().finally(() => speakFrom(from));
    },
    [speakFrom, status],
  );

  const pause = useCallback(() => {
    generation.current++; // estää seuraavan kappaleen alkamisen
    setStatus('paused');
    Speech.stop();
  }, []);

  const stop = useCallback(() => {
    generation.current++;
    indexRef.current = 0;
    setCurrentIndex(0);
    setStatus('idle');
    Speech.stop();
  }, []);

  // Kun näkymä suljetaan, lukeminen loppuu.
  useEffect(() => {
    return () => {
      generation.current++;
      Speech.stop();
    };
  }, []);

  return { status, currentIndex, play, pause, stop };
}
