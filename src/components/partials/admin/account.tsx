import React from 'react';
import { User } from '@/types/shared/auth';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';
import Button from '@/components/ui/button';
import Label from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/shared/use-axios-private';
import { notify } from 'react-native-notificated';
import { AxiosError } from 'axios';
import { ActivityIndicator } from '../activity-indicator';
import { cn } from '@/lib/utils';

export default function Account({ account }: { account: User }) {
  const MakeAdmin = () => {
    /**
     * === STATES ===
     */
    const { axiosPrivate } = useAxiosPrivate();
    const queryClient = useQueryClient();

    /**
     * === FUNCTIONS ===
     */

    /**
     * MAKE USER ADMIN
     */
    const { mutateAsync: makeAdminMutateAsync, isPending: isMakingUserAdmin } =
      useMutation({
        mutationFn: async () => {
          return (
            await axiosPrivate.patch(`/admin/users/${account?.id}/make-admin`)
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

    return (
      <Button
        onPress={() => makeAdminMutateAsync()}
        variant='outline'
        size='default'
        className={cn(
          account?.is_super_admin && 'hidden',
          account?.user_type === 'admin' && 'hidden'
        )}
      >
        {isMakingUserAdmin ? (
          <ActivityIndicator title='' />
        ) : (
          <Label>Make Admin</Label>
        )}
      </Button>
    );
  };

  return (
    <Link href={`/(settings)/${account?.id}`} asChild>
      <Pressable className='bg-primary p-2 px-4 flex flex-row justify-between gap-2 h-fit shadow-md items-center'>
        <CardHeader>
          <CardTitle className='text-primary-foreground'>
            {account?.name}
          </CardTitle>

          <CardDescription className='text-primary-foreground italic'>
            {account?.email}
          </CardDescription>
        </CardHeader>

        <MakeAdmin />
      </Pressable>
    </Link>
  );
}
