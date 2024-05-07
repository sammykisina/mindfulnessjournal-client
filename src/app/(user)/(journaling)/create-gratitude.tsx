import { View, Image, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/ui/button';
import { router } from 'expo-router';
import icons from '@/constants/icons';
import Label from '@/components/ui/label';
import { z } from 'zod';
import useAxiosPrivate from '@/hooks/shared/use-axios-private';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notify } from 'react-native-notificated';
import { AxiosError } from 'axios';
import { Input } from '@/components/ui/input';
import { ActivityIndicator } from '@/components/partials/activity-indicator';
import useTodayJournal from '@/queries/user/use-today-journal';

/**
 * SCHEMA
 */
export const gratitudeSchema = z.object({
  gratitude_one: z.string(),
  gratitude_two: z.string(),
  gratitude_three: z.string(),
});

export default function CreateGratitude() {
  /**
   * === STATES ===
   */
  const { axiosPrivate } = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { todayJournal } = useTodayJournal();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof gratitudeSchema>>({
    resolver: zodResolver(gratitudeSchema),
  });

  /**
   * === FUNCTIONS ===
   */

  /**
   * ON VALUES SUBMIT
   */
  const onSubmit = async (values: z.infer<typeof gratitudeSchema>) => {
    const daily_gratitude =
      values?.gratitude_one +
      '>' +
      values?.gratitude_two +
      '>' +
      values?.gratitude_three;

    console.log('daily_gratitude', daily_gratitude);

    await createDailyGratitudeMutateAsync({
      daily_gratitude: daily_gratitude,
    });
  };

  /**
   * CREATE DAILY GRATITUDE
   */
  const {
    mutateAsync: createDailyGratitudeMutateAsync,
    isPending: isCreatingDailyGratitude,
  } = useMutation({
    mutationFn: async ({ daily_gratitude }: { daily_gratitude: string }) => {
      return (
        await axiosPrivate.patch(
          `/user/journals/${todayJournal?.id}/gratitude`,
          {
            daily_gratitude,
          }
        )
      ).data;
    },

    onSuccess: async (response) => {
      notify('success', {
        params: {
          title: 'WOW',
          description: response?.data?.message,
        },
      });

      queryClient.invalidateQueries({ queryKey: ['today-journal'] });

      reset({
        gratitude_one: '',
        gratitude_two: '',
        gratitude_three: '',
      });

      router.back();
    },

    onError: async (error: AxiosError<any, any>) => {
      return notify('error', {
        params: {
          title: 'Opps',
          description: error.response?.data?.message,
        },
      });
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View className='flex flex-row items-center gap-4 px-2'>
        <Button onPress={() => router.back()} variant='ghost' size='icon'>
          <Image source={icons.back} resizeMode='contain' />
        </Button>

        <Label className='text-4xl font-intersemibold'>Daily Gratitude</Label>
      </View>

      <ScrollView className='mt-5 px-2 pb-12'>
        <View className='flex flex-col gap-4'>
          <View className='flex flex-col gap-2'>
            <Label className='text-lg'>Today, i'm grateful for</Label>

            <Input
              control={control}
              name='gratitude_one'
              error={errors?.gratitude_one?.message}
              placeholder='Daily gratitude #1'
              className='bg-gray-100'
              multiline
            />

            {errors?.gratitude_one?.message && (
              <Label className='text-sm font-medium text-destructive'>
                {errors?.gratitude_one?.message}
              </Label>
            )}

            <Input
              control={control}
              name='gratitude_two'
              error={errors?.gratitude_two?.message}
              placeholder='Daily gratitude #2'
              className='bg-gray-100'
              multiline
            />

            {errors?.gratitude_two?.message && (
              <Label className='text-sm font-medium text-destructive'>
                {errors?.gratitude_two?.message}
              </Label>
            )}

            <Input
              control={control}
              name='gratitude_three'
              error={errors?.gratitude_three?.message}
              placeholder='Daily gratitude #3'
              className='bg-gray-100'
              multiline
            />

            {errors?.gratitude_three?.message && (
              <Label className='text-sm font-medium text-destructive'>
                {errors?.gratitude_three?.message}
              </Label>
            )}
          </View>

          <Button
            onPress={handleSubmit(onSubmit)}
            variant='default'
            size='default'
            className='h-[3rem] rounded-md mt-6'
          >
            {isCreatingDailyGratitude ? (
              <ActivityIndicator
                className='text-primary-foreground'
                title='creating...'
              />
            ) : (
              <Label className='text-primary-foreground'>Save</Label>
            )}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
