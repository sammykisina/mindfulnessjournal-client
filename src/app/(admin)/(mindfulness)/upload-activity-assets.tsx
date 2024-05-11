import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import useAxiosPrivate from '@/hooks/shared/use-axios-private';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useRecoilState } from 'recoil';
import ActivityAtoms from '@/atoms/actitivity';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/ui/button';
import { Image } from 'react-native';
import Label from '@/components/ui/label';
import icons from '@/constants/icons';
import { AxiosError } from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator } from '@/components/partials/activity-indicator';
import { notify } from 'react-native-notificated';

export default function UploadActivityAssets() {
  /**
   * === STATES ===
   */
  const [activityImage, setActivityImage] = React.useState<{
    uri: string;
    type: string;
  }>();

  const [globalActivity, setGlobalActivity] = useRecoilState(
    ActivityAtoms.globalActivityState
  );

  const { axiosPrivate } = useAxiosPrivate();
  const queryClient = useQueryClient();

  /**
   * === FUNCTIONS ===
   */

  /**
   * UPLOAD ACTIVITY IMAGES
   */
  const {
    mutateAsync: uploadActivityImageMutateAsync,
    isPending: isUploadingActivityImage,
  } = useMutation({
    mutationFn: async (activityImagePayload: FormData) => {
      return await axiosPrivate({
        method: 'POST',
        url: `/admin/activities/${globalActivity?.id}/image`,
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
        data: activityImagePayload,
      });
    },

    onSuccess: async (response) => {
      notify('success', {
        params: {
          title: 'WOW',
          description: response?.data?.message,
        },
      });
      queryClient.invalidateQueries({ queryKey: ['activities'] });

      setActivityImage({
        type: '',
        uri: '',
      });

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

  /**
   * ACTIVITY IMAGES UPLOAD
   */
  const activityImageSelector = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setActivityImage({
        type: result?.assets[0]?.mimeType as string,
        uri: result?.assets[0]?.uri as string,
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View className='flex flex-row items-center gap-4'>
        <Button
          onPress={() => router.replace(`(mindfulness)/${globalActivity.id}`)}
          variant='ghost'
          size='icon'
        >
          <Image source={icons.back} resizeMode='contain' />
        </Button>

        <Label className='text-2xl font-intersemibold'>Edit Activity</Label>
      </View>

      <ScrollView className='mt-5 px-2  pb-12'>
        <View>
          <View className='mt-5'>
            <Label className='text-lg'>Activity Assets [Images]</Label>

            <Button
              onPress={() => activityImageSelector()}
              variant='default'
              size='default'
              className='h-[6rem]'
            >
              <Label className='text-primary-foreground'>
                Upload Activity Images
              </Label>
            </Button>

            <View className='flex flex-row flex-wrap  gap-2 p-1'>
              {activityImage?.uri && (
                <Image
                  source={{ uri: activityImage?.uri }}
                  style={{ width: '100%', height: 200 }}
                  resizeMode='cover'
                  className='rounded-md'
                />
              )}
            </View>
          </View>

          <Button
            onPress={async () => {
              const imageFormData = new FormData();

              imageFormData?.append('image', {
                type: activityImage?.type,
                uri: activityImage?.uri,
                name: 'image,' + activityImage?.type,
              } as any);

              await uploadActivityImageMutateAsync(imageFormData);
            }}
            size='lg'
            variant='default'
            className='rounded-full mt-3 h-[51px]'
          >
            {isUploadingActivityImage ? (
              <ActivityIndicator
                className='text-primary-foreground'
                title='uploading...'
              />
            ) : (
              <Text className='text-primary-foreground'>Upload Image</Text>
            )}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
