import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import images from '@/constants/images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-provider';
import Button from '@/components/ui/button';
import { Link, router } from 'expo-router';
import Label from '@/components/ui/label';
import Icons from '@/constants/icons';
import icons from '@/constants/icons';
import { deleteAllFromLocalStorage } from '@/lib/storage';

export default function Home() {
  /**
   * === STATES ===
   */
  const { auth } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View className=' flex flex-col gap-2 items-center p-2'>
        <View className='flex flex-row justify-between w-full items-center'>
          <Image
            className='h-[5rem]'
            source={images.sureiDark}
            resizeMode='contain'
          />

          <Link asChild href='/(user)/account'>
            <Pressable>
              <Image
                className='h-[3rem]'
                source={icons.setting}
                resizeMode='contain'
              />
            </Pressable>
          </Link>
        </View>

        <View className='flex flex-col gap-3 w-full'>
          <Card className=' bg-gray-200 h-[20rem] shadow-sm rounded-xl w-full items-center flex justify-center gap-3 '>
            <Image
              className='h-[10rem]'
              source={images.avatar}
              resizeMode='contain'
            />

            <CardTitle>Hello, {auth?.user?.name}</CardTitle>
          </Card>

          <Card className='border border-gray-100 flex flex-col gap-2'>
            <CardHeader className='p-2'>
              <CardTitle>Your mood this week</CardTitle>
            </CardHeader>

            <CardContent></CardContent>
          </Card>
        </View>

        <Button
          onPress={async () => {
            await deleteAllFromLocalStorage();
            router.replace('/login');
          }}
          size='lg'
          variant='secondary'
          className='rounded-none border mt-4 h-[51px]'
        >
          <Label>CLEAR STORAGE</Label>
        </Button>
      </View>
    </SafeAreaView>
  );
}
