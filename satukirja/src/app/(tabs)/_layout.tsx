/**
 * Alapalkin välilehdet: Koti, Kategoriat, Haku ja Suosikit.
 */
import React from 'react';
import { Tabs } from 'expo-router/js-tabs';
import type { ColorValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppData } from '@/storage/AppDataContext';
import { fonts } from '@/theme/theme';

type IconName = keyof typeof Ionicons.glyphMap;

function tabIcon(name: IconName, activeName: IconName) {
  return ({ color, focused }: { color: ColorValue; focused: boolean }) => (
    <Ionicons name={focused ? activeName : name} size={28} color={color as string} />
  );
}

export default function TabsLayout() {
  const { colors } = useAppData();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarItemStyle: { paddingVertical: 4 },
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 13 },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Koti', tabBarIcon: tabIcon('home-outline', 'home') }} />
      <Tabs.Screen name="categories" options={{ title: 'Kategoriat', tabBarIcon: tabIcon('grid-outline', 'grid') }} />
      <Tabs.Screen name="search" options={{ title: 'Haku', tabBarIcon: tabIcon('search-outline', 'search') }} />
      <Tabs.Screen name="favorites" options={{ title: 'Suosikit', tabBarIcon: tabIcon('heart-outline', 'heart') }} />
    </Tabs>
  );
}
