import { View, Text, Pressable, Dimensions } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import images from '@/constants/images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-provider';
import Button from '@/components/ui/button';
import { Link, router } from 'expo-router';
import Label from '@/components/ui/label';
import icons from '@/constants/icons';
import { deleteAllFromLocalStorage } from '@/lib/storage';
import Avatar from '@/components/partials/shared/avatar';
import useUsers from '@/queries/admin/use-users';
import { LineChart } from 'react-native-chart-kit';
import useWeeklyMoods from '@/queries/user/use-weekly-mood';
import { ActivityIndicator } from '@/components/partials/activity-indicator';

export default function Home() {
  /**
   * === STATES ===
   */
  const { auth } = useAuth();
  const { users, isFetchingUsers } = useUsers({
    url: `/admin/users?filter[id]=${auth?.user?.id}`,
  });
  const { weeklyMoods, isFetchingWeeklyMoods } = useWeeklyMoods();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View className=' flex flex-col gap-2 items-center p-2'>
        <View className='flex flex-row justify-between w-full items-center'>
          <Image
            className='h-[5rem]'
            source={images.sureiDark}
            resizeMode='contain'
          />

          <Link asChild href='/(user)/account'>
            <Pressable>
              <Image
                className='h-[3rem]'
                source={icons.setting}
                resizeMode='contain'
              />
            </Pressable>
          </Link>
        </View>

        <View className='flex flex-col gap-y-2 w-full'>
          <Card className=' bg-gray-200 h-[20rem] shadow-sm rounded-xl w-full items-center flex justify-center gap-3 '>
            <Avatar profile_pic={users?.[0]?.profile_pic} />

            <CardTitle>Hello, {auth?.user?.name}</CardTitle>
          </Card>

          <CardTitle>Your mood this week</CardTitle>

          {isFetchingWeeklyMoods ? (
            <View
              style={{
                width: Dimensions.get('window').width - 12,
                height: 220,
              }}
              className='flex justify-center items-center'
            >
              <ActivityIndicator title='' />
            </View>
          ) : weeklyMoods?.length > 0 ? (
            <LineChart
              withHorizontalLabels={false}
              data={{
                labels: weeklyMoods?.map((weeklyMood) => weeklyMood?.day_name),
                datasets: [
                  {
                    data: weeklyMoods?.map((weeklyMood) => weeklyMood?.count),
                  },
                ],
              }}
              renderDotContent={({ x, y, index }) => {
                return (
                  <View
                    key={index}
                    style={{
                      height: 24,
                      width: 24,
                      // backgroundColor: '#abc',
                      position: 'absolute',
                      top: y - 36, // <--- relevant to height / width (
                      left: x - 12, // <--- width / 2
                    }}
                  >
                    <Image
                      source={
                        icons.feelings?.find(
                          (emoji) => emoji?.name == weeklyMoods?.[index]?.emoji
                        )?.icon
                      }
                      resizeMode='contain'
                      // tintColor={color}
                      className='w-7 h-7'
                    />
                  </View>
                );
              }}
              width={Dimensions.get('window').width - 12} // from react-native
              height={220}
              yAxisLabel=''
              yAxisSuffix=''
              // yAxisInterval={10} // optional, defaults to 1
              chartConfig={{
                backgroundColor: '#0048B4',
                backgroundGradientFrom: '#0048B4',
                backgroundGradientTo: '#0048B4',
                // decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ffa726',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          ) : (
            <Card className='p-5 border border-input'>
              <Label className='text-lg '>NO DATA FOUND</Label>
            </Card>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
