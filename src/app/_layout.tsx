import { SplashScreen, Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import React from 'react';
import { createNotifications } from 'react-native-notificated';
import '../global.css';
import { RecoilRoot } from 'recoil';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from '@/context/auth-provider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import icons from '@/constants/icons';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  /**
   * === STATES ===
   */
  const queryClient = new QueryClient();

  const { NotificationsProvider, useNotifications, ...events } =
    createNotifications();

  /**
   * FONTS
   */
  const [fontsLoaded, error] = useFonts({
    'Inter-Black': require('../../assets/fonts/Inter-Black.ttf'),
    'Inter-Bold': require('../../assets/fonts/Inter-Bold.ttf'),
    'Inter-ExtraBold': require('../../assets/fonts/Inter-ExtraBold.ttf'),
    'Inter-ExtraLight': require('../../assets/fonts/Inter-ExtraLight.ttf'),
    'Inter-Light': require('../../assets/fonts/Inter-Light.ttf'),
    'Inter-Medium': require('../../assets/fonts/Inter-Medium.ttf'),
    'Inter-Regular': require('../../assets/fonts/Inter-Regular.ttf'),
    'Inter-SemiBold': require('../../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Thin': require('../../assets/fonts/Inter-Thin.ttf'),
  });

  React.useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <RecoilRoot>
              <Stack>
                <Stack.Screen
                  name='index'
                  options={{
                    headerShown: false,
                  }}
                />

                <Stack.Screen
                  name='(auth)'
                  options={{
                    headerShown: false,
                  }}
                />

                <Stack.Screen
                  name='(admin)'
                  options={{
                    headerShown: false,
                  }}
                />
              </Stack>
            </RecoilRoot>
            <NotificationsProvider />
          </QueryClientProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
