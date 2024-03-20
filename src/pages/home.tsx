import React, { ReactElement, useState, useEffect } from 'react';
import LandingLayout from '@layouts/LandingLayout';

import { useSelector } from 'react-redux';
import { useGuard } from 'hooks/useGuard';
import Card from '@components/Card';
import { GreetingByTime } from '../utils/requester';
import { currencyFormatter, getStatusClassName } from 'utils/utils';
import { UseApiCall } from 'hooks/useApiCall';
import Table from '@components/Table';

import {
  EyeIcon,
  FilterIcon,
  MinusCircleIcon,
  PlusIcon,
  
} from '@heroicons/react/outline';
import {CreditCardIcon, } from '@heroicons/react/solid'
import SimpleContainer from '@components/SimpleContainer';
import Modal from '@components/Modal';
import FilterForm, {
  FilterVehiclesFormSchema,
  TFilterVehiclesFormInputs,
} from '@components/vehicles/filterForm';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';


const headers = [
  {
    id: '1',
    key: 'nickname',
    header: 'Alias',
  },

  {
    id: '2',
    key: 'maker',
    header: 'Marca',
  },
  {
    id: '3',
    key: 'license_plate',
    header: 'Placa',
  },
  {
    id: '4',
    key: 'fare_category',
    header: 'Categoría',
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

const Home = () => {
  useGuard();
  const router = useRouter();
  const [pageParam, setPageParam] = useState(1);
  const [countPage, setCountPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [modal, setModal] = React.useState('');
  const [idTag, setIdTag] = React.useState('');
  const [active, setActive] = React.useState<string>();
  const [openFilter, setOpenFilter] = React.useState<boolean>(false);
  const [responseData, setResponseData] = React.useState<any>(null);

  const userInfo = useSelector((state: any) => state.loginUser?.user_info);

  const { useGet, usePost } = UseApiCall();

  const { data, isLoading: isLoadingBalance } = useGet({
    queryKey: 'getBalance',
    url: '/dashboard/account_balance/',
  });

  const { data: dataVehicle, isLoading: isLoadingVehicle } = useGet({
    queryKey: 'getVehicle',
    url: '/dashboard/count_vehicle/',
  });

  

  const { data: dataTotalTransit, isLoading: isLoadingTotalTransit } = useGet({
    queryKey: 'getTotalTransit',
    url: '/dashboard/last_transit/',
  });

  const { mutate, isLoading } = usePost({
    url: '/vehicle-account/list/',
    options: {
      onSuccess: (data) => {
        setResponseData(data);
      },
    },
  });

  const filterHookForm = useForm<TFilterVehiclesFormInputs>({
    resolver: yupResolver(FilterVehiclesFormSchema),
  });

  const handleDisabled = (e) => {
    setOpenModal(true);
    setModal('block');
    const id = e.currentTarget.dataset.id;
    const active = e.currentTarget.dataset.active;
    setIdTag(id);
    setActive(active === 'active' ? 'false' : 'active');
  };

  const handleEdit = (e) => {
    const id = e.currentTarget.dataset.id;
    router.push(`/vehicle/${id}`);
  };

  const handleOpenFilter = (e) => {
    e.preventDefault();
    setOpenFilter(true);
  };

  const handleCleanFilter = (e) => {
    e.preventDefault();
    mutate({
      per_page: 10,
      page: pageParam,
    });
    filterHookForm.reset();
    setOpenFilter(false);
  };

  const handleCreateVehicle = () => {
    router.push('/vehicle-create');
  };

  const onSubmit: SubmitHandler<TFilterVehiclesFormInputs> = async (
    inputsData: TFilterVehiclesFormInputs
  ) => {
    const { nickname, status } = inputsData;

    mutate({
      nickname,
      status,
      per_page: 10,
      page: pageParam,
    });
    setOpenFilter(false);
  };

  React.useEffect(() => {
    mutate({ page: pageParam, per_page: 10 });
  }, [pageParam, mutate]);

  useEffect(() => {
    if (responseData) {
      setCountPage(responseData?.pagination?.count);

      const rows = responseData?.data?.map(
        ({ id, maker, model, plate, fare_category, vin, status, nickname }) => {
          return {
            maker,
            model,
            license_plate: plate,
            fare_category,
            tag_serial: vin,
            enabled: true,
            nickname,
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
              <div className="flex items-center space-x-3">
                <button onClick={handleEdit} data-id={id}>
                  <EyeIcon className="h-6 text-gray-400 hover:text-gray-300" />
                </button>
                <button
                  onClick={handleDisabled}
                  data-id={id}
                  data-active={status}
                >
                  <MinusCircleIcon className="h-6 text-rose-400 hover:text-rose-300" />
                </button>
              </div>
            ),
          };
        }
      );
      setRows(rows);
    }
  }, [responseData, active]);

  return (
    <>
      <Modal
        open={openFilter}
        setOpen={setOpenFilter}
        handleAccept={filterHookForm.handleSubmit(onSubmit)}
        title="Filtro avanzado"
        acceptButtonText="Buscar"
        cancelButtonText="Cancelar"
      >
        <FilterForm useForm={filterHookForm} />
      </Modal>

      <div className="mx-6 mt-24 w-full">
        <div className="mb-10 space-y-8">
          <div className="flex items-center ">
            <h2 className="header-text text-4xl">
              {userInfo?.account_type === 'personal_account'
                ? `${GreetingByTime()}, ${userInfo?.first_name} ${
                    userInfo?.last_name
                  }`
                : `${GreetingByTime()}, ${userInfo?.company_name}`}
            </h2>
            <div
                className={` rounded-full h-5 w-5 ml-4 ${getStatusClassName(
                  data?.data?.data?.account_status
                )}`}
              >
                {/* <h4 className=" font-semibold m-auto text-white">
                  {` Cuenta ${data?.data?.data?.account_status}`}
                </h4> */}
                </div>
          </div>
          <div className=" grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            <Card
              title={'Saldo actual'}
              data={
                data?.data?.data?.account_balance
                  ? currencyFormatter.format(data?.data?.data?.account_balance)
                  : 'Cuenta sin saldo'
              }
              isLoading={isLoadingBalance}
              icon={<div className="flex h-10 w-10 items-center">
              <img
                src="/icon-wallet.svg"
                alt="saldo"
              />
            </div>}
                
            
              moreInfo={true}
              link="/recharges"
            />

<Card
            title={'Último tránsito'}
            data={
              dataTotalTransit?.data?.data?.last_transit?.toll_site
                ? dataTotalTransit?.data?.data?.last_transit?.toll_site
                : 'No hay pasos aún'
            }
            isLoading={isLoadingTotalTransit}
            icon={
              <div className="flex h-10 w-10 items-center">
                <img
                  src="/icon-last-transit.svg"
                  alt="Último peaje"
                  className=""
                />
              </div>
            }
            moreInfo={true}
            link="/transit"
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
                  <img src="/icon-car.svg" alt="saldo" className="" />
                </div>
              }
              moreInfo={true}
              link="/transit"
            />
          </div>
          {/* <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-1  md:grid-cols-3 md:gap-x-6">
            
            <div className="col-span-2 grid">
              <BarChartComponent />
            </div>

            <div className="">
              <div
                className={` mb-6 flex h-auto rounded-md p-2 ${getStatusClassName(
                  data?.data?.data?.account_status
                )}`}
              >
                <h4 className=" font-semibold m-auto text-white">
                  {`${data?.data?.data?.account_status}`}
                </h4>
              </div>

              
          <Table
          headers={headersTable}
          data={dataPieChart?.data?.data}
          isLoading={isLoadingPieChart}
          errorMessage={'No hay data disponible.'}
      
          />
            </div>
          </div>  */}
          <SimpleContainer
            title={'Vehículos Asociados'}
            rightComponent={
              <div className="flex space-x-3 ">
                <button onClick={handleOpenFilter}>
                  <FilterIcon className="w-4" />
                </button>

                <button onClick={handleCleanFilter}>
                  <img src="/broomIcon.png" alt="clean-icon" className="w-6 " />
                </button>
              </div>
            }
          >
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
          </SimpleContainer>
          <div className="fixed bottom-10 right-12 z-20">
            <div className="relative">
              <button
                className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 p-4"
                onClick={handleCreateVehicle}
              >
                <PlusIcon className="w-10 text-white" />
              </button>
            </div>
          </div>
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
