import React, { ReactElement, useState } from 'react';
import LandingLayout from '@layouts/LandingLayout';
import Table from '@components/Table';
import { CashIcon, CalendarIcon, TicketIcon } from '@heroicons/react/outline';
import { useGuard } from 'hooks/useGuard';
import { useSelector } from 'react-redux';
import { useAxios } from 'hooks/useAxios';
import { useMutation, useQuery } from 'react-query';
import { useAppDispatch } from '@store/hooks';
import { AxiosError } from 'axios';
import { open } from '@store/counter/snackbarReducer';
import RechargueForm from '@components/modalForms/RechargueForm';
import Card from '@components/Card';
import PaymentMethodCard from '@components/PaymentMethodCard';
import { currencyFormatter } from 'utils/utils';

const Recharges = () => {
  useGuard();
  const [pageParam, setPageParam] = useState(1);
  const [countPage, setCountPage] = useState(1);
  const dispatch = useAppDispatch();
  const { requester } = useAxios();
  const [rows, setRows] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [modal] = React.useState('');
  const accountNumber = useSelector(
    (state: any) => state.loginUser?.user_info?.account_number
  );
  const account_info = useSelector(
    (state: any) => state.loginUser?.account_info
  );

  const transits = useSelector((state: any) => state.loginUser);

  const { data, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['getBalance'],
    queryFn: async () => {
      return await requester({
        method: 'GET',
        url: '/dashboard/account_balance/',
      });
    },
  });

  const { data: dataLogin, isLoading: isLoadingLogin } = useQuery({
    queryKey: ['getLastLogin'],
    queryFn: async () => {
      return await requester({
        method: 'GET',
        url: '/dashboard/last_login/',
      });
    },
  });
  const { data: dataRecharge, isLoading: isLoadingRecharge } = useQuery({
    queryKey: ['getRecharge'],
    queryFn: async () => {
      return await requester({
        method: 'GET',
        url: '/dashboard/last_recharge/',
      });
    },
  });

  const {
    mutate,
    data: response,
    isLoading,
  } = useMutation(
    (account: any) => {
      return requester({
        method: 'POST',
        data: account,
        url: 'external-recharge/list/',
      });
    },
    {
      onError: (error: AxiosError) => {
        dispatch(open({ text: error.response.statusText, type: 'error' }));
      },
    }
  );

  const headers = [
    {
      id: '1',
      key: 'created_on',
      header: 'Fecha',
    },

    {
      id: '2',
      key: 'external_reference_id',
      header: 'Referencia',
    },
    {
      id: '3',
      key: 'facial_amount',
      header: 'Monto',
    },
    // {
    //   id: '4',
    //   key: 'payment_method',
    //   header: 'Método de pago',
    // },
    {
      id: '5',
      key: 'status',
      header: 'Estado',
    },
  ];
  React.useEffect(() => {
    mutate({ page: pageParam, per_page: 10 });
  }, [mutate]);

  React.useEffect(() => {
    if (response) {
      setCountPage(response.data.pagination.count);
      const table = response?.data?.data?.map(
        ({
          external_reference_id,
          amount,
          status,
          payment_method,
          created_on,
        }) => {
          return {
            external_reference_id,
            facial_amount: currencyFormatter.format(amount),
            payment_method,
            created_on: new Date(created_on).toLocaleDateString('es-VE'),
            status:
              status === 'created' ? (
                <div className="w-32 rounded-full bg-green-300/50 py-0.5 text-center text-emerald-600">
                  {' '}
                  Exitosa{' '}
                </div>
              ) : status === 'cancelled' ? (
                <div className=" w-32 rounded-full bg-red-300/50 py-0.5 text-center text-red-600">
                  {' '}
                  Cancelada{' '}
                </div>
              ) : null,
          };
        }
      );
      setRows(table);
    }
  }, [response]);

  return (
    <>
      {modal === 'recharge' ? (
        <RechargueForm
          open={openModal}
          setOpen={setOpenModal}
          accountNumber={accountNumber}
        />
      ) : null}
      <div className="mx-6 mt-24 w-full">
        <div className="mb-10 space-y-4">
          <div className="flex justify-between">
            <h2 className="sub-header-text text-3xl">Realiza tu recarga</h2>
            {/* <button
              onClick={handleRecharge}
              className="cursor-pointer rounded-lg bg-emerald-600/70 px-4 py-2 text-center font-medium text-white shadow-md hover:bg-emerald-600/50 focus:outline-none focus:ring focus:ring-emerald-600/50 focus:ring-opacity-80 focus:ring-offset-2"
            >
              Recargar
            </button> */}
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            <PaymentMethodCard
              image={'/app/metodos-de-pago-01.svg'}
              href="/bankdv"
            />
            <PaymentMethodCard image={'/app/metodos-de-pago-02.svg'} href="" />
            <PaymentMethodCard image={'/app/metodos-de-pago-03.svg'} href="" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            <Card
              title={'Saldo actual'}
              data={
                data?.data?.data?.account_balance
                  ? currencyFormatter.format(data?.data?.data?.account_balance)
                  : 'No hay data'
              }
              isLoading={isLoadingBalance}
              icon={
                <div className="flex h-10 w-10 items-center">
                  <img
                    src="/app/icon-wallet.png"
                    alt="saldo"
                    className="card-icon"
                  />
                </div>
              }
              moreInfo={false}
              link=""
            />
            <Card
              title={'Última visita'}
              data={new Date(
                dataLogin?.data?.data?.last_login
              ).toLocaleDateString('es-VE')}
              isLoading={isLoadingLogin}
              icon={
                <div className="flex h-10 w-10 items-center">
                  <img
                    src="/app/icon-cal-car.png"
                    alt="saldo"
                    className="card-icon"
                  />
                </div>
              }
              moreInfo={false}
              link=""
            />
            <Card
              title={'Última recarga'}
              data={
                dataRecharge?.data?.data?.last_recharge?.amount
                  ? currencyFormatter.format(
                      dataRecharge?.data?.data?.last_recharge?.amount
                    )
                  : 'No hay data'
              }
              isLoading={isLoadingRecharge}
              icon={
                <div className="flex h-10 w-10 items-center">
                  <img
                    src="/app/icon-cal-recharge.png"
                    alt="saldo"
                    className="card-icon"
                  />
                </div>
              }
              moreInfo={false}
              link=""
            />
          </div>
        </div>
        {/* <div className="mb-10 space-y-8">
          <div className="grid grid-cols-3 gap-4">
            <Card
              title={'Saldo actual'}
              data={`Bs ${balance}`}
              icon={
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/30">
                  <BanknotesIcon className="h-9 w-9 text-emerald-600" />
                </div>
              }
              moreInfo={false}
            />
            <Card
              title={'Última recarga'}
              data={'10/07/2022'}
              icon={
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/30">
                  <CalendarIcon className="h-9 w-9 text-amber-600" />
                </div>
              }
              moreInfo={false}
            />
            <Card
              title={'Monto de última recarga'}
              data={'Bs 10'}
              icon={
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/30">
                  <TicketIcon className="h-9 w-9 rotate-90 text-indigo-600" />
                </div>
              }
              moreInfo={false}
            />
          </div>
        </div> */}
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
    </>
  );
};

Recharges.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

// noinspection JSUnusedGlobalSymbols
export default Recharges;
