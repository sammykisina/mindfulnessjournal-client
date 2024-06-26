import React from 'react';
import { Stack, Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AdminLayout() {
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
          name='[activity]'
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name='create-activity'
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name='edit-activity'
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name='upload-activity-assets'
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor='#fff' style='dark' />
    </>
  );
}
