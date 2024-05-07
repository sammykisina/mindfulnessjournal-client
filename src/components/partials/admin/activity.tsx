import { View, Pressable } from 'react-native';
import React from 'react';
import { Image } from 'react-native';
import Label from '@/components/ui/label';
import { Link } from 'expo-router';

type ActivityProps = {
  id: number;
  thumbnail: any;
  title: string;
};

export default function Activity({ item }: { item: ActivityProps }) {
  /**
   * === STATES ===
   */
  return (
    <Link
      href={
        item?.id === 0
          ? '(mindfulness)/create-activity'
          : `(mindfulness)/${item.id}`
      }
      asChild
    >
      <Pressable className='flex-1 max-w-[50%] '>
        <View className='overflow-hidden  rounded-2xl'>
          <Image
            source={item?.id === 0 ? item.thumbnail : { uri: item?.thumbnail }}
            className='w-full object-cover h-[15rem]'
            resizeMode='cover'
          />
        </View>

        <View className='px-2 py-3'>
          <Label className='text-lg capitalize font-intersemibold tracking-wide'>
            {item?.title}
          </Label>
        </View>
      </Pressable>
    </Link>
  );
}
