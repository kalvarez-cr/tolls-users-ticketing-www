import { useAppDispatch } from '@store/hooks';
import { AxiosError } from 'axios';
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from 'react-query';
import { requester } from 'utils/requester';
import { open } from '@store/counter/snackbarReducer';
import { logout } from '@store/counter/loginReducer';
import { useRouter } from 'next/router';

interface TUseGet {
  url: string;
  queryKey: string;
  options?: Omit<UseQueryOptions<any, unknown, any, any[]>, 'initialData'>;
}

interface TUsePost {
  url: string;
  options?: UseMutationOptions<any, unknown, unknown>;
}

export const UseApiCall = () => {
  const dispatch = useAppDispatch();
  const { isReady } = useRouter();

  const useGet = ({ url, queryKey, options }: TUseGet) =>
    useQuery({
      queryKey: [queryKey, url],
      queryFn: async () => {
        return await requester({
          method: 'GET',
          url,
        });
      },
      onError: ({ response }) => {
        if (response?.status === 403) {
          dispatch(open({ text: 'Sesión expirada', type: 'error' }));
          dispatch(logout());
        }
      },
      retry: false,
      enabled: isReady,
      ...options,
    });

  const usePost = ({ url, options }: TUsePost) =>
    useMutation({
      mutationFn: async (dataDto) => {
        const { data } = await requester({
          method: 'POST',
          data: dataDto,
          url,
        });
        return data;
      },
      onError: (error: AxiosError) => {
        dispatch(open({ text: 'Ha ocurrido un error', type: 'error' }));
      },
      ...options,
    });
  return { useGet, usePost };
};
