/**
 * Alapalkin välilehdet: Koti, Selaa, Suosikit ja Tarrat.
 * Jos aloitusopastusta ei ole vielä tehty, ohjataan ensin sinne.
 */
import React from 'react';
import { Platform, type ColorValue } from 'react-native';
import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAppData } from '@/storage/AppDataContext';
import { fonts } from '@/theme/theme';

type IconName = keyof typeof Ionicons.glyphMap;

function tabIcon(name: IconName, activeName: IconName) {
  return ({ color, focused }: { color: ColorValue; focused: boolean }) => (
    <Ionicons name={focused ? activeName : name} size={26} color={color as string} />
  );
}

export default function TabsLayout() {
  const { colors, onboarded } = useAppData();

  if (!onboarded) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          ...(Platform.OS === 'web' ? { height: 68 } : null),
        },
        tabBarItemStyle: { paddingVertical: 4 },
        tabBarLabelStyle: { fontFamily: fonts.bold, fontSize: 12 },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Koti', tabBarIcon: tabIcon('home-outline', 'home') }} />
      <Tabs.Screen name="explore" options={{ title: 'Selaa', tabBarIcon: tabIcon('compass-outline', 'compass') }} />
      <Tabs.Screen name="favorites" options={{ title: 'Suosikit', tabBarIcon: tabIcon('heart-outline', 'heart') }} />
      <Tabs.Screen name="stickers" options={{ title: 'Tarrat', tabBarIcon: tabIcon('ribbon-outline', 'ribbon') }} />
    </Tabs>
  );
}
