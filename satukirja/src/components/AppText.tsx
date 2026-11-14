/**
 * AppText: sovelluksen tekstikomponentti.
 * Käyttää aina Nunito-fonttia ja nykyisen teeman (päivä/yö) tekstiväriä.
 *
 * Esimerkki:  <AppText variant="title">Hei</AppText>
 */
import React from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';
import { useAppData } from '@/storage/AppDataContext';
import { fonts } from '@/theme/theme';

type Variant = 'display' | 'hero' | 'title' | 'subtitle' | 'body' | 'caption' | 'overline';

interface Props extends TextProps {
  variant?: Variant;
  muted?: boolean;
  color?: string;
}

export function AppText({ variant = 'body', muted, color, style, ...rest }: Props) {
  const { colors } = useAppData();
  return (
    <Text
      {...rest}
      style={[styles[variant], { color: color ?? (muted ? colors.textMuted : colors.text) }, style]}
    />
  );
}

const styles = StyleSheet.create({
  display: { fontFamily: fonts.black, fontSize: 34, lineHeight: 40, letterSpacing: -0.5 },
  hero: { fontFamily: fonts.black, fontSize: 28, lineHeight: 34, letterSpacing: -0.3 },
  title: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28 },
  subtitle: { fontFamily: fonts.semibold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fonts.regular, fontSize: 17, lineHeight: 24 },
  caption: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 19 },
  overline: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 16, letterSpacing: 1.4, textTransform: 'uppercase' },
});
