import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name='login'
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name='sign-up'
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name='request-password-reset-code'
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name='reset-password'
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor='#fff' style='dark' />
    </>
  );
}
