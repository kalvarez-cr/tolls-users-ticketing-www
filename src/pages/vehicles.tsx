import React, { ReactElement, useEffect, useState } from 'react';
import LandingLayout from '@layouts/LandingLayout';
import Table from '@components/Table';
import { Switch } from '@headlessui/react';
import { XIcon, TruckIcon, CalendarIcon } from '@heroicons/react/outline';
import { useQuery } from 'react-query';
import { useGuard } from 'hooks/useGuard';
import { useAxios } from 'hooks/useAxios';

const { requester } = useAxios();

const useFetchData = () =>
  useQuery('vehicles', async () => {
    const { data } = await requester.get('/registered-vehicle/get/');
    return data.data;
  });

const Vehicles = () => {
  useGuard();
  // const [loading, setLoading] = useState<boolean>(false);
  const [enabled, setEnabled] = useState(false);
  const [rows, setRows] = useState([]);
  const { data } = useFetchData();

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
      key: 'actions',
      header: '',
    },
  ];

  useEffect(() => {
    if (data) {
      const rows = data.map(
        ({ make, model, license_plate, category, tag_id }) => {
          return {
            make,
            model,
            license_plate,
            category_title: category.title,
            tag_serial: tag_id.tag_serial,
            actions: (
              <div className="flex items-center space-x-3">
                <Switch
                  checked={enabled}
                  onChange={setEnabled}
                  className={`${
                    enabled ? 'bg-emerald-700/50' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span className="sr-only">Deshabilitar vehículo</span>
                  <span
                    className={`transform transition duration-200 ease-in-out ${
                      enabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white`}
                  />
                </Switch>
                <XIcon className="h-6 text-rose-400" />
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
                  <h2 className="text-2xl font-medium">3</h2>
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
