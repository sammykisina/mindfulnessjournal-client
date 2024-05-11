import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { z } from 'zod';
import useAxiosPrivate from '@/hooks/shared/use-axios-private';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import useActivities from '@/queries/admin/use-activities';
import { useRecoilState } from 'recoil';
import ActivityAtoms from '@/atoms/actitivity';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/ui/button';
import { Image } from 'react-native';
import Label from '@/components/ui/label';
import icons from '@/constants/icons';
import { AxiosError } from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Input } from '@/components/ui/input';
import { ActivityIndicator } from '@/components/partials/activity-indicator';
import { notify } from 'react-native-notificated';

/**
 * SCHEMA
 */
export const activitySchema = z.object({
  title: z.string(),
  content: z.string(),
});

export default function EditActivity() {
  /**
   * === STATES ===
   */

  const [globalActivity, setGlobalActivity] = useRecoilState(
    ActivityAtoms.globalActivityState
  );

  const { axiosPrivate } = useAxiosPrivate();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof activitySchema>>({
    resolver: zodResolver(activitySchema),
  });

  /**
   * === FUNCTIONS ===
   */

  /**
   * RESET FORM INPUTS
   */
  React.useEffect(() => {
    if (globalActivity) {
      reset({
        title: globalActivity?.title,
        content: globalActivity?.content,
      });
    }
  }, [globalActivity]);

  /**
   * ON VALUES SUBMIT
   */
  const onSubmit = async (values: z.infer<typeof activitySchema>) => {
    await updateActivityMutateAsync(values);
  };

  /**
   * UPDATE ACTIVITY
   */
  const {
    mutateAsync: updateActivityMutateAsync,
    isPending: isUpdatingActivity,
  } = useMutation({
    mutationFn: async (activityPayload: {
      title?: string;
      content?: string;
    }) => {
      return (
        await axiosPrivate.patch(
          `/admin/activities/${globalActivity?.id}`,
          activityPayload
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

      queryClient.invalidateQueries({ queryKey: ['activities'] });

      reset({
        title: '',
        content: '',
      });

      setGlobalActivity(null);
      router.replace(`(mindfulness)/${globalActivity.id}`);
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
      <View className='flex flex-row items-center gap-4'>
        <Button
          onPress={() => {
            setGlobalActivity(null);
            router.replace(`(mindfulness)/${globalActivity.id}`);
          }}
          variant='ghost'
          size='icon'
        >
          <Image source={icons.back} resizeMode='contain' />
        </Button>

        <Label className='text-2xl font-intersemibold'>Edit Activity</Label>
      </View>

      <ScrollView className='mt-5 px-2  pb-12'>
        <View>
          <View className='flex flex-col gap-2'>
            <View className='flex flex-col gap-2'>
              <Label className='text-lg'>Title</Label>

              <Input
                control={control}
                name='title'
                error={errors?.title?.message}
                placeholder='activity title'
                className='bg-gray-100'
              />

              {errors?.title?.message && (
                <Label className='text-sm font-medium text-destructive'>
                  {errors?.title?.message}
                </Label>
              )}
            </View>

            <View className='flex flex-col gap-2'>
              <Label className='text-lg'>Content</Label>

              <Input
                control={control}
                name='content'
                error={errors?.content?.message}
                placeholder='activity content'
                className='bg-gray-100 min-h-11'
                multiline
              />

              {errors?.content?.message && (
                <Label className='text-sm font-medium text-destructive'>
                  {errors?.content?.message}
                </Label>
              )}
            </View>
          </View>

          <Button
            onPress={handleSubmit(onSubmit)}
            size='lg'
            variant='default'
            className='rounded-full mt-3 h-[51px]'
          >
            {isUpdatingActivity ? (
              <ActivityIndicator
                className='text-primary-foreground'
                title='updating...'
              />
            ) : (
              <Text className='text-primary-foreground'>Update Activity</Text>
            )}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
