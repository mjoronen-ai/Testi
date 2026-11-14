/**
 * Juurirakenne: tämä tiedosto kääri koko sovelluksen.
 *
 *  1. Lataa fontit (Nunito).
 *  2. Antaa kaikille näkymille pääsyn tallennettuihin tietoihin (AppDataProvider).
 *  3. Määrittää navigoinnin: välilehdet (tabs), lukunäkymä ja kategorianäkymä.
 */
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import { AppDataProvider, useAppData } from '@/storage/AppDataContext';
import { fonts, lightPalette } from '@/theme/theme';

function RootNavigator() {
  const { ready, colors, nightMode } = useAppData();

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={nightMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontFamily: fonts.bold, fontSize: 20 },
          headerShadowVisible: false,
          headerBackTitle: 'Takaisin',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Lukunäkymällä on oma yläpalkki, jossa isot napit. */}
        <Stack.Screen name="story/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="category/[id]" options={{ title: '' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Nunito_400Regular, Nunito_600SemiBold, Nunito_800ExtraBold });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: lightPalette.background }} />;
  }

  return (
    <SafeAreaProvider>
      <AppDataProvider>
        <RootNavigator />
      </AppDataProvider>
    </SafeAreaProvider>
  );
}
