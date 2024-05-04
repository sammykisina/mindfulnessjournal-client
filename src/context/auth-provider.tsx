import STORAGE from '@/constants/storage';
import { getFromLocalStorage } from '@/lib/storage';
import { Auth } from '@/types/shared/auth';

import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';

type AuthContextType = {
  isLoadingAuth: boolean;
  setIsLoadingAuth: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  auth: Auth | null;
  setAuth: React.Dispatch<React.SetStateAction<Auth | null>>;
};

const AuthContext = createContext<AuthContextType>({
  isLoadingAuth: false,
  setIsLoadingAuth: () => { },
  
  isLoggedIn: false,
  setIsLoggedIn: () => { },
  
  auth: null,
  setAuth: () => {},
});

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

export function AuthProvider(props: PropsWithChildren<{}>) {
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [auth, setAuth] = useState<Auth | null>(null);

  React.useEffect(() => {
    const getCurrentAuth = async () => {
      try {
        setIsLoadingAuth(true);
        const storageAuth = await getFromLocalStorage(STORAGE.userAuth);

        if (storageAuth) {
          setIsLoggedIn(true);
          setAuth(storageAuth);
        } else {
          setIsLoggedIn(false);
          setAuth(null);
        }
      } catch (error) {
        console.log('Error when getting current Auth', error);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    getCurrentAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoadingAuth,
        setIsLoadingAuth,

        isLoggedIn,
        setIsLoggedIn,

        auth,
        setAuth,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
