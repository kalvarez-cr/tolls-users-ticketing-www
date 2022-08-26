import React, { ReactElement, useState, useEffect } from 'react';
import LandingLayout from '@layouts/LandingLayout';
import Table from '@components/Table';
import { EyeIcon } from '@heroicons/react/solid';
import {
  SupportIcon,
  CalendarIcon,
  TicketIcon,
} from '@heroicons/react/outline';
import { useGuard } from 'hooks/useGuard';

const Transit = () => {
  useGuard();
  // const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState([]);

  const headers = [
    {
      id: '1',
      key: 'date',
      header: 'Fecha',
    },
    {
      id: '2',
      key: 'vehicle',
      header: 'Vehículo',
    },
    {
      id: '3',
      key: 'license_plate',
      header: 'Placa',
    },
    {
      id: '4',
      key: 'toll',
      header: 'Peaje',
    },
    {
      id: '5',
      key: 'lane',
      header: 'Canal',
    },
    {
      id: '6',
      key: 'ticket',
      header: 'Ticket',
    },
    {
      id: '7',
      key: 'amount',
      header: 'Monto',
    },
    {
      id: '8',
      key: 'actions',
      header: 'Detalles',
    },
  ];

  const data = [
    {
      id: '1',
      date: 'DD/MM/AA',
      vehicle: 'Fiesta',
      license_plate: 'AA4-B44',
      toll: 'Punta Piedra',
      lane: 'Canal 6',
      ticket: '#129009',
      amount: 'Bs 26',
    },
    {
      id: '2',
      date: 'DD/MM/AA',
      vehicle: 'Fiesta',
      license_plate: 'AA4-B44',
      toll: 'Punta Piedra',
      lane: 'Canal 6',
      ticket: '#129009',
      amount: 'Bs 26',
    },
    {
      id: '3',
      date: 'DD/MM/AA',
      vehicle: 'Fiesta',
      license_plate: 'AA4-B44',
      toll: 'Punta Piedra',
      lane: 'Canal 6',
      ticket: '#129009',
      amount: 'Bs 26',
    },
    {
      id: '4',
      date: 'DD/MM/AA',
      vehicle: 'Fiesta',
      license_plate: 'AA4-B44',
      toll: 'Punta Piedra',
      lane: 'Canal 6',
      ticket: '#129009',
      amount: 'Bs 26',
    },
    {
      id: '5',
      date: 'DD/MM/AA',
      vehicle: 'Fiesta',
      license_plate: 'AA4-B44',
      toll: 'Punta Piedra',
      lane: 'Canal 6',
      ticket: '#129009',
      amount: 'Bs 26',
    },
    {
      id: '6',
      date: 'DD/MM/AA',
      vehicle: 'Fiesta',
      license_plate: 'AA4-B44',
      toll: 'Punta Piedra',
      lane: 'Canal 6',
      ticket: '#129009',
      amount: 'Bs 26',
    },
    {
      id: '7',
      date: 'DD/MM/AA',
      vehicle: 'Fiesta',
      license_plate: 'AA4-B44',
      toll: 'Punta Piedra',
      lane: 'Canal 6',
      ticket: '#129009',
      amount: 'Bs 26',
    },
    {
      id: '8',
      date: 'DD/MM/AA',
      vehicle: 'Fiesta',
      license_plate: 'AA4-B44',
      toll: 'Punta Piedra',
      lane: 'Canal 6',
      ticket: '#129009',
      amount: 'Bs 26',
    },
    {
      id: '9',
      date: 'DD/MM/AA',
      vehicle: 'Fiesta',
      license_plate: 'AA4-B44',
      toll: 'Punta Piedra',
      lane: 'Canal 6',
      ticket: '#129009',
      amount: 'Bs 26',
    },
  ];

  useEffect(() => {
    const rows = data.map(
      ({ id, date, vehicle, license_plate, toll, lane, ticket, amount }) => {
        return {
          id,
          date,
          vehicle,
          license_plate,
          toll,
          lane,
          ticket,
          amount,
          actions: (
            <div className="ml-8">
              <EyeIcon
                className={`h-6 cursor-pointer text-emerald-700/50 transition-all duration-150 hover:text-emerald-500`}
              />
            </div>
          ),
        };
      }
    );
    setRows(rows);
  }, []);

  return (
    <div className="mt-8 w-full">
      <div className="mb-10 space-y-8">
        <h2 className="text-3xl tracking-wide text-gray-800">
          Historial de Transítos
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-36 rounded-xl shadow-md">
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
          </div>
        </div>
      </div>
      <Table headers={headers} data={rows} />
    </div>
  );
};

Transit.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default Transit;
