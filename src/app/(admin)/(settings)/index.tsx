import { View, Text, SafeAreaView, FlatList } from 'react-native';
import React from 'react';
import useUsers from '@/queries/admin/use-users';
import { Search } from '@/components/partials/search';
import { EmptyState } from '@/components/partials/empty-state';
import { Loading } from '@/components/partials/loading';
import Account from '@/components/partials/admin/account';
import { useDebounce } from '@/hooks/shared/use-debounce';

export default function Settings() {
  /**
   * === STATES ===
   */
  const [searchKey, setSearchKey] = React.useState('');
  const value = useDebounce(searchKey, 1000);

  const { users, isFetchingUsers } = useUsers({
    url: `/admin/users?filter[name]=${value}`,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View className='mt-2 px-2 flex flex-col gap-2'>
        <Text className='text-4xl font-extrabold tracking-wider'>
          Manage Accounts
        </Text>

        <Search
          searchKey={searchKey}
          setSearchKey={setSearchKey}
          isFetchingUsers={isFetchingUsers}
        />
      </View>

      {isFetchingUsers ? (
        <Loading title='fetching accounts' />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item?.id?.toString()}
          renderItem={({ item }) => <Account account={item} />}
          numColumns={1}
          contentContainerStyle={{ gap: 10, padding: 10 }}
          ListEmptyComponent={() => <EmptyState title='NO ACCOUNTS FOUND' />}
        />
      )}
    </SafeAreaView>
  );
}
