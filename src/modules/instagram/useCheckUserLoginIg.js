// @format
import { useMemo, useEffect, useState, createContext } from 'react';

export const IgUserNameContext = createContext();

export const useCheckUserLoginIg = store => {
  const [igUserNameState, setIgUserNameState] = useState({
    username: undefined,
    isLoading: true,
    isLogin: false,
  });

  useEffect(() => {
    const username = store.getState()?.instagram?.profile?.username;
    setIgUserNameState(state => ({
      ...state,
      username,
      isLoading: false,
      isLogin: !!username && username !== 'undefined',
    }));
  }, []);

  const igUserNameContext = useMemo(
    () => ({
      setUserName: username => {
        setIgUserNameState({
          isLoading: false,
          isLogin: !!username && username !== 'undefined',
          username,
        });
      },
    }),
    [],
  );

  return { igUserNameContext, igUserNameState };
};
