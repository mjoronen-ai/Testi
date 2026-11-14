/**
 * ALOITUSOPASTUS (näytetään vain ensimmäisellä käynnistyskerralla)
 *
 * Kolme lyhyttä vaihetta: tervetuloa → lapsen nimi (vapaaehtoinen) → ikä.
 * Iän perusteella etusivulle tulee sopivat satusuositukset.
 * Tiedot tallentuvat vain tähän laitteeseen.
 */
import React, { useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppData } from '@/storage/AppDataContext';
import { AppText } from '@/components/AppText';
import { PrimaryButton, SecondaryButton } from '@/components/Buttons';
import { AgePicker } from '@/components/AgePicker';
import { fonts, radius, spacing } from '@/theme/theme';
import { successFeedback } from '@/utils/haptics';

export default function OnboardingScreen() {
  const { colors, saveProfile, profile } = useAppData();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age);
  const fade = useRef(new Animated.Value(1)).current;

  const goTo = (next: number) => {
    Animated.timing(fade, { toValue: 0, duration: 140, useNativeDriver: true }).start(() => {
      setStep(next);
      Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
    });
  };

  const finish = () => {
    successFeedback();
    saveProfile({ name, age });
    router.replace('/');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient colors={[colors.backgroundTop, colors.background]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
          {/* Edistymispisteet */}
          <View style={styles.dots}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[styles.dot, { backgroundColor: i <= step ? colors.primary : colors.border, width: i === step ? 28 : 10 }]}
              />
            ))}
          </View>

          <Animated.View style={[styles.body, { opacity: fade }]}>
            {step === 0 ? (
              <>
                <View style={styles.illustration}>
                  <LinearGradient colors={['#B9AEF0', '#7F74D6']} style={[StyleSheet.absoluteFill, { borderRadius: 999 }]} />
                  <AppText style={styles.bigEmoji}>📖</AppText>
                  <AppText style={[styles.floatEmoji, { top: 10, right: 18 }]}>🌙</AppText>
                  <AppText style={[styles.floatEmoji, { bottom: 18, left: 8 }]}>🦊</AppText>
                  <AppText style={[styles.floatEmoji, { top: 30, left: 14, fontSize: 22 }]}>✨</AppText>
                </View>
                <AppText variant="display" style={styles.center}>
                  Tervetuloa Satukirjaan
                </AppText>
                <AppText muted style={[styles.center, styles.lead]}>
                  Rauhallisia satuja iltaan ja päivään, lapsen iän mukaan.
                </AppText>
                <View style={styles.features}>
                  <Feature emoji="🌙" text="Iltasatuja, eläinsatuja ja seikkailuja" />
                  <Feature emoji="🎧" text="Lue itse tai kuuntele ääneen luettuna" />
                  <Feature emoji="🏅" text="Kerää tarra jokaisesta luetusta sadusta" />
                  <Feature emoji="🔒" text="Ei mainoksia. Toimii ilman nettiä." />
                </View>
              </>
            ) : step === 1 ? (
              <>
                <AppText style={styles.stepEmoji}>👋</AppText>
                <AppText variant="hero" style={styles.center}>
                  Kenelle satuja luetaan?
                </AppText>
                <AppText muted style={[styles.center, styles.lead]}>
                  Nimellä sovellus voi tervehtiä lasta. Tämä on vapaaehtoista.
                </AppText>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Lapsen nimi tai lempinimi"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
                  maxLength={20}
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => goTo(2)}
                  accessibilityLabel="Lapsen nimi"
                />
              </>
            ) : (
              <>
                <AppText style={styles.stepEmoji}>🎂</AppText>
                <AppText variant="hero" style={styles.center}>
                  {name.trim() ? `Kuinka vanha ${name.trim()} on?` : 'Kuinka vanhalle lapselle?'}
                </AppText>
                <AppText muted style={[styles.center, styles.lead]}>
                  Etusivulle tulee iän mukaan sopivia satuja. Kaikki sadut ovat silti aina saatavilla.
                </AppText>
                <AgePicker value={age} onChange={setAge} />
              </>
            )}
          </Animated.View>

          <View style={styles.footer}>
            {step === 0 ? <PrimaryButton label="Aloitetaan" onPress={() => goTo(1)} /> : null}
            {step === 1 ? (
              <>
                <PrimaryButton label="Jatka" onPress={() => goTo(2)} />
                <SecondaryButton label="Ohita" onPress={() => { setName(''); goTo(2); }} />
              </>
            ) : null}
            {step === 2 ? (
              <>
                <PrimaryButton label="Valmis! Näytä sadut" onPress={finish} />
                <SecondaryButton label="Takaisin" onPress={() => goTo(1)} />
              </>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function Feature({ emoji, text }: { emoji: string; text: string }) {
  const { colors } = useAppData();
  return (
    <View style={[styles.feature, { backgroundColor: colors.surface }]}>
      <AppText style={{ fontSize: 24, lineHeight: 30 }}>{emoji}</AppText>
      <AppText variant="subtitle" style={{ flex: 1, fontSize: 16 }}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, maxWidth: 560, width: '100%', alignSelf: 'center' },
  dots: { flexDirection: 'row', gap: 6, justifyContent: 'center', marginTop: spacing.sm },
  dot: { height: 10, borderRadius: 5 },
  body: { flex: 1, justifyContent: 'center', gap: spacing.md },
  illustration: { width: 160, height: 160, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  bigEmoji: { fontSize: 72, lineHeight: 86 },
  floatEmoji: { position: 'absolute', fontSize: 32, lineHeight: 40 },
  stepEmoji: { fontSize: 64, lineHeight: 76, textAlign: 'center' },
  center: { textAlign: 'center' },
  lead: { fontSize: 18, lineHeight: 26 },
  features: { gap: spacing.sm, marginTop: spacing.sm },
  feature: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderRadius: radius.md, padding: spacing.md },
  input: {
    borderWidth: 2,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 60,
    fontFamily: fonts.semibold,
    fontSize: 20,
    textAlign: 'center',
  },
  footer: { gap: spacing.sm, paddingTop: spacing.md },
});
