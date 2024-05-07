import { View, Pressable } from 'react-native';
import React from 'react';
import { Image } from 'react-native';
import Label from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/shared/use-axios-private';
import { AxiosError } from 'axios';
import { router } from 'expo-router';

type ActivityProps = {
  id: number;
  thumbnail: any;
  title: string;
};

export default function Activity({ item }: { item: ActivityProps }) {
  /**
   * === STATES ===
   */
  const { axiosPrivate } = useAxiosPrivate();
  const queryClient = useQueryClient();

  /**
   * === FUNCTIONS ===
   */

  /**
   * UPDATE ACTIVITY COUNT
   */
  const { mutateAsync: updateActivityCountMutateAsync } = useMutation({
    mutationFn: async ({ activity }: { activity: number }) => {
      return (
        await axiosPrivate.patch(`/user/activity/${activity}/count-update`)
      ).data;
    },

    onSuccess: async (response) => {
      queryClient.invalidateQueries({
        queryKey: ['recommendations-activities'],
      });
    },

    onError: async (error: AxiosError<any, any>) => {
      console.log('error', error);
    },
  });

  return (
    <Pressable
      onPress={() => {
        updateActivityCountMutateAsync({ activity: item?.id });
        router.push(`/(user)/(mindfulness)/${item.id}`);
      }}
      className='flex-1 max-w-[50%] '
    >
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
  );
}
