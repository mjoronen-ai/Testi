/**
 * Screen: yhteinen pohja välilehtinäkymille.
 * Hoitaa taustan (pehmeä liukuväri ylhäällä), turvallisen alueen (lovi ja kellorivi) ja vierityksen.
 */
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppData } from '@/storage/AppDataContext';
import { spacing } from '@/theme/theme';
import { AppText } from './AppText';

interface Props {
  title?: string;
  subtitle?: string;
  /** Pieni yläotsikko otsikon yläpuolella. */
  overline?: string;
  children: React.ReactNode;
  /** Jos false, sisältö ei vieritä (näkymä hoitaa vierityksen itse). */
  scroll?: boolean;
  /** Elementti otsikon oikealle puolelle (esim. asetukset-nappi). */
  headerRight?: React.ReactNode;
}

export function Screen({ title, subtitle, overline, children, scroll = true, headerRight }: Props) {
  const { colors } = useAppData();
  const header = title ? (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        {overline ? (
          <AppText variant="overline" color={colors.primary}>
            {overline}
          </AppText>
        ) : null}
        <AppText variant="display" accessibilityRole="header">
          {title}
        </AppText>
        {subtitle ? <AppText muted>{subtitle}</AppText> : null}
      </View>
      {headerRight}
    </View>
  ) : null;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.backgroundTop, colors.background]} style={styles.sky} />
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.root}>
        {scroll ? (
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {header}
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.content, { flex: 1, paddingBottom: 0 }]}>
            {header}
            {children}
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  sky: { position: 'absolute', top: 0, left: 0, right: 0, height: 320 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl, gap: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
});
