import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/shared/use-axios-private';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notify } from 'react-native-notificated';
import { AxiosError } from 'axios';
import { deleteAllFromLocalStorage } from '@/lib/storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/ui/button';
import Label from '@/components/ui/label';
import icons from '@/constants/icons';
import { useAuth } from '@/context/auth-provider';
import useUsers from '@/queries/admin/use-users';
import { Loading } from '@/components/partials/loading';
import images from '@/constants/images';
import { Input } from '@/components/ui/input';
import { ActivityIndicator } from '@/components/partials/activity-indicator';
import Avatar from '@/components/partials/shared/avatar';

/**
 * SCHEMA
 */
export const accountSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
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
type AccountPayload = {
  email?: string;
  password?: string;
  name?: string;
};

export default function Account() {
  /**
   * === STATES ===
   */
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const queryClient = useQueryClient();

  const { axiosPrivate } = useAxiosPrivate();
  const { auth, setAuth, setIsLoggedIn } = useAuth();
  const { users, isFetchingUsers } = useUsers({
    url: `/admin/users?filter[id]=${auth?.user?.id}`,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
  });

  /**
   * === FUNCTION ===
   */

  /**
   * ON VALUES SUBMIT
   */
  const onSubmit = async (values: z.infer<typeof accountSchema>) => {
    await updateAccountMutateAsync({
      password: values?.password,
      email: values?.email,
      name: values?.name,
    });
  };

  /**
   * UPDATE ACCOUNT
   */
  const {
    mutateAsync: updateAccountMutateAsync,
    isPending: isUpdatingAccount,
  } = useMutation({
    mutationFn: async (accountPayload: AccountPayload) => {
      return (
        await axiosPrivate.patch(
          `/auth/${auth?.user?.id}/update`,
          accountPayload
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

      queryClient.invalidateQueries({ queryKey: ['users'] });
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
   * LOGOUT ACCOUNT
   */
  const { mutateAsync: logoutMutateAsync, isPending: isLoggedOut } =
    useMutation({
      mutationFn: async () => {
        return (await axiosPrivate.post(`/auth/logout`)).data;
      },

      onSuccess: async (response) => {
        notify('success', {
          params: {
            title: '',
            description: response.message,
          },
        });

        setIsLoggedIn(false);
        setAuth(null);
        await deleteAllFromLocalStorage();
        router.push('/');
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
   * FILL FORM WITH PREVIOUS DATA
   */
  React.useEffect(() => {
    if (users?.[0]) {
      reset({
        email: users[0]?.email,
        name: users[0]?.name,
      });
    }
  }, [users]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View className='flex flex-row items-center gap-4'>
        <Button onPress={() => router.replace('/')} variant='ghost' size='icon'>
          <Image source={icons.back} resizeMode='contain' />
        </Button>
        <Label className='text-2xl font-intersemibold'>Account</Label>
      </View>

      <ScrollView className='mt-5'>
        {isFetchingUsers ? (
          <Loading title='fetching account data' />
        ) : (
          <View className='flex flex-col justify-center px-4 h-full flex-1'>
            <View className='flex justify-center items-center'>
              <Avatar profile_pic={users?.[0]?.profile_pic} />
            </View>

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

            <View className='flex flex-col gap-4'>
              <Button
                onPress={handleSubmit(onSubmit)}
                size='lg'
                variant='default'
                className='rounded-full mt-3 h-[51px]'
              >
                {isUpdatingAccount ? (
                  <ActivityIndicator
                    className='text-primary-foreground'
                    title='updating...'
                  />
                ) : (
                  <Text className='text-primary-foreground'>Save</Text>
                )}
              </Button>

              <Button
                onPress={() => logoutMutateAsync()}
                size='lg'
                variant='secondary'
                className='rounded-none border mt-4 h-[51px]'
              >
                {isLoggedOut ? (
                  <ActivityIndicator
                    className='text-primary'
                    title='logging out...'
                  />
                ) : (
                  <Label>Log Out</Label>
                )}
              </Button>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
