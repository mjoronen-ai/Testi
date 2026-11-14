/**
 * ASETUKSET (vanhemmille)
 *  - Lapsen nimi ja ikä (vaikuttavat suosituksiin ja tervehdykseen)
 *  - Yötila: automaattinen / aina päivä / aina yö
 *  - Tekstin koko
 *  - Tarrakirjan tyhjennys
 *  - Tietosuoja: mitään ei kerätä eikä lähetetä minnekään
 */
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Constants from 'expo-constants';
import { useAppData, type ThemeMode } from '@/storage/AppDataContext';
import { AppText } from '@/components/AppText';
import { AgePicker } from '@/components/AgePicker';
import { IconButton } from '@/components/IconButton';
import { PressableScale } from '@/components/PressableScale';
import { SecondaryButton } from '@/components/Buttons';
import { FONT_SIZE, NIGHT_HOURS, fonts, radius, spacing } from '@/theme/theme';

const THEME_OPTIONS: { value: ThemeMode; label: string; emoji: string }[] = [
  { value: 'auto', label: 'Automaattinen', emoji: '🌗' },
  { value: 'light', label: 'Päivä', emoji: '☀️' },
  { value: 'dark', label: 'Yö', emoji: '🌙' },
];

export default function SettingsScreen() {
  const app = useAppData();
  const { colors } = app;
  const [name, setName] = useState(app.profile.name);

  const saveName = () => app.saveProfile({ name, age: app.profile.age });

  const confirmReset = () => {
    const doReset = () => app.resetStickers();
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.('Tyhjennetäänkö tarrakirja?')) doReset();
      return;
    }
    Alert.alert('Tyhjennetäänkö tarrakirja?', 'Kaikki kerätyt tarrat poistetaan. Satuja ei poisteta.', [
      { text: 'Peruuta', style: 'cancel' },
      { text: 'Tyhjennä', style: 'destructive', onPress: doReset },
    ]);
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.content}>
      <Group title="Lapsi">
        <AppText variant="caption" muted>
          Nimi (vapaaehtoinen)
        </AppText>
        <TextInput
          value={name}
          onChangeText={setName}
          onBlur={saveName}
          onSubmitEditing={saveName}
          placeholder="Lapsen nimi"
          placeholderTextColor={colors.textMuted}
          maxLength={20}
          style={[styles.input, { color: colors.text, backgroundColor: colors.surfaceAlt }]}
          accessibilityLabel="Lapsen nimi"
        />
        <AppText variant="caption" muted style={{ marginTop: spacing.sm }}>
          Ikä
        </AppText>
        <AgePicker value={app.profile.age} onChange={(age) => app.saveProfile({ name, age })} />
      </Group>

      <Group title="Yötila">
        <View style={styles.segment}>
          {THEME_OPTIONS.map((o) => {
            const selected = app.themeMode === o.value;
            return (
              <PressableScale
                key={o.value}
                onPress={() => app.setThemeMode(o.value)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                outerStyle={{ flex: 1 }}
                style={[styles.segmentItem, { backgroundColor: selected ? colors.primary : colors.surfaceAlt }]}
              >
                <AppText style={{ fontSize: 22, lineHeight: 28 }}>{o.emoji}</AppText>
                <AppText variant="caption" color={selected ? colors.onPrimary : colors.text}>
                  {o.label}
                </AppText>
              </PressableScale>
            );
          })}
        </View>
        <AppText variant="caption" muted>
          Automaattinen: tumma tila klo {NIGHT_HOURS.start}–{String(NIGHT_HOURS.end).padStart(2, '0')}, jolloin ruutu ei häikäise ennen unta.
        </AppText>
      </Group>

      <Group title="Tekstin koko">
        <View style={styles.fontRow}>
          <IconButton
            label="A−"
            onPress={() => app.setFontSize(app.fontSize - FONT_SIZE.step)}
            disabled={app.fontSize <= FONT_SIZE.min}
            accessibilityLabel="Pienennä tekstiä"
          />
          <View style={[styles.preview, { backgroundColor: colors.surfaceAlt }]}>
            <AppText style={{ fontFamily: fonts.regular, fontSize: app.fontSize, lineHeight: app.fontSize * 1.4 }}>
              Olipa kerran…
            </AppText>
          </View>
          <IconButton
            label="A+"
            onPress={() => app.setFontSize(app.fontSize + FONT_SIZE.step)}
            disabled={app.fontSize >= FONT_SIZE.max}
            accessibilityLabel="Suurenna tekstiä"
          />
        </View>
      </Group>

      <Group title="Tarrakirja">
        <SecondaryButton label="Tyhjennä tarrakirja" icon="trash-outline" onPress={confirmReset} />
      </Group>

      <Group title="Tietosuoja">
        <AppText>
          🔒 Satukirja ei kerää eikä lähetä mitään tietoja. Nimi, ikä, suosikit ja tarrat tallentuvat vain tähän laitteeseen.
          Sovelluksessa ei ole mainoksia, ostoksia eikä ulkoisia linkkejä.
        </AppText>
        <AppText variant="caption" muted>
          Versio {Constants.expoConfig?.version ?? '1.0.0'}
        </AppText>
      </Group>
    </ScrollView>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useAppData();
  return (
    <View style={{ gap: spacing.sm }}>
      <AppText variant="overline" muted>
        {title}
      </AppText>
      <View style={[styles.group, { backgroundColor: colors.surface }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.md, gap: spacing.lg, paddingBottom: spacing.xxl, maxWidth: 640, width: '100%', alignSelf: 'center' },
  group: { borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm },
  input: { borderRadius: radius.md, paddingHorizontal: spacing.md, minHeight: 52, fontFamily: fonts.semibold, fontSize: 18 },
  segment: { flexDirection: 'row', gap: spacing.sm },
  segmentItem: { borderRadius: radius.md, minHeight: 64, alignItems: 'center', justifyContent: 'center', gap: 2 },
  fontRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  preview: { flex: 1, borderRadius: radius.md, padding: spacing.sm, alignItems: 'center', minHeight: 64, justifyContent: 'center' },
});
