import { View, Image, useWindowDimensions } from 'react-native';
import React from 'react';
import useDailyQuote from '@/queries/user/use-daily-quote';
import { SafeAreaView } from 'react-native-safe-area-context';
import Label from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import images from '@/constants/images';
import { ActivityIndicator } from '@/components/partials/activity-indicator';
import { Search } from '@/components/partials/search';
import { useDebounce } from '@/hooks/shared/use-debounce';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Recommended from '@/components/partials/user/jounaling/recommended';
import Newest from '@/components/partials/user/jounaling/newest';
import { useRecoilState, useSetRecoilState } from 'recoil';
import SearchAtoms from '@/atoms/user/search';

const Tab = createMaterialTopTabNavigator();

export default function Mindfulness() {
  /**
   * === STATE ===
   */
  const [quote, setQuote] = React.useState('');
  const [searchKey, setSearchKey] = React.useState('');

  const setGlobalSearchKey = useSetRecoilState(SearchAtoms.searchKeyState);
  const value = useDebounce(searchKey, 1000);

  const { dailyQuote, isFetchingDailyQuote } = useDailyQuote();
  const { width } = useWindowDimensions();

  /**
   * === FUNCTIONS ===
   */
  React.useEffect(() => {
    if (dailyQuote) {
      setQuote(dailyQuote);
    }
  }, [dailyQuote]);

  React.useEffect(() => {
    setGlobalSearchKey(value);
  }, [value]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View className='mt-2 px-2 flex flex-col gap-2'>
        <Label className='text-4xl font-extrabold tracking-wider'>
          Mindfulness
        </Label>

        <Card className='bg-primary flex flex-row'>
          <CardHeader className='flex flex-col gap-2 flex-1'>
            <CardTitle className='text-xl text-primary-foreground tracking-wide'>
              Daily Gratitude
            </CardTitle>

            <CardContent>
              {isFetchingDailyQuote ? (
                <ActivityIndicator
                  title=''
                  className='text-primary-foreground'
                />
              ) : (
                <Label className='text-lg text-primary-foreground/80'>
                  {quote}
                </Label>
              )}
            </CardContent>
          </CardHeader>

          <CardContent>
            <Image
              source={images.daily_gratitude}
              resizeMode='contain'
              className='w-[120px] h-[120px]'
            />
          </CardContent>
        </Card>

        <Search
          searchKey={searchKey}
          setSearchKey={setSearchKey}
          isFetchingUsers={false}
        />
      </View>

      <React.Fragment>
        <Tab.Navigator
          screenOptions={{
            tabBarShowLabel: true,
            tabBarItemStyle: {
              width: width / 2,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            },
            tabBarIndicatorStyle: {
              borderWidth: 1,
              borderColor: '#0048B4',
            },
          }}
        >
          <Tab.Screen name='Recommended' component={Recommended} />
          <Tab.Screen name='Newest' component={Newest} />
        </Tab.Navigator>
      </React.Fragment>
    </SafeAreaView>
  );
}
