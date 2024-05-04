import { View, Pressable } from 'react-native';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Image } from 'react-native';
import Label from '@/components/ui/label';
import { Link } from 'expo-router';
import {} from 'react-native';

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
      <Pressable className='flex-1 p-1 rounded-2xl max-w-[50%]'>
        <Image
          source={item.thumbnail}
          className='w-full object-cover h-[15rem]'
          resizeMode='contain'
        />

        <Label className='text-lg capitalize font-intersemibold tracking-wide'>
          {item?.title}
        </Label>
      </Pressable>
    </Link>
  );
}
