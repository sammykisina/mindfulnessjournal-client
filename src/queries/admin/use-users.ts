import useAxiosPrivate from '@/hooks/shared/use-axios-private';
import { User } from '@/types/shared/auth';
import { useQuery } from '@tanstack/react-query';

const useUsers = ({
  url,
}: {
  url?: number | string;
} = {}) => {
  const { axiosPrivate } = useAxiosPrivate();

  const getUsers = async (url?: string | number) =>
    await axiosPrivate.get(url ? String(url) : `/admin/users`);

  const { data, isLoading: isFetchingUsers } = useQuery({
    queryKey: ['users', url],
    queryFn: async ({ queryKey }) => {
      return (await getUsers(queryKey[1])).data;
    },
  });

  return {
    users: data?.users as User[],
    isFetchingUsers,
  };
};

export default useUsers;
