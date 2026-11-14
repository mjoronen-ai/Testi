/** AgePicker: isot ikänapit 2–9 vuotta (9 = "9+"). */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppData } from '@/storage/AppDataContext';
import { radius, spacing } from '@/theme/theme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

const AGES = [2, 3, 4, 5, 6, 7, 8, 9];

export function AgePicker({ value, onChange }: { value: number; onChange: (age: number) => void }) {
  const { colors } = useAppData();
  return (
    <View style={styles.grid} accessibilityRole="radiogroup">
      {AGES.map((a) => {
        const selected = a === value;
        return (
          <PressableScale
            key={a}
            onPress={() => onChange(a)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`${a}${a === 9 ? ' tai yli' : ''} vuotta`}
            style={[
              styles.chip,
              {
                backgroundColor: selected ? colors.primary : colors.surface,
                borderColor: selected ? colors.primary : colors.border,
              },
            ]}
          >
            <AppText variant="hero" color={selected ? colors.onPrimary : colors.text}>
              {a === 9 ? '9+' : a}
            </AppText>
            <AppText variant="caption" color={selected ? colors.onPrimary : colors.textMuted}>
              vuotta
            </AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  chip: {
    width: 76,
    height: 76,
    borderRadius: radius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
