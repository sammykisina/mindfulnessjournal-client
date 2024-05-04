import React from 'react';
import { User } from '@/types/shared/auth';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';

export default function Account({ account }: { account: User }) {
  return (
    <Link href={`/(settings)/${account?.id}`} asChild>
      <Pressable className='bg-primary p-2 px-4 flex flex-col gap-2 h-fit shadow-md'>
        <CardHeader>
          <CardTitle className='text-primary-foreground'>
            {account?.name}
          </CardTitle>

          <CardDescription className='text-primary-foreground italic'>
            {account?.email}
          </CardDescription>
        </CardHeader>
      </Pressable>
    </Link>
  );
}
