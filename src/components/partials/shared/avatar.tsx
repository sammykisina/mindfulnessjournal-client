import { Image, Pressable } from 'react-native';
import React from 'react';
import images from '@/constants/images';
import useAxiosPrivate from '@/hooks/shared/use-axios-private';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notify } from 'react-native-notificated';
import { AxiosError } from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/context/auth-provider';
import icons from '@/constants/icons';
import Button from '@/components/ui/button';
import { ActivityIndicator } from '../activity-indicator';

export default function Avatar({ profile_pic }: { profile_pic: string }) {
  /**
   * === STATES ===
   */
  const { axiosPrivate } = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { auth } = useAuth();

  console.log('profile_pic', profile_pic);

  const [avatar, setAvatar] = React.useState<{
    uri: string;
    type: string;
  }>();

  /**
   * === FUNCTIONS ===
   */

  /**
   * ON VALUES SUBMIT
   */
  const onSubmit = async () => {
    const formData = new FormData();

    formData.append('avatar', {
      type: avatar?.type,
      uri: avatar?.uri,
      name: 'avatar,' + avatar?.type,
    });

    await uploadAvatarMutateAsync(formData);
  };

  /**
   * CREATE ACTIVITY
   */
  const { mutateAsync: uploadAvatarMutateAsync, isPending: isUploadingAvatar } =
    useMutation({
      mutationFn: async (avatarPayload: FormData) => {
        return await axiosPrivate({
          method: 'POST',
          url: `/auth/${auth?.user?.id}/profile/upload`,
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
          data: avatarPayload,
        });
      },

      onSuccess: async (response) => {
        notify('success', {
          params: {
            title: 'WOW',
            description: response?.data?.message,
          },
        });

        queryClient.invalidateQueries({ queryKey: ['users'] });

        setAvatar({
          type: '',
          uri: '',
        });
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
   * AVATAR IMAGE SELECTOR
   */
  const avatarImageSelector = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar({
        type: result?.assets[0]?.mimeType as string,
        uri: result?.assets[0]?.uri as string,
      });
    }
  };

  return (
    <Pressable
      className='flex justify-center items-center gap-2'
      onPress={() => avatarImageSelector()}
    >
      <Image
        className='h-[10rem] w-[10rem] rounded-md'
        source={
          avatar?.uri
            ? { uri: avatar?.uri }
            : profile_pic
            ? { uri: profile_pic }
            : images.avatar
        }
        resizeMode='cover'
      />

      {avatar?.uri && (
        <Button onPress={onSubmit} variant='outline' size='icon'>
          {isUploadingAvatar ? (
            <ActivityIndicator title='' />
          ) : (
            <Image
              className='h-[24px] w-[24px]'
              source={icons.upload}
              resizeMode='contain'
            />
          )}
        </Button>
      )}
    </Pressable>
  );
}
