import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Label from '@/components/ui/label';
import { Link, Redirect, router } from 'expo-router';
import { cn } from '@/lib/utils';
import Button, { buttonVariants } from '@/components/ui/button';
import { ActivityIndicator } from '@/components/partials/activity-indicator';
import { notify } from 'react-native-notificated';
import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { Image, TouchableOpacity } from 'react-native';
import images from '@/constants/images';
import { storeToLocalStorage } from '@/lib/storage';
import STORAGE from '@/constants/storage';
import useAxiosPublic from '@/hooks/shared/use-axios-public';
import { useAuth } from '@/context/auth-provider';

/**
 * SCHEMA
 */
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

/**
 * TYPES
 */
type LoginData = {
  email: string;
  password: string;
};

export default function Login() {
  /**
   * === STATES ===
   */
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const { axiosPublic } = useAxiosPublic();
  const { isLoadingAuth, isLoggedIn, auth, setAuth, setIsLoggedIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  /**
   * === FUNCTIONS ===
   */

  /**
   * ON VALUES SUBMIT
   */
  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    console.log('values', values);

    await loginMutateAsync({
      password: values?.password,
      email: values?.email,
    });
  };

  /**
   * LOGIN USERS
   */
  const { mutateAsync: loginMutateAsync, isPending: isLoggingIn } = useMutation(
    {
      mutationFn: async (loginData: LoginData) => {
        return (await axiosPublic.post('/auth/login', loginData)).data;
      },

      onSuccess: async (response) => {
        notify('success', {
          params: {
            title: '',
            description: response.message,
          },
        });

        await storeToLocalStorage(STORAGE.userAuth, response);

        setAuth(response);

        setIsLoggedIn(true);

        if (response?.user?.user_type === 'admin') {
          return router.push('/(admin)/home');
        }

        if (response?.user?.user_type === 'user') {
          return router.push('/(user)/home');
        }
      },

      onError: async (error: AxiosError<any, any>) => {
        return notify('error', {
          params: {
            title: 'Opps',
            description: error.response?.data?.message,
          },
        });
      },
    }
  );

  if (!isLoadingAuth && isLoggedIn) {
    if (auth?.user?.user_type === 'admin') {
      return <Redirect href='/(admin)/home' />;
    }

    if (auth?.user?.user_type === 'user') {
      <Redirect href='/(user)/home' />;
    }
  }

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
            Log In
          </Text>

          <View className='flex flex-col gap-3'>
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

              <View className='flex flex-col gap-2'>
                <Label className='text-lg'>Your Password</Label>

                <View>
                  <Input
                    control={control}
                    name='password'
                    error={errors?.password?.message}
                    placeholder='password'
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
            </View>

            <View>
              <Link
                href={'/request-password-reset-code'}
                className={cn(buttonVariants({ variant: 'link' }))}
              >
                Forgot Password?
              </Link>
            </View>

            <Button
              onPress={handleSubmit(onSubmit)}
              size='lg'
              variant='default'
              className='rounded-full mt-3 h-[51px]'
            >
              {isLoggingIn ? (
                <ActivityIndicator
                  className='text-primary-foreground'
                  title='logging...'
                />
              ) : (
                <Text className='text-primary-foreground'>Log in</Text>
              )}
            </Button>
          </View>

          <View className='flex justify-center pt-5 flex-row gap-2 items-center'>
            <Text className='text-lg text-gray-900'>Don't have account?</Text>
            <Link
              className='text-lg font-intersemibold text-primary'
              href='/sign-up'
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
