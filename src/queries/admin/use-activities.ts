import useAxiosPrivate from '@/hooks/shared/use-axios-private';
import { Activity } from '@/types/activity';
import { useQuery } from '@tanstack/react-query';

const useActivities = ({
  q,
  url,
}: {
  q?: number | string;
  url?: number | string;
} = {}) => {
  const { axiosPrivate } = useAxiosPrivate();

  const getActivities = async (q?: string | number, url?: string) =>
    await axiosPrivate.get(
      url ? url : `/admin/activities?${q ? `filter[title]=${q}` : ''}`
    );

  const { data, isLoading: isFetchingActivities } = useQuery({
    queryKey: ['activities', q, url],
    queryFn: async ({ queryKey }) => {
      return (await getActivities(queryKey[1], queryKey[2] as string)).data;
    },
  });

  return {
    activities: data?.activities as Activity[],
    isFetchingActivities,
  };
};

export default useActivities;
