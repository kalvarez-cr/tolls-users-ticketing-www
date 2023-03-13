import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { loginUser } from '@store/counter/loginReducer';
import { useRouter } from 'next/router';

export const useGuard = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loggedIn } = useAppSelector(loginUser);

  useEffect(() => {
    !loggedIn ? router.push('/') : null;
  }, [loggedIn]);
};
