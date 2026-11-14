/**
 * Screen: yhteinen pohja välilehtinäkymille.
 * Hoitaa taustavärin, turvallisen alueen (lovi ja kellorivi) ja vierityksen.
 */
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppData } from '@/storage/AppDataContext';
import { spacing } from '@/theme/theme';
import { AppText } from './AppText';

interface Props {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Jos false, sisältö ei vieritä (esim. hakunäkymä hoitaa vierityksen itse). */
  scroll?: boolean;
  /** Elementti otsikon oikealle puolelle (esim. yötila-nappi). */
  headerRight?: React.ReactNode;
}

export function Screen({ title, subtitle, children, scroll = true, headerRight }: Props) {
  const { colors } = useAppData();
  const header = title ? (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <AppText variant="hero" accessibilityRole="header">
          {title}
        </AppText>
        {subtitle ? <AppText muted>{subtitle}</AppText> : null}
      </View>
      {headerRight}
    </View>
  ) : null;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.root, { backgroundColor: colors.background }]}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {header}
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, { flex: 1 }]}>
          {header}
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
});
