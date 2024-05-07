import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { EmptyState } from '../../empty-state';
import useActivities from '@/queries/admin/use-activities';
import Activity from './activity';
import { useRecoilValue } from 'recoil';
import SearchAtoms from '@/atoms/user/search';
import { View } from 'react-native';
import { ActivityIndicator } from '../../activity-indicator';

const Newest = () => {
  /**
   * === STATES ===
   */
  const searchKey = useRecoilValue(SearchAtoms.searchKeyState);
  const { activities, isFetchingActivities } = useActivities({ q: searchKey });

  return isFetchingActivities ? (
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
      ListEmptyComponent={() => <EmptyState title='NO ACTIVITIES FOUND' />}
    />
  );
};

export default Newest;
