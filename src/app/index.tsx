import { View, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import images from '@/constants/images';
import Button, { buttonVariants } from '@/components/ui/button';
import Label from '@/components/ui/label';
import { Link, Redirect, router } from 'expo-router';
import { useAuth } from '@/context/auth-provider';

export default function LandingPage() {
  /**
   * === STATES ===
   */
  const { isLoadingAuth, isLoggedIn, auth } = useAuth();

  if (!auth && isLoadingAuth) {
    return <View></View>;
  }

  if (!isLoadingAuth && isLoggedIn) {
    if (auth?.user?.user_type === 'admin') {
      return <Redirect href='/(admin)/home' />;
    }

    if (auth?.user?.user_type === 'user') {
      return <Redirect href='/(user)/home' />;
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View className='h-[80%] flex flex-col justify-between'>
        <View className='flex items-center flex-col justify-between'>
          <Image
            source={images.logoDark}
            className='w-[400px] h-[300px]'
            resizeMode='contain'
          />

          <Image source={images.sureiDark} resizeMode='contain' />
        </View>

        <View className='p-2 flex flex-col gap-4'>
          <Button
            variant='default'
            size='controlled'
            className='rounded-full h-[51px]'
            onPress={() => router.replace('/login')}
          >
            <Label className='text-white text-lg'>Log In</Label>
          </Button>

          <View className='flex flex-row items-center gap-3 justify-center'>
            <Label className='text-lg'>Don't have an account? </Label>

            <Link
              className={buttonVariants({
                variant: 'link',
              })}
              href='/sign-up'
            >
              <Label className='font-interbold text-lg'>Sign Up</Label>
            </Link>
          </View>
        </View>
      </View>

      <StatusBar backgroundColor='#fff' style='dark' />
    </SafeAreaView>
  );
}
