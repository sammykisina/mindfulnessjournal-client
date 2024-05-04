import { View, Text, Image } from 'react-native';
import React, { ReactNode } from 'react';

import { Tabs } from 'expo-router';
import { cn } from '@/lib/utils';
import { StatusBar } from 'expo-status-bar';
import icons from '@/constants/icons';
import images from '@/constants/images';
import { TabIcon } from '@/components/ui/tab-icon';

export default function ParentLayout() {
  /**
   * === FUNCTIONS ===
   */

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#5be584',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#f5f5f5',
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name='journaling'
          options={{
            title: 'Journaling',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                color={color}
                focused={focused}
                icon={icons.edit}
                name='Journaling'
              />
            ),
          }}
        />

        <Tabs.Screen
          name='home'
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                color={color}
                focused={focused}
                icon={images.sureiDark}
                name='Home'
              />
            ),
          }}
        />

        <Tabs.Screen
          name='mindfulness'
          options={{
            title: 'Mindfulness',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                color={color}
                focused={focused}
                icon={icons.head}
                name='Mindfulness'
              />
            ),
          }}
        />
      </Tabs>

      <StatusBar backgroundColor='' style='dark' />
    </>
  );
}
