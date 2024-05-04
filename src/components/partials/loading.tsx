import { View, ActivityIndicator } from 'react-native';
import React from 'react';
import Label from '../ui/label';

type LoadingProps = {
  title?: string;
};

export const Loading: React.FC<LoadingProps> = ({ title }) => {
  return (
    <View className='flex flex-row gap-2 items-center justify-center h-full w-full bg-white flex-1'>
      <View>
        <ActivityIndicator className='text-primary' />
        <Label className='text-2xl tracking-wider'>{title}...</Label>
      </View>
    </View>
  );
};
