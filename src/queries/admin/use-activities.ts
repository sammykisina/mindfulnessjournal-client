import useAxiosPrivate from '@/hooks/shared/use-axios-private';
import { Activity } from '@/types/activity';
import { useQuery } from '@tanstack/react-query';

const useActivities = ({
  q,
}: {
  q?: number | string;
} = {}) => {
  const { axiosPrivate } = useAxiosPrivate();

  const getActivities = async (q?: string | number) =>
    await axiosPrivate.get(
      `/admin/activities?${q ? `filter[title]=${q}` : ''}`
    );

  const { data, isLoading: isFetchingActivities } = useQuery({
    queryKey: ['activities', q],
    queryFn: async ({ queryKey }) => {
      return (await getActivities(queryKey[1])).data;
    },
  });

  return {
    activities: data?.activities as Activity[],
    isFetchingActivities,
  };
};

export default useActivities;
