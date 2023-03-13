import React, { ReactElement, useState, useEffect } from 'react';
import LandingLayout from '@layouts/LandingLayout';
import Table from '@components/Table';
import { EyeIcon } from '@heroicons/react/solid';
import { useGuard } from 'hooks/useGuard';
import Card from '@components/Card';
import { useMutation, useQuery } from 'react-query';
import { useAppDispatch } from '@store/hooks';
import { requester } from 'utils/requester';
import { AxiosError } from 'axios';
import { open } from '@store/counter/snackbarReducer';
import { useSelector } from 'react-redux';
import { currencyFormatter } from 'utils/utils';
import { UseApiCall } from 'hooks/useApiCall';

const Transit = () => {
  useGuard();
  const dispatch = useAppDispatch();
  const [rows, setRows] = useState([]);
  const [pageParam, setPageParam] = useState(1);
  const [countPage, setCountPage] = useState(1);
  const transits = useSelector((state: any) => state.loginUser);

  const { useGet, usePost } = UseApiCall();

  const { data: dataTransit, isLoading: isLoadingTransit } = useGet({
    queryKey: 'getTransit',
    url: '/dashboard/count_transits/',
  });

  const { data: dataTotalConsumed, isLoading: isLoadingTotalConsumed } = useGet(
    {
      queryKey: 'getTotalAmount',
      url: '/dashboard/total_consumed/',
    }
  );

  const { data: dataTotalTransit, isLoading: isLoadingTotalTransit } = useGet({
    queryKey: 'getTotalTransit',
    url: '/dashboard/last_transit/',
  });
  const {
    mutate,
    data: response,
    isLoading,
  } = usePost({ url: '/tag-account-movements/list/' });

  const headers = [
    {
      id: '1',
      key: 'moment',
      header: 'Fecha',
    },
    {
      id: '2',
      key: 'collected_amount',
      header: 'Monto',
    },

    {
      id: '3',
      key: 'lane',
      header: 'Canal',
    },
    {
      id: '4',
      key: 'tag_serial',
      header: 'Tag',
    },
    {
      id: '5',
      key: 'toll_site',
      header: 'Peaje',
    },
  ];

  React.useEffect(() => {
    mutate({ per_page: 10, page: pageParam });
  }, [pageParam, mutate]);

  useEffect(() => {
    if (response) {
      setCountPage(response?.pagination?.count);
      const rows = response?.data?.map(
        ({
          id,
          moment,
          collected_amount,

          tag_serial,
          lane,
          toll_site,
        }) => {
          return {
            collected_amount: currencyFormatter.format(collected_amount),
            tag_serial,
            lane,
            toll_site,
            moment: new Date(moment).toLocaleDateString('es-VE'),
            actions: (
              <button className="ml-8" tag-id={id}>
                <EyeIcon
                  className={`h-6 cursor-pointer text-emerald-700/50 transition-all duration-150 hover:text-emerald-500`}
                />
              </button>
            ),
          };
        }
      );
      setRows(rows);
    }
  }, [response]);

  return (
    <div className="mx-6 mt-24 w-full">
      <div className="mb-10 space-y-8">
        <h2 className="sub-header-text text-3xl tracking-wide">
          Historial de Tránsitos
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          <Card
            title={'Tránsitos'}
            data={
              dataTransit?.data?.data?.transits
                ? dataTransit?.data?.data?.transits
                : 'No hay data'
            }
            isLoading={isLoadingTransit}
            icon={
              <div className="flex h-10 w-10 items-center">
                <img
                  src="/icon-toll.png"
                  alt="Tránsitos"
                  className="card-icon"
                />
              </div>
            }
            moreInfo={false}
            link=""
          />
          <Card
            title={'Total consumido'}
            data={
              dataTotalConsumed?.data?.data?.total
                ? currencyFormatter.format(dataTotalConsumed?.data?.data?.total)
                : 'No hay data'
            }
            isLoading={isLoadingTotalConsumed}
            icon={
              <div className="flex h-10 w-10 items-center">
                <img
                  src="/icon-receipt.png"
                  alt="Total consumido"
                  className="card-icon"
                />
              </div>
            }
            moreInfo={false}
            link=""
          />
          <Card
            title={'Último peaje'}
            data={
              dataTotalTransit?.data?.data?.last_transit?.toll_site
                ? dataTotalTransit?.data?.data?.last_transit?.toll_site
                : 'No hay data'
            }
            isLoading={isLoadingTotalTransit}
            icon={
              <div className="flex h-10 w-10 items-center">
                <img
                  src="/icon-cal-toll.png"
                  alt="Último peaje"
                  className="card-icon"
                />
              </div>
            }
            moreInfo={false}
            link=""
          />
        </div>
      </div>
      <Table
        headers={headers}
        data={rows}
        isLoading={isLoading}
        errorMessage={'No hay data disponible.'}
        countPage={countPage}
        pageParam={pageParam}
        setPageParam={setPageParam}
      />
    </div>
  );
};

Transit.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

// noinspection JSUnusedGlobalSymbols
export default Transit;
