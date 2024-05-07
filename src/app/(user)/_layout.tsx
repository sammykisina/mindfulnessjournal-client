import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import icons from '@/constants/icons';
import { TabIcon } from '@/components/ui/tab-icon';

export default function ParentLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#0048B4',
          tabBarStyle: {
            backgroundColor: '#f5f5f5',
            height: 84,
            marginTop: 2,
          },
        }}
      >
        <Tabs.Screen
          name='(journaling)'
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
                icon={icons.s}
                name='Home'
              />
            ),
          }}
        />

        <Tabs.Screen
          name='(mindfulness)'
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

        <Tabs.Screen
          name='account'
          options={{
            title: 'Account',
            headerShown: false,
            href: null,
          }}
        />
      </Tabs>

      <StatusBar backgroundColor='' style='dark' />
    </>
  );
}
