import useAxiosPrivate from '@/hooks/shared/use-axios-private';
import { useQuery } from '@tanstack/react-query';

const useDailyQuote = () => {
  const { axiosPrivate } = useAxiosPrivate();

  const getDailyQuote = async () =>
    await axiosPrivate.get(`/user/journals/daily-quote`);

  const { data, isLoading: isFetchingDailyQuote } = useQuery({
    queryKey: ['today-journal'],
    queryFn: async () => {
      return (await getDailyQuote()).data;
    },
  });

  return {
    dailyQuote: data?.quote as string,
    isFetchingDailyQuote,
  };
};

export default useDailyQuote;
