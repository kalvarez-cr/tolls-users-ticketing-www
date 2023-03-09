import LandingLayout from '@layouts/LandingLayout';
import { open } from '@store/counter/snackbarReducer';
import { useAppDispatch } from '@store/hooks';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import { useMutation } from 'react-query';
import { requester } from 'utils/requester';

const ResponseBdv = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = router.query;

  const {
    mutate,
    data: response,
    isLoading,
  } = useMutation(
    (formData: any) => {
      return requester({
        method: 'POST',
        data: formData,
        url: 'external-recharge/payment_bdv_external/',
      });
    },
    {
      // onSuccess: (response) => {
      //   const { data } = response;
      //   if (data.return_code === '9700') {

      //   }
      // },
      onError: (error: AxiosError) => {
        dispatch(open({ text: error.response.statusText, type: 'error' }));
      },
    }
  );

  useEffect(() => {
    mutate({ paymentId: id });
  }, [id]);

  return (
    <div className="mt-20 place-content-center">
      {isLoading ? (
        <div className=" bg-white-200 h-6 w-5/6 animate-pulse rounded-md"></div>
      ) : (
        <div className="mt-28 w-5/6 rounded-xl bg-gray-100 p-24 shadow-xl">
          {response?.data?.data?.responseDescription}

          {setTimeout(() => {
            router.push('/recharges');
          }, 3000)}
        </div>
      )}
    </div>
  );
};

export default ResponseBdv;
ResponseBdv.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};
