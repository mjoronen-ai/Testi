/** EmptyState: ystävällinen viesti, kun listassa ei ole mitään näytettävää. */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppData } from '@/storage/AppDataContext';
import { radius, spacing } from '@/theme/theme';
import { AppText } from './AppText';

export function EmptyState({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  const { colors } = useAppData();
  return (
    <View style={[styles.box, { backgroundColor: colors.surfaceAlt }]}>
      <AppText style={styles.emoji}>{emoji}</AppText>
      <AppText variant="subtitle" style={styles.center}>
        {title}
      </AppText>
      <AppText muted style={styles.center}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center', gap: spacing.sm },
  emoji: { fontSize: 48, lineHeight: 58 },
  center: { textAlign: 'center' },
});
