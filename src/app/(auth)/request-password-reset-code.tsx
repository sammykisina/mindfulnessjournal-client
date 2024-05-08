import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import Label from '@/components/ui/label';
import { Image } from 'react-native';
import images from '@/constants/images';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import useAxiosPublic from '@/hooks/shared/use-axios-public';
import { notify } from 'react-native-notificated';
import { Link, router } from 'expo-router';
import { AxiosError } from 'axios';
import { cn } from '@/lib/utils';
import Button, { buttonVariants } from '@/components/ui/button';
import { ActivityIndicator } from '@/components/partials/activity-indicator';

/**
 * SCHEMA
 */
export const requestResetPasswordCodeSchema = z.object({
  email: z.string().email(),
});

/**
 * TYPES
 */
type RequestPasswordResetCodePayload = {
  email: string;
};

export default function RequestPasswordResetCode() {
  /**
   * === STATES ===
   */
  const { axiosPublic } = useAxiosPublic();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof requestResetPasswordCodeSchema>>({
    resolver: zodResolver(requestResetPasswordCodeSchema),
  });

  /**
   * === FUNCTIONS ===
   */

  /**
   * ON VALUES SUBMIT
   */
  const onSubmit = async (
    values: z.infer<typeof requestResetPasswordCodeSchema>
  ) => {
    console.log('values', values);

    await requestResetPasswordCodeMutateAsync({
      email: values?.email,
    });
  };

  /**
   * LOGIN USERS
   */
  const {
    mutateAsync: requestResetPasswordCodeMutateAsync,
    isPending: isSendingCode,
  } = useMutation({
    mutationFn: async (
      requestPasswordResetCode: RequestPasswordResetCodePayload
    ) => {
      return (
        await axiosPublic.post(
          '/auth/send-reset-code',
          requestPasswordResetCode
        )
      ).data;
    },

    onSuccess: async (response) => {
      notify('success', {
        params: {
          title: '',
          description: response.message,
        },
      });

      router.push('/reset-password');
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
      <ScrollView>
        <View className='w-full justify-center min-h-[85vh] px-4 my-4'>
          <Image
            className='h-[15rem]'
            source={images.logoDark}
            resizeMode='contain'
          />

          <Text className='text-semibold text-center text-3xl  mt-2 font-interbold'>
            Request For Password Reset Code
          </Text>

          <View className='flex flex-col gap-3 mt-5'>
            <View className='flex flex-col gap-2'>
              <View className='flex flex-col gap-2'>
                <Label className='text-lg'>Email</Label>

                <Input
                  control={control}
                  name='email'
                  error={errors?.email?.message}
                  placeholder='eg. mindfullness@gmail.com'
                  className='bg-gray-100'
                />

                {errors?.email?.message && (
                  <Label className='text-sm font-medium text-destructive'>
                    {errors?.email?.message}
                  </Label>
                )}
              </View>
            </View>

            <View className='flex justify-end '>
              <Link
                href={'/login'}
                className={cn(buttonVariants({ variant: 'link' }))}
              >
                Go to Login
              </Link>
            </View>

            <Button
              onPress={handleSubmit(onSubmit)}
              size='lg'
              variant='default'
              className='rounded-full mt-3 h-[51px]'
            >
              {isSendingCode ? (
                <ActivityIndicator
                  className='text-primary-foreground'
                  title='sending...'
                />
              ) : (
                <Text className='text-primary-foreground'>Send Reset Code</Text>
              )}
            </Button>
          </View>

          <View className='flex justify-center pt-5 flex-row gap-2 items-center'>
            <Text className='text-lg text-gray-900'>Have the code?</Text>
            <Link
              className='text-lg font-intersemibold text-primary'
              href='/sign-up'
            >
              Reset Password
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
