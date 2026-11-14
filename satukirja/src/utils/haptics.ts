/**
 * Pieni värinäpalaute napautuksille. Tuntuu laadukkaalta, eikä se ole häiritsevä.
 * Selaimessa ei tee mitään.
 */
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const enabled = Platform.OS === 'ios' || Platform.OS === 'android';

/** Kevyt napautus (napit, kortit). */
export function tapFeedback() {
  if (enabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

/** Onnistuminen (esim. tarra ansaittu, suosikki lisätty). */
export function successFeedback() {
  if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
