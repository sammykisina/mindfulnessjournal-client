import { View, Text, ScrollView, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { router, Stack } from 'expo-router';
import Label from '@/components/ui/label';
import Button from '@/components/ui/button';
import icons from '@/constants/icons';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { notify } from 'react-native-notificated';
import { Input } from '@/components/ui/input';

/**
 * SCHEMA
 */
export const activitySchema = z.object({
  title: z.string(),
});

/**
 * TYPES
 */
type ActivityPayload = {
  title: string;
  content: any;
  thumbnail: string;
};

export default function CreateActivity() {
  /**
   * === STATES ===
   */

  const {
    control,
    handleSubmit,
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
    console.log('values', values);

    // await loginMutateAsync({
    //   password: values?.password,
    //   email: values?.email,
    // });
  };

  /**
   * LOGIN USERS
   */
  const {
    mutateAsync: createActivityMutateAsync,
    isPending: isCreatingActivity,
  } = useMutation({
    mutationFn: async (activityPayload: ActivityPayload) => {
      // return (await axiosPublic.post('/auth/login', loginData)).data;
    },

    onSuccess: async (response) => {
      console.log('respose', response);

      // notify('success', {
      //   params: {
      //     title: '',
      //     description: response.message,
      //   },
      // });
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
          onPress={() => router.replace('(mindfulness)')}
          variant='ghost'
          size='icon'
        >
          <Image source={icons.back} resizeMode='contain' />
        </Button>
        <Label className='text-2xl font-intersemibold'>Add Activity</Label>
      </View>

      <ScrollView className='mt-5 p-2'>
        <View className=''>
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
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
