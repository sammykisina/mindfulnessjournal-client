import { View, Text, TouchableOpacity } from 'react-native';
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
export const ResetPasswordSchema = z
  .object({
    code: z.string(),
    password: z.string(),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'], // path of error
  });

/**
 * TYPES
 */
type PasswordResetPayload = {
  code: string;
  password: string;
};

export default function PasswordReset() {
  /**
   * === STATES ===
   */
  const { axiosPublic } = useAxiosPublic();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  /**
   * === FUNCTIONS ===
   */

  /**
   * ON VALUES SUBMIT
   */
  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    await resetPasswordMutateAsync({
      code: values?.code,
      password: values?.password,
    });
  };

  /**
   * RESET PASSWORD
   */
  const {
    mutateAsync: resetPasswordMutateAsync,
    isPending: isResettingPassword,
  } = useMutation({
    mutationFn: async (PasswordReset: PasswordResetPayload) => {
      return (await axiosPublic.post('/auth/reset-password', PasswordReset))
        .data;
    },

    onSuccess: async (response) => {
      notify('success', {
        params: {
          title: '',
          description: response.message,
        },
      });

      router.replace('/login');
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
            Password Reset
          </Text>

          <View className='flex flex-col gap-3'>
            <View className='flex flex-col gap-2'>
              <View className='flex flex-col gap-2'>
                <Label className='text-lg'>Rest Code</Label>

                <Input
                  control={control}
                  name='code'
                  error={errors?.code?.message}
                  placeholder='eg. 204201'
                  className='bg-gray-100'
                />

                {errors?.code?.message && (
                  <Label className='text-sm font-medium text-destructive'>
                    {errors?.code?.message}
                  </Label>
                )}
              </View>

              <View className='flex flex-col gap-2'>
                <Label className='text-lg'>Your New Password</Label>

                <View>
                  <Input
                    control={control}
                    name='password'
                    error={errors?.password?.message}
                    placeholder='new password'
                    secureTextEntry={!showPassword}
                    className='bg-gray-100 relative'
                  />

                  <TouchableOpacity
                    onPress={() => setShowPassword((prev) => !prev)}
                    className='absolute top-1/2 right-2 transform -translate-y-1/2 h-10 flex justify-center items-center'
                  >
                    <Label className='text-primary font-interbold'>
                      {showPassword ? 'hide' : 'show'}
                    </Label>
                  </TouchableOpacity>
                </View>

                {errors?.password?.message && (
                  <Label className='text-sm font-intermedium text-destructive'>
                    {errors?.password?.message}
                  </Label>
                )}
              </View>

              <View className='flex flex-col gap-2'>
                <Label className='text-lg'>Retype Password</Label>

                <View>
                  <Input
                    control={control}
                    name='confirm'
                    error={errors?.confirm?.message}
                    placeholder='re-type password'
                    secureTextEntry={!showPassword}
                    className='bg-gray-100 relative'
                  />

                  <TouchableOpacity
                    onPress={() => setShowPassword((prev) => !prev)}
                    className='absolute top-1/2 right-2 transform -translate-y-1/2 h-10 flex justify-center items-center'
                  >
                    <Label className='text-primary font-interbold'>
                      {showPassword ? 'hide' : 'show'}
                    </Label>
                  </TouchableOpacity>
                </View>

                {errors?.confirm?.message && (
                  <Label className='text-sm font-intermedium text-destructive'>
                    {errors?.confirm?.message}
                  </Label>
                )}
              </View>
            </View>

            <View>
              <Link
                href={'/login'}
                className={cn(buttonVariants({ variant: 'link' }))}
              >
                Login
              </Link>
            </View>

            <Button
              onPress={handleSubmit(onSubmit)}
              size='lg'
              variant='default'
              className='rounded-full mt-3 h-[51px]'
            >
              {isResettingPassword ? (
                <ActivityIndicator
                  className='text-primary-foreground'
                  title='resetting...'
                />
              ) : (
                <Text className='text-primary-foreground'>Rest Password </Text>
              )}
            </Button>
          </View>

          <View className='flex justify-center pt-5 flex-row gap-2 items-center'>
            <Text className='text-lg text-gray-900'>Don't have code?</Text>
            <Link
              className='text-lg font-intersemibold text-primary'
              href='/request-password-reset-code'
            >
              Get Code
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
