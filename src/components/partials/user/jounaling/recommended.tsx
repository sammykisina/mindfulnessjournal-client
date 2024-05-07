import React from 'react';
import { FlatList } from 'react-native';
import { EmptyState } from '../../empty-state';
import Activity from './activity';
import useActivityRecommendations from '@/queries/user/use-activity-recommendations';
import { useRecoilValue } from 'recoil';
import SearchAtoms from '@/atoms/user/search';
import { ActivityIndicator } from '../../activity-indicator';
import { View } from 'react-native';

export default function Recommended() {
  /**
   * === STATES ===
   */
  const searchKey = useRecoilValue(SearchAtoms.searchKeyState);

  const { activities, isFetchingActivityRecommendations } =
    useActivityRecommendations({ q: searchKey });

  return isFetchingActivityRecommendations ? (
    <View className='flex justify-center items-center h-[20px] mt-6'>
      <ActivityIndicator title='' />
    </View>
  ) : (
    <FlatList
      data={activities ?? []}
      keyExtractor={(item) => item?.id?.toString()}
      renderItem={({ item }) => <Activity item={item} />}
      numColumns={2}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      columnWrapperStyle={{ gap: 10 }}
      ListEmptyComponent={() => (
        <EmptyState title='NO RECOMMENDED ACTIVITIES FOUND' />
      )}
    />
  );
}
