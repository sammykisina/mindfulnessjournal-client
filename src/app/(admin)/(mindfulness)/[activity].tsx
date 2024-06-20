import { FlatList, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import useActivities from '@/queries/admin/use-activities';
import Button from '@/components/ui/button';
import { Image } from 'react-native';
import icons from '@/constants/icons';
import Label from '@/components/ui/label';
import { Loading } from '@/components/partials/loading';
import { useSetRecoilState } from 'recoil';
import ActivityAtoms from '@/atoms/actitivity';
import { EmptyState } from '@/components/partials/empty-state';
import { ScrollView } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/shared/use-axios-private';
import { notify } from 'react-native-notificated';
import { AxiosError } from 'axios';
import { ActivityIndicator } from '@/components/partials/activity-indicator';

export default function Activity() {
  /**
   * === STATES ===
   */
  const { axiosPrivate } = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { activity } = useLocalSearchParams();
  const { activities, isFetchingActivities } = useActivities({
    url: `/admin/activities?filter[id]=${activity}&include=assets`,
  });

  console.log('activities', activities?.[0]?.assets);

  const setGlobalActivity = useSetRecoilState(
    ActivityAtoms.globalActivityState
  );

  const DeleteImage = ({ asset }: { asset: number }) => {
    /**
     * === FUNCTIONS ===
     */

    /**
     * DELETE ACTIVITY IMAGE
     */
    const {
      mutateAsync: deleteActivityMutateAsync,
      isPending: isDeletingActivityImage,
    } = useMutation({
      mutationFn: async () => {
        return (await axiosPrivate.delete(`/admin/activities/${asset}/image`))
          .data;
      },

      onSuccess: async (response) => {
        notify('success', {
          params: {
            title: 'WOW',
            description: response?.data?.message,
          },
        });

        queryClient.invalidateQueries({ queryKey: ['activities'] });
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
      <Button
        onPress={async () => {
          await deleteActivityMutateAsync();
        }}
        className=' absolute top-0 right-2'
        size='icon'
        variant='ghost'
      >
        {isDeletingActivityImage ? (
          <ActivityIndicator title='' />
        ) : (
          <Image
            className='h-[24px] w-[24px]'
            source={icons?.deleteIcon}
            tintColor='red'
            resizeMode='cover'
          />
        )}
      </Button>
    );
  };

  /**
   * DELETE ACTIVITY
   */
  const { mutateAsync: deleteActivity, isPending: isDeletingActivity } =
    useMutation({
      mutationFn: async (activity_id: number) => {
        return (await axiosPrivate.delete(`/admin/activities/${activity_id}`))
          .data;
      },

      onSuccess: async (response) => {
        notify('success', {
          params: {
            title: 'WOW',
            description: response?.data?.message,
          },
        });

        queryClient.invalidateQueries({ queryKey: ['activities'] });
        router.replace('(mindfulness)');
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
      <View className='flex flex-row items-center justify-between px-2'>
        <View className='flex flex-row items-center gap-4'>
          <Button
            onPress={() => router.replace('(mindfulness)')}
            variant='ghost'
            size='icon'
          >
            <Image source={icons.back} resizeMode='contain' />
          </Button>
          <Label className='text-2xl font-intersemibold capitalize'>
            {activities?.[0]?.title}
          </Label>
        </View>

        <View className='flex flex-row gap-2 items-center'>
          <Button
            onPress={() => {
              setGlobalActivity(activities?.[0]);
              router.replace('/(mindfulness)/edit-activity');
            }}
            variant='ghost'
            size='icon'
          >
            <Image source={icons.edit} resizeMode='contain' />
          </Button>

          <Button
            onPress={() => {
              setGlobalActivity(activities?.[0]);
              router.replace('/(mindfulness)/upload-activity-assets');
            }}
            variant='ghost'
            size='icon'
          >
            <Image
              className='h-[30px]'
              source={icons.upload}
              resizeMode='contain'
            />
          </Button>

          <Button
            onPress={async () => {
              console.log(activities?.[0]?.id);

              await deleteActivity(activities?.[0]?.id);
            }}
            variant='outline'
            size='icon'
          >
            {isDeletingActivity ? (
              <ActivityIndicator title='' />
            ) : (
              <Label>Delete</Label>
            )}
          </Button>
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

                  <DeleteImage asset={asset?.id} />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
