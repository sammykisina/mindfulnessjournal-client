import { View } from 'react-native';
import React from 'react';
import { Image } from 'react-native';
import { cn } from '@/lib/utils';
import Label from '../ui/label';
import images from '@/constants/images';
import { usePathname } from 'expo-router';
import { useAuth } from '@/context/auth-provider';
import Button from '../ui/button';

type EmptyStateProps = React.ComponentPropsWithoutRef<typeof View> & {
  title: string;
};

export const EmptyState: React.FC<EmptyStateProps> = ({ className, title }) => {
  /**
   * === STATES ===
   */
  const pathname = usePathname();
  const { auth } = useAuth();

  return (
    <View
      className={cn(
        'flex flex-1 justify-center  h-[20rem] items-center px-4',
        className
      )}
    >
      <Image
        source={images.empty}
        className='w-[50px] h-[50px]'
        resizeMode='contain'
        tintColor='#0048B4'
      />

      <Label className='text-2xl text-center font-outfitsemibold text-primary mt-2'>
        {title}
      </Label>

      <View className='mt-4'>
        {pathname === '/mindfulness' && auth?.user?.user_type === 'admin' ? (
          <Button className='rounded-md' variant='outline' size='default'>
            <Label className='text-accent-foreground text-lg font-bold'>
              Create Activity
            </Label>
          </Button>
        ) : null}
      </View>
    </View>
  );
};
