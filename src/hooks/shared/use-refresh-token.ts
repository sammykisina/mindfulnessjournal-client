// import STORAGE from '@/constants/storage';
// import { useAuth } from '@/context/auth-provider';
// import { axiosPublic } from '@/lib/axios';
// import { storeToLocalStorage } from '@/lib/storage';

// const useRefreshToken = () => {
//   /**
//    * === STATES ===
//    */
//   const { auth, setAuth } = useAuth();

//   /**
//    * === FUNCTIONS ===
//    */
//   const refresh = async () => {
//     try {
//       const response = await axiosPublic.post(
//         '/auth/refresh-token',
//         { refresh_token: auth?.refresh_token },
//         {
//           headers: {
//             Authorization: `Bearer ${auth?.access_token}`,
//           },
//         }
//       );

//       const user = auth?.user;
//       const newUser = { ...response?.data?.data, user: user };

//       console.log('user when refreshing token in use refresh', newUser);

//       await storeToLocalStorage(STORAGE.userAuth, newUser);

//       setAuth(newUser);

//       return newUser?.jwtToken;
//     } catch (error) {
//       await storeToLocalStorage(STORAGE.userAuth, null);
//       setAuth(null);
//     }
//   };

//   return { refresh };
// };

// export default useRefreshToken;
