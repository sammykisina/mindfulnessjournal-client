import { View, Text, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native';
import images from '@/constants/images';
import { Card, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-provider';
import Avatar from '@/components/partials/shared/avatar';
import useUsers from '@/queries/admin/use-users';

export default function Home() {
  /**
   * === STATES ===
   */
  const { auth } = useAuth();
  const { users } = useUsers({
    url: `/admin/users?filter[id]=${auth?.user?.id}`,
  });

  console.log('at home');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View className='justify-center items-center p-4'>
        <Image
          className='h-[15rem]'
          source={images.sureiDark}
          resizeMode='contain'
        />

        <Card className=' bg-gray-200 h-[20rem] shadow-sm rounded-xl w-full items-center flex justify-center gap-3'>
          <Avatar profile_pic={users?.[0]?.profile_pic} />

          <CardTitle>Hello, {auth?.user?.name}</CardTitle>
        </Card>
      </View>
    </SafeAreaView>
  );
}
