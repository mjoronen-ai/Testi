/** Isot napit: PrimaryButton (täytetty liukuväri) ja SecondaryButton (kevyt). */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppData } from '@/storage/AppDataContext';
import { radius, shade, softShadow, spacing } from '@/theme/theme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

interface Props {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  /** Taustaväri; oletuksena sovelluksen korostusväri. */
  color?: string;
  /** Tekstin väri. */
  textColor?: string;
  compact?: boolean;
}

export function PrimaryButton({ label, onPress, icon, color, textColor, compact }: Props) {
  const { colors } = useAppData();
  const bg = color ?? colors.primary;
  const fg = textColor ?? colors.onPrimary;
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.primary, compact && styles.compact, softShadow(bg, 1.2)]}
    >
      <LinearGradient colors={[shade(bg, 0.12), bg]} style={[StyleSheet.absoluteFill, { borderRadius: radius.pill }]} />
      <View style={styles.row}>
        {icon ? <Ionicons name={icon} size={22} color={fg} /> : null}
        <AppText variant="subtitle" color={fg} style={styles.label}>
          {label}
        </AppText>
      </View>
    </PressableScale>
  );
}

export function SecondaryButton({ label, onPress, icon, compact }: Props) {
  const { colors } = useAppData();
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.secondary, compact && styles.compact, { backgroundColor: colors.surfaceAlt }]}
    >
      <View style={styles.row}>
        {icon ? <Ionicons name={icon} size={22} color={colors.text} /> : null}
        <AppText variant="subtitle" style={styles.label}>
          {label}
        </AppText>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  primary: { minHeight: 58, borderRadius: radius.pill, justifyContent: 'center', paddingHorizontal: spacing.lg },
  secondary: { minHeight: 52, borderRadius: radius.pill, justifyContent: 'center', paddingHorizontal: spacing.lg },
  compact: { minHeight: 48, paddingHorizontal: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  label: { fontSize: 18 },
});
