import { ScrollView, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import useActivities from '@/queries/admin/use-activities';
import Button from '@/components/ui/button';
import { Image } from 'react-native';
import icons from '@/constants/icons';
import Label from '@/components/ui/label';
import { Loading } from '@/components/partials/loading';

export default function Activity() {
  /**
   * === STATES ===
   */
  const { activity } = useLocalSearchParams();

  const { activities, isFetchingActivities } = useActivities({
    url: `/admin/activities?filter[id]=${activity}&include=assets`,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View className='flex flex-row items-center justify-between px-2'>
        <View className='flex flex-row items-center gap-4'>
          <Button
            onPress={() => router.replace('/(user)/(mindfulness)')}
            variant='ghost'
            size='icon'
          >
            <Image source={icons.back} resizeMode='contain' />
          </Button>
          <Label className='text-2xl font-intersemibold capitalize'>
            {activities?.[0]?.title}
          </Label>
        </View>
      </View>

      {isFetchingActivities ? (
        <Loading title='fetching activity data' />
      ) : (
        <ScrollView className='mt-5 px-2 flex flex-col gap-3'>
          <Image
            className='h-[15rem]'
            source={{ uri: activities?.[0]?.thumbnail }}
            resizeMode='cover'
          />

          <Label className=' w-full rounded-md border border-input bg-gray-100 px-3 py-2 text-lg'>
            {activities?.[0]?.content}
          </Label>

          <View className='flex flex-col gap-4 pb-3 '>
            <Label className='text-2xl font-intersemibold tracking-wider'>
              Assets
            </Label>

            <View className='flex flex-col gap-2'>
              {activities?.[0]?.assets?.map((asset, index) => (
                <View className='w-full' key={index}>
                  <Image
                    className='h-[15rem]'
                    source={{ uri: asset?.asset }}
                    resizeMode='cover'
                  />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
