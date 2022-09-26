import React, { ReactElement, useEffect, useState } from 'react';
import LandingLayout from '@layouts/LandingLayout';
import Table from '@components/Table';
import { TruckIcon, CalendarIcon, XCircleIcon } from '@heroicons/react/outline';
import { useGuard } from 'hooks/useGuard';
import { useAxios } from 'hooks/useAxios';
import { useMutation } from 'react-query';
import { useAppDispatch } from '@store/hooks';
import { AxiosError } from 'axios';
import { open } from '@store/counter/snackbarReducer';
import { MinusCircleIcon } from '@heroicons/react/solid';
import { useSelector } from 'react-redux';
import Card from '@components/Card';
import CancelForm from '@components/modalForms/CancelForm';
import BlockForm from '@components/modalForms/BlockForm';

const Vehicles = () => {
  useGuard();

  const { requester } = useAxios();
  const dispatch = useAppDispatch();

  // const useFetchData = () =>
  //   useQuery('vehicles', async () => {
  //     const { data } = await requester.get('/registered-vehicle/get/');
  //     return data.data;
  //   });

  const [pageParam, setPageParam] = useState(1);
  const [countPage, setCountPage] = useState(1);
  const [rows, setRows] = useState([]);
  // const { data, isLoading } = useFetchData();
  const [openModal, setOpenModal] = React.useState(false);
  const [modal, setModal] = React.useState('');
  const [idVehicle, setIdVehicle] = React.useState('');
  const [idTag, setIdTag] = React.useState('');
  const vehicle = useSelector(
    (state: any) => state.loginUser?.user_info?.vehicles
  );
  const account = useSelector((state: any) => state.loginUser?.account_info);

  const {
    mutate,
    data: response,
    isLoading,
  } = useMutation(
    (account: any) => {
      return requester({
        method: 'POST',
        data: account,
        url: '/registered-vehicle/get/',
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

  React.useEffect(() => {
    mutate({ page: pageParam });
  }, [pageParam, mutate]);

  useEffect(() => {
    if (response) {
      setCountPage(response.data.count_page);
      const rows = response.data.data.map(
        ({ id, make, model, license_plate, category, tag_id, active }) => {
          return {
            make,
            model,
            license_plate,
            category_title: category?.title ? category?.title : {},
            tag_serial: tag_id?.tag_serial ? tag_id?.tag_serial : {},
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
              <div className="flex items-center space-x-3">
                <button onClick={handleDisabled} data-id={id}>
                  <MinusCircleIcon
                    className={`h-6 ${
                      active ? 'text-emerald-500/60' : 'text-red-500/60'
                    } `}
                  />
                </button>
                <button onClick={handleCancel} data-tag={tag_id.id}>
                  <XCircleIcon className="h-6 text-rose-400" />
                </button>
              </div>
            ),
          };
        }
      );
      setRows(rows);
    }
  }, [response]);

  let lastTags = account.last_use_tag?.tag_serial || 0;

  return (
    <>
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

      <div className="mt-24  w-full ">
        <div className="mb-10 space-y-8">
          <h2 className="text-3xl tracking-wide text-gray-800">
            Vehículos Asociados
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <Card
              title={'Vehículos'}
              data={vehicle}
              icon={
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/30">
                  <TruckIcon className="h-9 w-9 text-emerald-600" />
                </div>
              }
              moreInfo={false}
            />
            <Card
              title={'Último tag usado'}
              data={lastTags}
              icon={
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/30">
                  <img className="h-9 w-9" src="/nfc.svg" alt="tag" />
                </div>
              }
              moreInfo={false}
            />
            <Card
              title={'Última visita'}
              data={new Date(account?.last_use_date).toLocaleDateString(
                'es-VE'
              )}
              icon={
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/30">
                  <CalendarIcon className="h-9 w-9 text-indigo-600" />
                </div>
              }
              moreInfo={false}
            />
            {/* <div className="h-36 rounded-xl shadow-md">
              <div className="flex h-full items-center space-x-6 rounded-xl bg-white px-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/30">
                  <TruckIcon className="h-9 w-9 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg text-gray-600">Vehículos</h2>
                  <h2 className="text-2xl font-medium">{vehicle}</h2>
                </div>
              </div>
            </div>
            <div className="h-36 rounded-xl shadow-md">
              <div className="flex h-full items-center space-x-6 rounded-xl bg-white px-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/30">
                  <img className="h-9 w-9" src="/nfc.svg" alt="tag" />
                </div>
                <div>
                  <h2 className="text-lg text-gray-600">Tag activos</h2>
                  <h2 className="text-2xl font-medium">3</h2>
                </div>
              </div>
            </div>
            <div className="h-36 rounded-xl shadow-md">
              <div className="flex h-full items-center space-x-6 rounded-xl bg-white px-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/30">
                  <CalendarIcon className="h-9 w-9 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg text-gray-600">Último uso</h2>
                  <h2 className="text-2xl font-medium">10/07/2022</h2>
                </div>
              </div>
            </div> */}
          </div>
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

Vehicles.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default Vehicles;
