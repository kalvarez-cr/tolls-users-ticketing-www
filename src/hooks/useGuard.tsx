import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { loginUser } from '@store/counter/loginReducer';
import { open } from '@store/counter/modalReducer';

export const useGuard = () => {
  const dispatch = useAppDispatch();
  const { loggedIn } = useAppSelector(loginUser);

  useEffect(() => {
    !loggedIn ? dispatch(open()) : null;
  }, [loggedIn]);
};
