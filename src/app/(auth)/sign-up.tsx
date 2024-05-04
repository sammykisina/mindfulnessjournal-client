import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Label from '@/components/ui/label';
import { Link, router } from 'expo-router';
import { cn } from '@/lib/utils';
import Button, { buttonVariants } from '@/components/ui/button';
import { ActivityIndicator } from '@/components/partials/activity-indicator';
import { storeToLocalStorage } from '@/lib/storage';
import { notify } from 'react-native-notificated';
import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { Image } from 'react-native';
import images from '@/constants/images';
import { TouchableOpacity } from 'react-native';
import useAxiosPublic from '@/hooks/shared/use-axios-public';
import STORAGE from '@/constants/storage';

/**
 * SCHEMA
 */
export const signupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

/**
 * TYPES
 */
type SignupData = {
  name: string;
  email: string;
  password: string;
};

export default function Signup() {
  /**
   * === STATES ===
   */
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const { axiosPublic } = useAxiosPublic();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  /**
   * === FUNCTIONS ===
   */

  /**
   * ON VALUES SUBMIT
   */
  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    console.log('values', values);

    await signupMutateAsync({
      password: values?.password,
      email: values?.email,
      name: values?.name,
    });
  };

  /**
   * SIGN UP USERS
   */
  const { mutateAsync: signupMutateAsync, isPending: isSigningIn } =
    useMutation({
      mutationFn: async (signupData: SignupData) => {
        return (await axiosPublic.post('/auth/register', signupData)).data;
      },

      onSuccess: async (response) => {
        notify('success', {
          params: {
            title: '',
            description: response.message,
          },
        });

        await storeToLocalStorage(STORAGE.userAuth, response);

        console.log('response?.user?.user_type', response?.user);

        if (response?.user?.user_type === 'admin') {
          return router.push('/(admin)/home');
        }

        if (response?.user?.user_type === 'user') {
          return router.push('/(user)/home');
        }
      },

      onError: async (error: AxiosError<any, any>) => {
        console.log('AxiosError', error);

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
            source={images.logoDark}
            className='h-[15rem]'
            resizeMode='contain'
          />

          <Text className='text-semibold text-center text-3xl  mt-2 font-interbold'>
            Sign Up
          </Text>

          <View className='flex flex-col gap-3'>
            <View className='flex flex-col gap-2'>
              <View className='flex flex-col gap-2'>
                <Label className='text-lg'>Name</Label>

                <Input
                  control={control}
                  name='name'
                  error={errors?.name?.message}
                  placeholder='eg. mind fullness'
                  className='bg-gray-100'
                />

                {errors?.name?.message && (
                  <Label className='text-sm font-medium text-destructive'>
                    {errors?.name?.message}
                  </Label>
                )}
              </View>

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

            <Button
              onPress={handleSubmit(onSubmit)}
              size='lg'
              variant='default'
              className='rounded-full mt-3 h-[51px]'
            >
              {isSigningIn ? (
                <ActivityIndicator
                  className='text-primary-foreground'
                  title='signing up...'
                />
              ) : (
                <Text className='text-primary-foreground'>Sign Up</Text>
              )}
            </Button>
          </View>

          <View className='flex justify-center pt-5 flex-row gap-2 items-center'>
            <Text className='text-lg text-gray-900'>
              Already have an account?
            </Text>
            <Link
              className='text-lg font-intersemibold text-primary'
              href='/login'
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
