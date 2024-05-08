import { View, Text, ScrollView, Image } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import Label from '@/components/ui/label';
import Button from '@/components/ui/button';
import icons from '@/constants/icons';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { notify } from 'react-native-notificated';
import { Input } from '@/components/ui/input';
import * as ImagePicker from 'expo-image-picker';
import useAxiosPrivate from '@/hooks/shared/use-axios-private';
import { ActivityIndicator } from '@/components/partials/activity-indicator';

/**
 * SCHEMA
 */
export const activitySchema = z.object({
  title: z.string(),
  content: z.string(),
});

export default function CreateActivity() {
  /**
   * === STATES ===
   */
  const { axiosPrivate } = useAxiosPrivate();
  const queryClient = useQueryClient();

  const [thumbnail, setThumbnail] = React.useState<{
    uri: string;
    type: string;
  }>();

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
   * ON VALUES SUBMIT
   */
  const onSubmit = async (values: z.infer<typeof activitySchema>) => {
    const formData = new FormData();
    formData.append('content', values?.content);
    formData.append('title', values?.title);

    formData.append('thumbnail', {
      type: thumbnail?.type,
      uri: thumbnail?.uri,
      name: 'thumbnail,' + thumbnail?.type,
    });

    await createActivityMutateAsync(formData);
  };

  /**
   * CREATE ACTIVITY
   */
  const {
    mutateAsync: createActivityMutateAsync,
    isPending: isCreatingActivity,
  } = useMutation({
    mutationFn: async (activityPayload: FormData) => {
      return await axiosPrivate({
        method: 'POST',
        url: '/admin/activities',
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
        data: activityPayload,
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

      reset({
        content: '',
        title: '',
      });

      setThumbnail({
        type: '',
        uri: '',
      });

      router.replace('/(mindfulness)');
    },

    onError: async (error: AxiosError<any, any>) => {
      console.log('error here', error);

      return notify('error', {
        params: {
          title: 'Opps',
          description: error.response?.data?.message,
        },
      });
    },
  });

  /**
   * THUMBNAIL IMAGE SELECTOR
   */
  const thumbnailImageSelector = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setThumbnail({
        type: result?.assets[0]?.mimeType as string,
        uri: result?.assets[0]?.uri as string,
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View className='flex flex-row items-center gap-4'>
        <Button
          onPress={() => router.replace('(mindfulness)')}
          variant='ghost'
          size='icon'
        >
          <Image source={icons.back} resizeMode='contain' />
        </Button>
        <Label className='text-2xl font-intersemibold'>Add Activity</Label>
      </View>

      <ScrollView className='mt-5 px-2 pb-12'>
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
              <Label className='text-lg'>Thumbnail</Label>

              <Button
                onPress={() => thumbnailImageSelector()}
                variant='default'
                size='default'
                className='h-[6rem]'
              >
                <Label className='text-primary-foreground'>Upload</Label>
              </Button>

              {thumbnail?.uri && (
                <Image
                  source={{ uri: thumbnail.uri }}
                  style={{ width: '100%', height: 200 }}
                  resizeMode='cover'
                />
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
            {isCreatingActivity ? (
              <ActivityIndicator
                className='text-primary-foreground'
                title='creating...'
              />
            ) : (
              <Text className='text-primary-foreground'>Create Activity</Text>
            )}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
