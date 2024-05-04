import {
  View,
  ActivityIndicator as RNActivityIndicator,
  ActivityIndicatorProps,
} from 'react-native';
import React from 'react';
import Label from '../ui/label';
import { cn } from '@/lib/utils';

/**
 * TYPES
 */
type ActivityIndicatorPropsTypes = ActivityIndicatorProps & {
  title: string;
};

export const ActivityIndicator: React.FC<ActivityIndicatorPropsTypes> = ({
  title,
  className,
}) => {
  return (
    <View className='flex flex-row gap-2 items-center'>
      <RNActivityIndicator className={cn('text-primary', className)} />
      <Label className={cn(className)}>{title}</Label>
    </View>
  );
};
