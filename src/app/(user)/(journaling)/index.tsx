import { View, Text, ScrollView, Pressable } from 'react-native';
import React from 'react';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPublic from '@/hooks/shared/use-axios-public';
import { notify } from 'react-native-notificated';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import Label from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import icons from '@/constants/icons';
import Button from '@/components/ui/button';
import { Image } from 'react-native';
import { cn } from '@/lib/utils';
import { ActivityIndicator } from '@/components/partials/activity-indicator';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import useTodayJournal from '@/queries/user/use-today-journal';
import { Loading } from '@/components/partials/loading';
import useAxiosPrivate from '@/hooks/shared/use-axios-private';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * SCHEMA
 */
export const journalSchema = z.object({
  feeling: z.string(),
});

/**
 * TYPES
 */
type JournalPayload = {
  feeling?: string;
  emoji?: string;
  date?: string;
};

export default function Journaling() {
  /**
   * === STATES ===
   */
  const [selectedEmoji, setSelectedEmoji] = React.useState('');
  const [date, setDate] = React.useState(new Date());

  const { axiosPrivate } = useAxiosPrivate();
  const queryClient = useQueryClient();

  const { isFetchingTodayJournal, todayJournal } = useTodayJournal();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof journalSchema>>({
    resolver: zodResolver(journalSchema),
  });

  /**
   * === FUNCTIONS ===
   */

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  /**
   * ON VALUES SUBMIT
   */
  const onSubmit = async (values: z.infer<typeof journalSchema>) => {
    if (selectedEmoji === '') {
      notify('error', {
        params: {
          title: '',
          description: 'Please the emoji that describes your feeling',
        },
      });

      return;
    }

    await createJournalMutateAsync({
      date: date?.toLocaleString(),
      emoji: selectedEmoji,
      feeling: values?.feeling,
    });
  };

  /**
   * CREATE JOURNAL
   */
  const {
    mutateAsync: createJournalMutateAsync,
    isPending: isCreatingJournal,
  } = useMutation({
    mutationFn: async (journalPayload: JournalPayload) => {
      return (await axiosPrivate.post('/user/journals', journalPayload)).data;
    },

    onSuccess: async (response) => {
      notify('success', {
        params: {
          title: 'WOW',
          description: response?.data?.message,
        },
      });

      queryClient.invalidateQueries({ queryKey: ['today-journal'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-mood'] });

      reset({
        feeling: '',
      });

      setSelectedEmoji('');
    },

    onError: async (error: AxiosError<any, any>) => {
      return notify('error', {
        params: {
          title: 'Opps',
          description: error.response?.data?.message,
        },
      });
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View className='flex flex-row items-center gap-4 px-2'>
        <Label className='text-4xl font-intersemibold'>Journaling</Label>
      </View>

      <ScrollView className='mt-5 px-2 pb-12'>
        <View className='flex flex-col gap-4'>
          <View className='flex flex-col gap-2'>
            <Label className='text-lg'>What do you have on your mind?</Label>

            <Input
              control={control}
              name='feeling'
              error={errors?.feeling?.message}
              placeholder='Enter what your feeling today'
              className='bg-gray-100'
              multiline
            />

            {errors?.feeling?.message && (
              <Label className='text-sm font-medium text-destructive'>
                {errors?.feeling?.message}
              </Label>
            )}
          </View>

          <View className='flex flex-col gap-2'>
            <View className='flex flex-row gap-3 items-center'>
              <Label className='text-lg'>How do you feel today?</Label>

              <Image
                source={
                  icons?.feelings?.find(
                    (feeling) => feeling?.name === selectedEmoji
                  )?.icon
                }
                resizeMode='contain'
                className='w-10 h-10'
              />
            </View>

            <View className='flex flex-row justify-center items-center gap-5'>
              {icons.feelings?.map((feeling, index) => (
                <Button
                  key={index}
                  onPress={() => setSelectedEmoji(feeling?.name)}
                  variant='ghost'
                  size='icon'
                >
                  <Image
                    source={feeling?.icon}
                    resizeMode='contain'
                    className='w-10 h-10'
                  />
                </Button>
              ))}
            </View>
          </View>

          <View className='flex justify-center items-center gap-2'>
            <Label className='text-lg'>Date / Time</Label>
            <Label>{date?.toLocaleString()}</Label>
          </View>

          <Button variant='outline' size='lg' onPress={showDatepicker}>
            <Label className='text-lg'>Journal Date</Label>
          </Button>

          <Button
            onPress={handleSubmit(onSubmit)}
            variant='default'
            size='default'
            className='h-[3rem] rounded-md'
          >
            {isCreatingJournal ? (
              <ActivityIndicator
                className='text-primary-foreground'
                title='creating...'
              />
            ) : (
              <Label className='text-primary-foreground'>Save</Label>
            )}
          </Button>
        </View>

        <View className='mt-5'>
          <Label className='text-lg'>Recently,</Label>

          <View className='flex justify-center items-center mt-6'>
            {isFetchingTodayJournal ? (
              <Loading title='' />
            ) : todayJournal ? (
              <Link asChild href={`(journaling)/${todayJournal?.id}`}>
                <Pressable>
                  <Card className='bg-gray-100 w-full'>
                    <CardHeader className='items-center'>
                      <CardTitle>{todayJournal?.date}</CardTitle>
                    </CardHeader>

                    <CardContent className='w-full'>
                      <Label className='first-letter:uppercase text-lg tracking-wide'>
                        {todayJournal?.feeling}
                      </Label>
                    </CardContent>
                  </Card>
                </Pressable>
              </Link>
            ) : (
              <View>
                <Label className='text-lg font-interbold'>
                  No recent journal found
                </Label>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
