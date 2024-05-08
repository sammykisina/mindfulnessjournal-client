import { useAuth } from '@/context/auth-provider';
import { axiosPrivate } from '@/lib/axios';
import { router } from 'expo-router';
import React from 'react';

const useAxiosPrivate = () => {
  const { auth } = useAuth();

  // console.log('access', auth?.access_token);

  React.useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        // if has no Authorization then its not a retrial and thus its the 1st request
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth?.access_token}`; // set it
        }

        return config; // return the updated config
      },
      (error) => Promise.reject(error) //incase of error then return it
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response, // if the response is good
      async (error) => {
        // when maybe the token has expired
        const prevRequest = error?.config; // get the request that was there

        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;

          router.replace('/login');
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, []);

  return { axiosPrivate };
};

export default useAxiosPrivate;
