import React, { ReactElement, useState } from 'react';
import LandingLayout from '@layouts/LandingLayout';
import Table from '@components/Table';
import { useGuard } from 'hooks/useGuard';
import { useSelector } from 'react-redux';
import RechargueForm from '@components/modalForms/RechargueForm';
import Card from '@components/Card';
import PaymentMethodCard from '@components/PaymentMethodCard';
import { currencyFormatter } from 'utils/utils';
import { UseApiCall } from 'hooks/useApiCall';

const Recharges = () => {
  useGuard();
  const [pageParam, setPageParam] = useState(1);
  const [countPage, setCountPage] = useState(1);
  const [rows, setRows] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [modal] = React.useState('');
  const accountNumber = useSelector(
    (state: any) => state.loginUser?.user_info?.account_number
  );

  const lastLogin = useSelector((state: any ) => state?.loginUser?.user_info?.last_login)

  const { useGet, usePost } = UseApiCall();

  const { data, isLoading: isLoadingBalance } = useGet({
    queryKey: 'getBalance',
    url: '/dashboard/account_balance/',
  });

  // const { data: dataLogin, isLoading: isLoadingLogin } = useGet({
  //   queryKey: 'getLastLogin',
  //   url: '/dashboard/last_login/',
  // });
  const { data: dataRecharge, isLoading: isLoadingRecharge } = useGet({
    queryKey: 'getRecharge',
    url: '/dashboard/last_recharge/',
  });

  const {
    mutate,
    data: response,
    isLoading,
  } = usePost({ url: 'external-recharge/list/' });

  const headers = [
    {
      id: '1',
      key: 'created_on',
      header: 'Fecha',
    },
    {
      id: '2',
      key: 'channel',
      header: 'Canal de pago ',
    },

    {
      id: '3',
      key: 'external_reference_id',
      header: 'Referencia',
    },
    {
      id: '4',
      key: 'facial_amount',
      header: 'Monto',
    },
  ];
  React.useEffect(() => {
    mutate({ page: pageParam, per_page: 10 });
  }, [mutate, pageParam]);

  React.useEffect(() => {
    if (response) {
      setCountPage(response?.pagination?.count);

      const table = response?.data?.map(
        ({
          external_reference_id,
          amount,
          payment_method,
          created_on,
          channel,
        }) => {
          return {
            external_reference_id,
            facial_amount: currencyFormatter.format(amount),
            payment_method,
            channel,
            created_on: new Date(created_on).toLocaleDateString('es-VE'),
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
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
              moreInfo={false}
              link=""
            />
            <Card
              title={'Última visita'}
              data={
                lastLogin
                  ? new Date(
                    lastLogin
                    ).toLocaleDateString('es-VE')
                  : 'No hay data'
              }
              // isLoading={isLoadingLogin}
              icon={
                <div className="flex h-10 w-10 items-center">
                  <img
                    src="/icon-cal-car.png"
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
                  : 'No hay recargas'
              }
              isLoading={isLoadingRecharge}
              icon={
                <div className="flex h-10 w-10 items-center">
                  <img
                    src="/icon-cal-recharge.png"
                    alt="saldo"
                    className="card-icon"
                  />
                </div>
              }
              moreInfo={false}
              link=""
            />
          </div>
          <div className="flex justify-between">
            <h2 className="sub-header-text text-3xl">Realiza tu recarga</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            <PaymentMethodCard
              image={'/metodos-de-pago-01.svg'}
              href="/bankdv"
            />
            <PaymentMethodCard image={'/puntoYa.svg'} href="/credicard" />
            <PaymentMethodCard image={'/metodos-de-pagos-03.svg'} href="" />
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
    </>
  );
};

Recharges.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

// noinspection JSUnusedGlobalSymbols
export default Recharges;
