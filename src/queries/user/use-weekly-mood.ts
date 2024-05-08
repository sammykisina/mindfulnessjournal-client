import useAxiosPrivate from '@/hooks/shared/use-axios-private';
import { useQuery } from '@tanstack/react-query';

const useWeeklyMoods = () => {
  const { axiosPrivate } = useAxiosPrivate();

  const getWeeklyMoods = async () =>
    await axiosPrivate.get(`/user/journals/weekly-mood`);

  const { data, isLoading: isFetchingWeeklyMoods } = useQuery({
    queryKey: ['weekly-mood'],
    queryFn: async () => {
      return (await getWeeklyMoods()).data;
    },
  });

  return {
    weeklyMoods: data as { emoji: string; count: number; day_name: string }[],
    isFetchingWeeklyMoods,
  };
};

export default useWeeklyMoods;
