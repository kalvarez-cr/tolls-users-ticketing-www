import React, { ReactElement, useState, useEffect } from 'react';
import LandingLayout from '@layouts/LandingLayout';

import { useSelector } from 'react-redux';
import { useAppDispatch } from '@store/hooks';
import RechargueForm from '@components/modalForms/RechargueForm';
import { useGuard } from 'hooks/useGuard';
import { useAxios } from 'hooks/useAxios';
import Card from '@components/Card';
import Chart from '@components/Chart'
import CancelForm from '@components/modalForms/CancelForm';
import { GreetingByTime } from '../utils/requester';
import { currencyFormatter, getStatusClassName } from 'utils/utils';
import { UseApiCall } from 'hooks/useApiCall';
import BarChartComponent from '@components/BarChart';




const Home = () => {
  useGuard();
 
   
  const userInfo = useSelector((state: any) => state.loginUser?.user_info);

  const { useGet  } = UseApiCall();

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

  const { data: dataPieChart, isLoading: isLoadingPieChart  } = useGet({
    queryKey: 'getPieChart',
    url: '/dashboard/site-transits/',
  });

  



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
              data={currencyFormatter.format(data?.data?.data?.account_balance)}
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
        </div>
        <div className='flex justify-between'>
          <div className='flex-col'>
            <div className={` h-auto p-2 rounded-md flex mb-6 ${getStatusClassName(data?.data?.data?.account_status)}`}>
                
                <h4 className='text-white font-semibold ml-16'> {`     ${data?.data?.data?.account_status}`}</h4>
                
            </div>
            
            <Chart dataPieChart={dataPieChart} isLoadingPieChart={isLoadingPieChart}/>
          </div>
            <BarChartComponent/>
       </div>
      
      </div>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

// noinspection JSUnusedGlobalSymbols
export default Home;
