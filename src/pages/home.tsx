import React, { ReactElement, useState, useEffect } from 'react';
import LandingLayout from '@layouts/LandingLayout';
import Table from '@components/Table';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from 'react-query';
import { useAppDispatch } from '@store/hooks';
import { AxiosError } from 'axios';
import { open } from '@store/counter/snackbarReducer';
import RechargueForm from '@components/modalForms/RechargueForm';
import { useGuard } from 'hooks/useGuard';
import { useAxios } from 'hooks/useAxios';
import { MinusCircleIcon } from '@heroicons/react/solid';
import Card from '@components/Card';
import CancelForm from '@components/modalForms/CancelForm';
import BlockForm from '@components/modalForms/BlockForm';
import { XCircleIcon } from '@heroicons/react/outline';
import { GreetingByTime } from '../utils/requester';
import { currencyFormatter } from 'utils/utils';

const Home = () => {
  useGuard();
  const { requester } = useAxios();
  const dispatch = useAppDispatch();
  const [pageParam, setPageParam] = useState(1);
  const [countPage, setCountPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [modal, setModal] = React.useState('');
  const [idVehicle, setIdVehicle] = React.useState('');
  const [idTag, setIdTag] = React.useState('');
  const [rows, setRows] = useState([]);
  const userInfo = useSelector((state: any) => state.loginUser?.user_info);
  const transits = useSelector((state: any) => state.loginUser?.transits);

  const { data, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['getBalance'],
    queryFn: async () => {
      return await requester({
        method: 'GET',
        url: '/dashboard/account_balance/',
      });
    },
  });

  const { data: dataVehicle, isLoading: isLoadingVehicle } = useQuery({
    queryKey: ['getVehicle'],
    queryFn: async () => {
      return await requester({
        method: 'GET',
        url: '/dashboard/count_vehicle/',
      });
    },
  });

  const { data: dataTransit, isLoading: isLoadingTransit } = useQuery({
    queryKey: ['getTransit'],
    queryFn: async () => {
      return await requester({
        method: 'GET',
        url: '/dashboard/count_transits/',
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
        url: '/vehicle-account/list/',
      });
    },
    {
      onError: (error: AxiosError) => {
        dispatch(open({ text: error.response.statusText, type: 'error' }));
      },
    }
  );

  const handleCancel = (e) => {
    setOpenModal(true);
    setModal('cancel');
    const id = e.currentTarget.dataset.tag;
    setIdVehicle(id);
  };

  const handleDisabled = (e) => {
    setOpenModal(true);
    setModal('block');
    const id = e.currentTarget.dataset.id;
    setIdTag(id);
  };

  const headers = [
    // {
    //   id: '1',
    //   key: 'make',
    //   header: 'Marca',
    // },
    {
      id: '1',
      key: 'model',
      header: 'Modelo',
    },
    {
      id: '2',
      key: 'license_plate',
      header: 'Placa',
    },
    {
      id: '3',
      key: 'category_title',
      header: 'Categoría',
    },
    {
      id: '4',
      key: 'tag_serial',
      header: 'Tag asociado',
    },
    {
      id: '5',
      key: 'active',
      header: 'Habilitado',
    },
    {
      id: '6',
      key: 'actions',
      header: 'Acciones',
    },
  ];

  React.useEffect(() => {
    mutate({ page: pageParam, per_page: 10 });
  }, [pageParam, mutate]);

  useEffect(() => {
    if (response) {
      setCountPage(response.data.pagination.count);
      const rows = response?.data?.data?.map(
        ({ id, model, plate, vehicle_category, vin, status }) => {
          return {
            model,
            license_plate: plate,
            category_title: vehicle_category,
            tag_serial: vin,
            enabled: true,
            active:
              status === 'active' ? (
                <div className="rounded-full bg-gray-100 py-0.5 text-center font-bold text-emerald-600">
                  &nbsp;Activo&nbsp;
                </div>
              ) : (
                <div className="rounded-full bg-gray-100 py-0.5 text-center text-red-600">
                  &nbsp;Inactivo&nbsp;
                </div>
              ),

            actions: (
              <div className="flex space-x-3">
                <button onClick={handleDisabled} data-id={id}>
                  <MinusCircleIcon className="h-6 text-rose-400 hover:text-rose-300" />
                </button>
                <button onClick={handleCancel} data-tag={id}>
                  <XCircleIcon className="h-6 text-rose-400 hover:text-rose-300" />
                </button>
              </div>
            ),
          };
        }
      );
      setRows(rows);
    } else {
      <p>No tiene vehículos registrados </p>;
    }
  }, [response]);

  return (
    <>
      {modal === 'recharge' ? (
        <RechargueForm
          open={openModal}
          setOpen={setOpenModal}
          accountNumber={userInfo?.account_number}
        />
      ) : null}

      {modal === 'cancel' ? (
        <CancelForm
          open={openModal}
          setOpen={setOpenModal}
          idVehicle={idVehicle}
        />
      ) : null}

      {modal === 'block' ? (
        <BlockForm open={openModal} setOpen={setOpenModal} idTag={idTag} />
      ) : null}
      <div className="mx-6 mt-24 w-full">
        <div className="mb-10 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="header-text text-4xl">
              {GreetingByTime()}, {userInfo?.first_name}&nbsp;
              {userInfo?.last_name}
            </h2>
            {/* <button
              onClick={handleRecharge}
              className="cursor-pointer rounded-lg bg-emerald-600/70 px-4 py-2 text-center font-medium text-white shadow-md hover:bg-emerald-600/50 focus:outline-none focus:ring focus:ring-emerald-600/50 focus:ring-opacity-80 focus:ring-offset-2"
            >
              Recargar
            </button> */}
          </div>
          <div className=" grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
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
              moreInfo={true}
              link="/recharges"
            />
            <Card
              title={'Vehículos'}
              data={
                dataVehicle?.data?.data?.vehicles
                  ? dataVehicle?.data?.data?.vehicles
                  : 'No hay data'
              }
              isLoading={isLoadingVehicle}
              icon={
                <div className="flex h-10 w-10 items-center">
                  <img
                    src="/app/icon-car.png"
                    alt="saldo"
                    className="card-icon"
                  />
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
                  : 'No hay data'
              }
              isLoading={isLoadingTransit}
              icon={
                <div className="flex h-10 w-10 items-center">
                  <img
                    src="/app/icon-toll.png"
                    alt="saldo"
                    className="card-icon"
                  />
                </div>
              }
              moreInfo={true}
              link="/transit"
            />
          </div>
        </div>
        <div className="space-y-8">
          <h2 className="sub-header-text text-2xl">Vehículos Asociados</h2>
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
      </div>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

// noinspection JSUnusedGlobalSymbols
export default Home;
