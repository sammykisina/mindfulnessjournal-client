import useAxiosPrivate from '@/hooks/shared/use-axios-private';
import { Activity } from '@/types/activity';
import { useQuery } from '@tanstack/react-query';

const useActivityRecommendations = ({
  q,
}: {
  q?: number | string;
} = {}) => {
  const { axiosPrivate } = useAxiosPrivate();

  const getActivityRecommendations = async (q?: string | number) =>
    await axiosPrivate.get(
      `/user/activity/recommendations?${q ? `filter[title]=${q}` : ''}`
    );

  const { data, isLoading: isFetchingActivityRecommendations } = useQuery({
    queryKey: ['recommendations-activities', q],
    queryFn: async ({ queryKey }) => {
      return (await getActivityRecommendations(queryKey[1])).data;
    },
  });

  return {
    activities: data?.activities as Activity[],
    isFetchingActivityRecommendations,
  };
};

export default useActivityRecommendations;
