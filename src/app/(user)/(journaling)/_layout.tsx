import React from 'react';
import { Stack, Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function JournalingLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name='index'
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name='[journal]'
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name='create-gratitude'
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor='#fff' style='dark' />
    </>
  );
}
