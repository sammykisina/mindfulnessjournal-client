import { View, Text, Image, Alert } from 'react-native';
import React from 'react';
import { TextInput } from 'react-native';
import { cn } from '@/lib/utils';
import Button from '../ui/button';
import { router, usePathname } from 'expo-router';
import icons from '@/constants/icons';
import { ActivityIndicator } from './activity-indicator';

type SearchProps = {
  setSearchKey: React.Dispatch<React.SetStateAction<string>>;
  searchKey: string;
  isFetchingUsers: boolean;
};

export const Search: React.FC<SearchProps> = ({
  searchKey,
  setSearchKey,
  isFetchingUsers,
}) => {
  /**
   * === STATES ===
   */

  return (
    <View
      className={cn(
        'space-y-2 w-full h-16 px-4 bg-gray-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4'
      )}
    >
      <TextInput
        className='flex-1 text-lg mt-0.5 font-interregular'
        value={searchKey}
        placeholder='Search'
        onChangeText={(event) => setSearchKey(event)}
      />

      {isFetchingUsers ? (
        <ActivityIndicator title='' />
      ) : (
        <Image
          source={icons.search}
          className='w-10 h-10'
          resizeMode='contain'
        />
      )}
    </View>
  );
};
