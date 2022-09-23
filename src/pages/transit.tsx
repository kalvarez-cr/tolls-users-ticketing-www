import React, { ReactElement, useState, useEffect } from 'react';
import LandingLayout from '@layouts/LandingLayout';
import Table from '@components/Table';
import { EyeIcon } from '@heroicons/react/solid';
import {
  TruckIcon,
  CreditCardIcon,
  TicketIcon,
} from '@heroicons/react/outline';
import { useGuard } from 'hooks/useGuard';
import Card from '@components/Card';
import { useMutation } from 'react-query';
import { useAppDispatch } from '@store/hooks';
import { requester } from 'utils/requester';
import { AxiosError } from 'axios';
import { open } from '@store/counter/snackbarReducer';
import { useSelector } from 'react-redux';

const Transit = () => {
  useGuard();
  const dispatch = useAppDispatch();
  const accountNumber = useSelector(
    (state: any) => state.loginUser?.user_info?.account_number
  );
  const transits = useSelector((state: any) => state.loginUser?.transits);
  const {
    mutate,
    data: response,
    isLoading,
  } = useMutation(
    (account: any) => {
      return requester({
        method: 'POST',
        data: account,
        url: '/transit-detail/get/',
      });
    },
    {
      onError: (error: AxiosError) => {
        dispatch(open({ text: error.response.statusText, type: 'error' }));
      },
    }
  );

  const [rows, setRows] = useState([]);

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
      key: 'vehicle_category',
      header: 'Vehículo',
    },
    {
      id: '4',
      key: 'registered_vehicle',
      header: 'Placa',
    },
    {
      id: '5',
      key: 'tag_id',
      header: 'Tag',
    },
    {
      id: '6',
      key: 'site',
      header: 'Peaje',
    },
    // {
    //   id: '7',
    //   key: 'movements',
    //   header: 'Movimientos',
    // },
    // {
    //   id: '6',
    //   key: 'ticket',
    //   header: 'Ticket',
    // },
    // {
    //   id: '6',
    //   key: 'amount',
    //   header: 'Monto',
    // },
    // {
    //   id: '7',
    //   key: 'actions',
    //   header: 'Detalles',
    // },
  ];

  React.useEffect(() => {
    mutate({ account_number: accountNumber, per_page: 200 });
  }, [accountNumber, mutate]);

  useEffect(() => {
    if (response) {
      const rows = response.data.data.map(
        ({
          id,
          moment,
          collected_amount,
          vehicle_category,
          tag_id,
          registered_vehicle,
          site,
        }) => {
          return {
            collected_amount,
            vehicle_category: vehicle_category.title,
            tag_id: tag_id.tag_serial,
            registered_vehicle: registered_vehicle.license_plate,
            site: site.name,
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
    } else {
      <p>No tiene tránsitos registrados </p>;
    }
  }, [response]);

  const total = rows.map((amount) => Number(amount.collected_amount));

  const initialValue = 0;
  const transitAmount = total.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    initialValue
  );

  const sites = rows.map((row) => row.site);
  let lastSite = sites[sites.length - 1];

  return (
    <div className="mt-24 w-full">
      <div className="mb-10 space-y-8">
        <h2 className="text-3xl tracking-wide text-gray-800">
          Historial de Tránsitos
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <Card
            title={'Tránsitos'}
            data={transits}
            icon={
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/30">
                <TruckIcon className="h-9 w-9 text-amber-600" />
              </div>
            }
            moreInfo={false}
          />
          <Card
            title={'Total consumido'}
            data={transitAmount.toString()}
            icon={
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/30">
                <CreditCardIcon className="h-9 w-9 text-emerald-600" />
              </div>
            }
            moreInfo={false}
          />
          <Card
            title={'Último peaje'}
            data={lastSite}
            icon={
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/30">
                <TicketIcon className="h-9 w-9 rotate-90 text-indigo-600" />
              </div>
            }
            moreInfo={false}
          />
          {/* <div className="h-36 rounded-xl shadow-md">
            <div className="flex h-full items-center space-x-6 rounded-xl bg-white px-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/30">
                <SupportIcon className="h-9 w-9 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg text-gray-600">Tránsitos</h2>
                <h2 className="text-2xl font-medium">1270</h2>
              </div>
            </div>
          </div>
          <div className="h-36 rounded-xl shadow-md">
            <div className="flex h-full items-center space-x-6 rounded-xl bg-white px-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/30">
                <CalendarIcon className="h-9 w-9 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg text-gray-600">Última uso</h2>
                <h2 className="text-2xl font-medium">10/07/2022</h2>
              </div>
            </div>
          </div>
          <div className="h-36 rounded-xl shadow-md">
            <div className="flex h-full items-center space-x-6 rounded-xl bg-white px-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/30">
                <TicketIcon className="h-9 w-9 rotate-90 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg text-gray-600">Último peaje</h2>
                <h2 className="text-2xl font-medium">Punta Piedra</h2>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      <Table headers={headers} data={rows} isLoading={isLoading} />
    </div>
  );
};

Transit.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default Transit;
