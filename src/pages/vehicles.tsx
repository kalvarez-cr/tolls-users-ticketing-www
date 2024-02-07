import React, { ReactElement, useEffect, useState } from 'react';
import LandingLayout from '@layouts/LandingLayout';
import Table from '@components/Table';
import { useGuard } from 'hooks/useGuard';
import Card from '@components/Card';
import BlockForm from '@components/modalForms/BlockForm';
import { UseApiCall } from 'hooks/useApiCall';
import {
  EyeIcon,
  FilterIcon,
  MinusCircleIcon,
  RewindIcon,
  PlusIcon,
} from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import SimpleContainer from '@components/SimpleContainer';
import Modal from '@components/Modal';
import FilterForm, {
  FilterVehiclesFormSchema,
  TFilterVehiclesFormInputs,
} from '@components/vehicles/filterForm';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

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

const Vehicles = () => {
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

  const { useGet, usePost } = UseApiCall();

  const { data: dataVehicle, isLoading: isLoadingVehicle } = useGet({
    queryKey: 'getVehicle',
    url: '/dashboard/count_vehicle/',
  });

  const { data: dataTotal, isLoading: isLoadingTotal } = useGet({
    queryKey: 'getTotals',
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
        ({
          id,
          maker,
          model,
          plate,
          fare_category,
          vin,
          status,
          nickname,
        }) => {
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
      {modal === 'block' ? (
        <BlockForm
          open={openModal}
          setOpen={setOpenModal}
          idTag={idTag}
          status={active}
        />
      ) : null}
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
      <div className="mx-6 mt-24 w-full ">
        <div className="mb-10 space-y-8">
          <h2 className="sub-header-text text-3xl">Vehículos Asociados</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            <Card
              title={'Vehículos'}
              data={
                dataVehicle?.data?.data?.vehicles
                  ? dataVehicle?.data?.data?.vehicles
                  : 'No hay vehículo'
              }
              isLoading={isLoadingVehicle}
              icon={
                <div className="flex h-10 w-10 items-center">
                  <img
                    src="/icon-car.png"
                    alt="Vehículos"
                    className="card-icon"
                  />
                </div>
              }
              moreInfo={false}
              link=""
            />
            <Card
              title={'Último tag usado'}
              data={
                dataTotal?.data?.data?.last_transit?.tag_serial
                  ? dataTotal?.data?.data?.last_transit?.tag_serial
                  : 'No se ha usado'
              }
              isLoading={isLoadingTotal}
              icon={
                <div className="flex h-10 w-10 items-center">
                  <img
                    src="/icon-cal-tag.png"
                    alt="Último Tag"
                    className="card-icon"
                  />
                </div>
              }
              moreInfo={false}
              link=""
            />
            <Card
              title={'Último peaje transitado'}
              data={
                dataTotal?.data?.data?.last_transit?.toll_site
                  ? dataTotal?.data?.data?.last_transit?.toll_site
                  : 'No hay tránsitos'
              }
              isLoading={isLoadingTotal}
              icon={
                <div className="flex h-10 w-10 items-center">
                  <img
                    src="/icon-cal-car.png"
                    alt="Último Registro"
                    className="card-icon"
                  />
                </div>
              }
              moreInfo={false}
              link=""
            />
          </div>
        </div>
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
      className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 p-4"
      onClick={handleCreateVehicle}
    >
      <PlusIcon className="w-10 text-white" />
    </button>
    
  </div>
</div>

      </div>
    </>
  );
};

Vehicles.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default Vehicles;
