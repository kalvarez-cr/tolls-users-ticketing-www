import React, { ReactElement, useState, useEffect } from 'react';
import LandingLayout from '@layouts/LandingLayout';

import { useSelector } from 'react-redux';
import { useGuard } from 'hooks/useGuard';
import Card from '@components/Card';
import Chart from '@components/Chart';
import { GreetingByTime } from '../utils/requester';
import { currencyFormatter, getStatusClassName } from 'utils/utils';
import { UseApiCall } from 'hooks/useApiCall';
import BarChartComponent from '@components/BarChart';
import Table from '@components/Table';

const headers = [
  {
    id: '1',
    key: 'nickname',
    header: 'Alias',
  },

  {
    id: '2',
    key: 'model',
    header: 'Modelo',
  },
  {
    id: '3',
    key: 'license_plate',
    header: 'Placa',
  },
  {
    id: '4',
    key: 'category_title',
    header: 'Categoría',
  },
];

const Home = () => {
  useGuard();
  const [pageParam, setPageParam] = useState(1);
  const [countPage, setCountPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [responseData, setResponseData] = React.useState<any>(null);

  const userInfo = useSelector((state: any) => state.loginUser?.user_info);

  const { useGet, usePost } = UseApiCall();

  const { data, isLoading: isLoadingBalance } = useGet({
    queryKey: 'getBalance',
    url: '/dashboard/account_balance/',
  });

  const { data: dataVehicle, isLoading: isLoadingVehicle } = useGet({
    queryKey: 'getVehicle',
    url: '/dashboard/count_vehicle/',
  });

  const { data: dataTransit, isLoading: isLoadingTransit } = useGet({
    queryKey: 'getTransit',
    url: '/dashboard/count_transits/',
  });

  const { data: dataPieChart, isLoading: isLoadingPieChart } = useGet({
    queryKey: 'getPieChart',
    url: '/dashboard/site-transits/',
  });

  const { mutate, isLoading } = usePost({
    url: '/vehicle-account/list/',
    options: {
      onSuccess: (data) => {
        setResponseData(data);
      },
    },
  });

  React.useEffect(() => {
    mutate({ page: pageParam, per_page: 10 });
  }, [pageParam, mutate]);

  useEffect(() => {
    if (responseData) {
      setCountPage(responseData?.pagination?.count);

      const rows = responseData?.data?.map(
        ({
          id,
          make,
          model,
          plate,
          vehicle_category,
          vin,
          status,
          nickname,
        }) => {
          return {
            make,
            model,
            license_plate: plate,
            category_title: vehicle_category,
            tag_serial: vin,
            enabled: true,
            nickname,
          };
        }
      );
      setRows(rows);
    }
  }, [responseData]);

  return (
    <>
      <div className="mx-6 mt-24 w-full">
        <div className="mb-10 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="header-text text-4xl">
              {userInfo?.account_type === 'personal_account'
                ? `${GreetingByTime()}, ${userInfo?.first_name} ${
                    userInfo?.last_name
                  }`
                : `${GreetingByTime()}, ${userInfo?.company_name}`}
            </h2>
          </div>
          <div className=" grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            <Card
              title={'Saldo actual'}
              data={
                data?.data?.data?.account_balance
                  ? currencyFormatter.format(data?.data?.data?.account_balance)
                  : 'No hay registro'
              }
              isLoading={isLoadingBalance}
              icon={
                <div className="flex h-10 w-10 items-center">
                  <img
                    src="/icon-wallet.png"
                    alt="saldo"
                    className="card-icon"
                  />
                </div>
              }
              moreInfo={true}
              link="/recharges"
            />
            <Card
              title={'Vehículos'}
              data={
                dataVehicle?.data?.data?.vehicles
                  ? dataVehicle?.data?.data?.vehicles
                  : 'No hay Vehículo'
              }
              isLoading={isLoadingVehicle}
              icon={
                <div className="flex h-10 w-10 items-center">
                  <img src="/icon-car.png" alt="saldo" className="card-icon" />
                </div>
              }
              moreInfo={true}
              link="/vehicles"
            />
            <Card
              title={'Tránsitos'}
              data={
                dataTransit?.data?.data?.transits
                  ? dataTransit?.data?.data?.transits
                  : 'Sin tránsitos '
              }
              isLoading={isLoadingTransit}
              icon={
                <div className="flex h-10 w-10 items-center">
                  <img src="/icon-toll.png" alt="saldo" className="card-icon" />
                </div>
              }
              moreInfo={true}
              link="/transit"
            />
          </div>
          {/* <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-1  md:grid-cols-3 md:gap-x-6">
            <div className="">
              <div
                className={` mb-6 flex h-auto rounded-md p-2 ${getStatusClassName(
                  data?.data?.data?.account_status
                )}`}
              >
                <h4 className=" font-semibold m-auto text-white">
                  {`${data?.data?.data?.account_status}`}
                </h4>
              </div>

              <Chart
                dataPieChart={dataPieChart}
                isLoadingPieChart={isLoadingPieChart}
              />
            </div>
            <div className="col-span-2 grid">
              <BarChartComponent />
            </div>
          </div> */}
        </div>

        <Table
          headers={headers}
          data={rows}
          isLoading={isLoading}
          errorMessage={
            'No hay vehículos asociados. Por favor diríjase al peaje más cercano.'
          }
          countPage={countPage}
          pageParam={pageParam}
          setPageParam={setPageParam}
        />
      </div>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

// noinspection JSUnusedGlobalSymbols
export default Home;
