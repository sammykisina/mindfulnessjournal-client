import { axiosPublic } from '@/lib/axios';
import React from 'react';

const useAxiosPublic = () => {
  React.useEffect(() => {
    const requestIntercept = axiosPublic.interceptors.request.use(
      (config) => {
        console.log('config', config);

        return config;
      },
      (error) => {
        // if(error)
        console.log('error', error);

        Promise.reject(error);
      }
    );

    return () => {
      axiosPublic.interceptors.request.eject(requestIntercept);
    };
  }, []);

  return { axiosPublic };
};

export default useAxiosPublic;
