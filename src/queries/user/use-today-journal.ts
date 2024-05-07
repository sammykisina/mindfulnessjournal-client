import useAxiosPrivate from '@/hooks/shared/use-axios-private';
import { Journal } from '@/types/journal';
import { useQuery } from '@tanstack/react-query';

const useTodayJournal = () => {
  const { axiosPrivate } = useAxiosPrivate();

  const getTodayJournal = async () =>
    await axiosPrivate.get(`/user/journals/today?sort=-created_at`);

  const { data, isLoading: isFetchingTodayJournal } = useQuery({
    queryKey: ['today-journal'],
    queryFn: async () => {
      return (await getTodayJournal()).data;
    },
  });

  return {
    todayJournal: data?.journal as Journal,
    isFetchingTodayJournal,
  };
};

export default useTodayJournal;
