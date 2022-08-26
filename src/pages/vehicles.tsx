import React, { ReactElement, useEffect, useState } from 'react';
import LandingLayout from '@layouts/LandingLayout';
import Table from '@components/Table';
import { XIcon, TruckIcon, CalendarIcon } from '@heroicons/react/outline';
import { useMutation, useQuery } from 'react-query';
import { useGuard } from 'hooks/useGuard';
import { useAxios } from 'hooks/useAxios';
import { useAppDispatch } from '@store/hooks';
import { open } from '@store/counter/snackbarReducer';
import { MinusCircleIcon } from '@heroicons/react/solid';
import { AxiosError } from 'axios';
import { useSelector } from 'react-redux';

const { requester } = useAxios();

const useFetchData = () =>
  useQuery('vehicles', async () => {
    const { data } = await requester.get('/registered-vehicle/get/');
    return data.data;
  });

const Vehicles = () => {
  useGuard();
  const dispatch = useAppDispatch();

  const [rows, setRows] = useState([]);
  const { data } = useFetchData();
  const vehicle = useSelector(
    (state: any) => state.loginUser?.user_info?.vehicles
  );

  const { mutate } = useMutation(
    (id: any) => {
      return requester({
        method: 'POST',
        data: id,
        url: '/registered-vehicle/cancel/',
      });
    },
    {
      onSuccess: (response) => {
        const { data } = response;
        return data.data;
      },
      onError: (error: AxiosError) => {
        dispatch(open({ text: error.response.statusText, type: 'error' }));
      },
    }
  );

  const { mutate: mutate2 } = useMutation(
    (id: any) => {
      return requester({
        method: 'POST',
        data: id,
        url: '/registered-vehicle/block/',
      });
    },
    {
      onSuccess: (response) => {
        const { data } = response;
        return data.data;
      },
      onError: (error: AxiosError) => {
        dispatch(open({ text: error.response.statusText, type: 'error' }));
      },
    }
  );

  const handleCancel = (e) => {
    const id = e.currentTarget.dataset.tag;
    mutate({ id: id });
  };

  const handleDisabled = (e) => {
    const id = e.currentTarget.dataset.id;
    mutate2({ id: id });
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
            category_title: category.title,
            tag_serial: tag_id.tag_serial,
            enabled: true,
            active: active ? (
              <div className="rounded-full bg-green-500 text-center">
                {' '}
                Activo{' '}
              </div>
            ) : (
              <div className=" rounded-full bg-red-500 text-center">
                {' '}
                Inactivo{' '}
              </div>
            ),

            actions: (
              <div className="flex items-center space-x-3">
                <button onClick={handleDisabled} data-id={id}>
                  <MinusCircleIcon
                    className={`h-6 ${
                      active ? 'text-green-500' : 'text-red-400'
                    } `}
                  />
                </button>
                <button onClick={handleCancel} data-tag={tag_id.id}>
                  <XIcon className="h-6 text-rose-400" />
                </button>
              </div>
            ),
          };
        }
      );
      setRows(rows);
    }
  }, [data]);

  return (
    <>
      <div className="mt-8  w-full ">
        <div className="mb-10 space-y-8">
          <h2 className="text-3xl tracking-wide text-gray-800">
            Vehículos Asociados
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-36 rounded-xl shadow-md">
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
            </div>
          </div>
        </div>
        <Table headers={headers} data={rows} />
      </div>
    </>
  );
};

Vehicles.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default Vehicles;
