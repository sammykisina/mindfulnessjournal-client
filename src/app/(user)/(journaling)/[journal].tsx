import { View, Text, Image, Pressable } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Label from '@/components/ui/label';
import { ScrollView } from 'react-native';
import Button from '@/components/ui/button';
import { Link, router } from 'expo-router';
import icons from '@/constants/icons';
import useTodayJournal from '@/queries/user/use-today-journal';
import { Loading } from '@/components/partials/loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Journal() {
  /**
   * === STATES ===
   */
  const { isFetchingTodayJournal, todayJournal } = useTodayJournal();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View className='flex flex-row items-center gap-4 px-2'>
        <Button
          onPress={() => router.replace('(journaling)')}
          variant='ghost'
          size='icon'
        >
          <Image source={icons.back} resizeMode='contain' />
        </Button>

        <Label className='text-4xl font-intersemibold'>Journaling</Label>
      </View>

      <ScrollView className='mt-5 px-2 pb-12'>
        <View className='flex justify-center items-center mt-6'>
          {isFetchingTodayJournal ? (
            <Loading title='' />
          ) : todayJournal ? (
            <View className='w-full flex flex-col gap-2'>
              <Card className='bg-gray-100 w-full rounded-b-none border border-input'>
                <CardHeader className='items-center'>
                  <CardTitle>{todayJournal?.date}</CardTitle>
                </CardHeader>

                <CardContent className='w-full flex flex-col gap-2'>
                  <Label className='first-letter:uppercase text-lg tracking-wide'>
                    {todayJournal?.feeling}
                  </Label>

                  <View className='flex items-center flex-row gap-2 justify-center'>
                    <Label className='text-3xl'>Mood:</Label>
                    <Image
                      source={
                        icons.feelings?.find(
                          (feeling) => feeling?.name === todayJournal?.emoji
                        )?.icon
                      }
                      resizeMode='contain'
                      className='w-[48px] h-[48px]'
                    />
                  </View>
                </CardContent>
              </Card>

              <Card className='bg-gray-100 w-full rounded-t-none border border-input'>
                <CardHeader className='items-center'>
                  <CardTitle>Daily gratitude's</CardTitle>
                </CardHeader>

                <CardContent className='w-full flex flex-col gap-2 px-2 pb-2'>
                  <View className='flex flex-col gap-2'>
                    {todayJournal?.daily_gratitude ? (
                      todayJournal?.daily_gratitude
                        ?.split('>')
                        ?.map((gratitude, index) => (
                          <Label
                            key={index}
                            className='bg-gray-200 flex h-13 w-full rounded-sm border border-input px-3 py-2 text-lg'
                          >
                            {gratitude}
                          </Label>
                        ))
                    ) : (
                      <Pressable
                        className='w-full'
                        onPress={() =>
                          router.push('/(journaling)/create-gratitude')
                        }
                      >
                        <View className='flex flex-col gap-2 w-full'>
                          <Label className='bg-gray-200 flex h-13 w-full rounded-sm border border-input px-3 py-2 text-lg' />
                          <Label className='bg-gray-200 flex h-13 w-full rounded-sm border border-input px-3 py-2 text-lg' />
                          <Label className='bg-gray-200 flex h-13 w-full rounded-sm border border-input px-3 py-2 text-lg' />
                        </View>
                      </Pressable>
                    )}
                  </View>
                </CardContent>
              </Card>
            </View>
          ) : (
            <View>
              <Label className='text-lg font-interbold'>
                No recent journal found
              </Label>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
