/**
 * IconButton: pyöreä kuvakenappi (esim. takaisin, A+, yötila).
 * Aina vähintään TOUCH_MIN kokoinen, jotta pienetkin sormet osuvat.
 */
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppData } from '@/storage/AppDataContext';
import { TOUCH_MIN, fonts } from '@/theme/theme';
import { AppText } from './AppText';

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  /** Tekstiä kuvakkeen sijaan, esim. "A+" */
  label?: string;
  onPress: () => void;
  accessibilityLabel: string;
  disabled?: boolean;
  /** Täytetty korostusvärillä (esim. play-nappi). */
  filled?: boolean;
}

export function IconButton({ icon, label, onPress, accessibilityLabel, disabled, filled }: Props) {
  const { colors } = useAppData();
  const fg = filled ? colors.onPrimary : colors.text;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: filled ? colors.primary : colors.surfaceAlt,
          opacity: disabled ? 0.35 : pressed ? 0.75 : 1,
        },
      ]}
    >
      {icon ? (
        <Ionicons name={icon} size={26} color={fg} />
      ) : (
        <AppText style={{ fontFamily: fonts.bold, fontSize: 19 }} color={fg}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    borderRadius: TOUCH_MIN / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
