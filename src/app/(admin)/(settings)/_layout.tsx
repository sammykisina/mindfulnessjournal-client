import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AdminLayout() {
  /**
   * === FUNCTIONS ===
   */

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
          name='[account]'
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor='#fff' style='dark' />
    </>
  );
}
