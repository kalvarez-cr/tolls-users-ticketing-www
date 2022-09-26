import React, { ReactElement, useState, useEffect } from 'react';
import LandingLayout from '@layouts/LandingLayout';
import Table from '@components/Table';
import {
  TruckIcon,
  CashIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';

import RechargueForm from '@components/modalForms/RechargueForm';
import { useGuard } from 'hooks/useGuard';
import { useAxios } from 'hooks/useAxios';
import { MinusCircleIcon } from '@heroicons/react/solid';
import Card from '@components/Card';
import CancelForm from '@components/modalForms/CancelForm';
import BlockForm from '@components/modalForms/BlockForm';
import { XCircleIcon } from '@heroicons/react/outline';

const Home = () => {
  useGuard();
  const { requester } = useAxios();
  const useFetchData = () =>
    useQuery('vehicles', async () => {
      const { data } = await requester.get('/registered-vehicle/get/');
      return data.data;
    });

  const [openModal, setOpenModal] = useState(false);
  const [modal, setModal] = React.useState('');
  const [idVehicle, setIdVehicle] = React.useState('');
  const [idTag, setIdTag] = React.useState('');
  const [rows, setRows] = useState([]);

  const userInfo = useSelector((state: any) => state.loginUser?.user_info);
  const transits = useSelector((state: any) => state.loginUser?.transits);
  const balance = useSelector(
    (state: any) => state.loginUser?.account_info?.nominal_balance
  );
  const { data, isLoading } = useFetchData();

  // const handleRecharge = () => {
  //   setOpenModal(true);
  //   setModal('recharge');
  // };

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
    {
      id: '1',
      key: 'make',
      header: 'Marca',
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
    {
      id: '5',
      key: 'tag_serial',
      header: 'Tag asociado',
    },
    {
      id: '6',
      key: 'active',
      header: 'Habilitado',
    },
    {
      id: '7',
      key: 'actions',
      header: 'Acciones',
    },
  ];

  useEffect(() => {
    if (data) {
      const rows = data.map(
        ({ id, make, model, license_plate, category, tag_id, active }) => {
          return {
            make,
            model,
            license_plate,
            category_title: category.title ? category.title : {},
            tag_serial: tag_id.tag_serial ? tag_id.tag_serial : {},
            enabled: true,
            active: active ? (
              <div className="rounded-full bg-green-300/50 py-0.5 text-center text-emerald-600">
                {' '}
                Activo{' '}
              </div>
            ) : (
              <div className=" rounded-full bg-red-300/50 py-0.5 text-center text-red-600">
                {' '}
                Inactivo{' '}
              </div>
            ),

            actions: (
              <div className="flex space-x-3">
                <button onClick={handleDisabled} data-id={id}>
                  <MinusCircleIcon
                    className={`h-6 ${
                      active
                        ? 'text-emerald-500/60 hover:text-emerald-500/90'
                        : 'text-red-500/60'
                    } `}
                  />
                </button>
                <button onClick={handleCancel} data-tag={tag_id.id}>
                  <XCircleIcon className="h-6 text-rose-400 hover:text-rose-500" />
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
  }, [data]);

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
      <div className="mt-24 w-full">
        <div className="mb-10 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl capitalize tracking-wide text-gray-800">
              Bienvenido, {userInfo?.first_name} {''} {userInfo?.last_name}
            </h2>
            {/* <button
              onClick={handleRecharge}
              className="cursor-pointer rounded-lg bg-emerald-600/70 px-4 py-2 text-center font-medium text-white shadow-md hover:bg-emerald-600/50 focus:outline-none focus:ring focus:ring-emerald-600/50 focus:ring-opacity-80 focus:ring-offset-2"
            >
              Recargar
            </button> */}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Card
              title={'Saldo actual'}
              data={`Bs ${balance}`}
              icon={
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/30">
                  <CashIcon className="h-7 w-7 text-emerald-600" />
                </div>
              }
              moreInfo={true}
            />
            <Card
              title={'Vehículos'}
              data={userInfo?.vehicles}
              icon={
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/30">
                  <TruckIcon className="h-7 w-7 text-amber-600" />
                </div>
              }
              moreInfo={true}
            />
            <Card
              title={'Tránsitos'}
              data={transits}
              icon={
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/30">
                  <InformationCircleIcon className="h-7 w-7 text-indigo-600" />
                </div>
              }
              moreInfo={true}
            />
            {/* <div className="h-36 rounded-xl shadow-md">
              <div className="flex h-4/6 items-center space-x-6 rounded-t-xl bg-white px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/30">
                  <CashIcon className="h-7 w-7 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-md text-gray-600">Saldo actual</h2>
                  <h2 className="text-xl font-medium">Bs {balance}</h2>
                </div>
              </div>
              <Link href="/recharges">
                <div className="flex h-2/6 items-center rounded-b-xl bg-gray-100 px-6 text-emerald-600 decoration-emerald-600 decoration-2 hover:underline">
                  <h4 className="text-sm font-normal">Más información</h4>
                  <ChevronRightIcon className="h-4 w-4" />
                </div>
              </Link>
            </div>
            <div className="h-36 rounded-xl shadow-md">
              <div className="flex h-4/6 items-center space-x-6 rounded-t-xl bg-white px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/30">
                  <TruckIcon className="h-7 w-7 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-md text-gray-600">Vehículos</h2>
                  <h2 className="text-xl font-medium">{vehicle}</h2>
                </div>
              </div>
              <Link href="/vehicles">
                <div className="flex h-2/6 items-center rounded-b-xl bg-gray-100 px-6 text-emerald-600 decoration-emerald-600 decoration-2 hover:underline">
                  <h4 className="text-sm font-normal">Más información</h4>
                  <ChevronRightIcon className="h-4 w-4" />
                </div>
              </Link>
            </div>
            <div className="h-36 rounded-xl shadow-md">
              <div className="flex h-4/6 items-center space-x-6 rounded-t-xl bg-white px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/30">
                  <SupportIcon className="h-7 w-7 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-md text-gray-600">Tránsitos</h2>
                  <h2 className="text-xl font-medium">12750</h2>
                </div>
              </div>
              <Link href="/transit">
                <div className="flex h-2/6 items-center rounded-b-xl bg-gray-100 px-6 text-emerald-600 decoration-emerald-600 decoration-2 hover:underline">
                  <h4 className="text-sm font-normal">Más información</h4>
                  <ChevronRightIcon className="h-4 w-4" />
                </div>
              </Link>
            </div> */}
          </div>
        </div>
        <div className="space-y-8">
          <h2 className="text-2xl tracking-wide text-gray-800">
            Vehículos Asociados
          </h2>
          <Table headers={headers} data={rows} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default Home;
