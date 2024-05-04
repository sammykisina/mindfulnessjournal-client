import { View, Text, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native';
import images from '@/constants/images';
import { Card, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-provider';
import Button from '@/components/ui/button';
import { deleteAllFromLocalStorage } from '@/lib/storage';
import Label from '@/components/ui/label';

export default function Home() {
  /**
   * === STATES ===
   */
  const { auth } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View className='justify-center items-center p-4'>
        <Image
          className='h-[15rem]'
          source={images.sureiDark}
          resizeMode='contain'
        />

        <Card className=' bg-gray-200 h-[20rem] shadow-sm rounded-xl w-full items-center flex justify-center gap-3'>
          <Image
            className='h-[10rem]'
            source={images.avatar}
            resizeMode='contain'
          />

          <CardTitle>Hello, {auth?.user?.name}</CardTitle>
        </Card>

        <Button
          onPress={async () => {
            await deleteAllFromLocalStorage();
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
