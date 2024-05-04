import { View, Text, SafeAreaView, FlatList } from 'react-native';
import React from 'react';
import Label from '@/components/ui/label';
import { EmptyState } from '@/components/partials/empty-state';
import { Search } from '@/components/partials/search';
import icons from '@/constants/icons';
import Activity from '@/components/partials/admin/activity';
import { remapProps } from 'nativewind';
import images from '@/constants/images';

export default function Mindfulness() {
  /**
   * === STATES ===
   */
  const data = [
    { id: 0, thumbnail: icons.add, title: 'add activity' },
    {
      id: 1,
      thumbnail: images.breathing_exercise,
      title: 'breathing exercise',
    },
    {
      id: 2,
      thumbnail: images.positive_affirmations,
      title: 'positive affirmations',
    },
    {
      id: 3,
      thumbnail: images.yoga,
      title: 'yoga',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({ item }) => <Activity item={item} />}
        numColumns={2}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        columnWrapperStyle={{ gap: 10 }}
        ListHeaderComponent={() => (
          <View className='my-6 px-4 space-y-6'>
            <View className='flex justify-between items-start flex-row mb-6'>
              <View>
                <Label className='text-4xl font-extrabold tracking-wider'>
                  Mindfulness
                </Label>
              </View>

              <View className='mt-1.5 '></View>
            </View>

            <Search />
          </View>
        )}
        ListEmptyComponent={() => <EmptyState title='NO ACTIVITIES FOUND' />}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
      />
    </SafeAreaView>
  );
}
