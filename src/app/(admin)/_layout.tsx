import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import icons from '@/constants/icons';
import { TabIcon } from '@/components/ui/tab-icon';

export default function AdminLayout() {
  /**
   * === FUNCTIONS ===
   */

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#0048B4',
          tabBarStyle: {
            backgroundColor: '#f5f5f5',
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name='(settings)'
          options={{
            title: 'Settings',

            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                color={color}
                focused={focused}
                icon={icons.head}
                name='Settings'
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
                icon={icons.s}
                name='Home'
              />
            ),
          }}
        />

        <Tabs.Screen
          name='(mindfulness)'
          options={{
            title: 'mindfulness',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                color={color}
                focused={focused}
                icon={icons.setting}
                name='Mindfulness'
              />
            ),
          }}
        />
      </Tabs>

      <StatusBar backgroundColor='#fff' style='dark' />
    </>
  );
}
