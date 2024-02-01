import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { loginUser, logout } from '@store/counter/loginReducer';
import { useRouter } from 'next/router';

export const useGuard = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loggedIn , user_info } = useAppSelector(loginUser);

 


  useEffect(() => {
    if (!loggedIn) {
      router.push('/')
      //@ts-ignore
    } else if (user_info.last_login === null) {
   
      router.push('/newPassword');

     
      dispatch(logout());  
    }
  }, [loggedIn, user_info, dispatch, router]);
};



     