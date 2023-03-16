import React, { ReactElement, useEffect, useState } from 'react';
import LandingLayout from '@layouts/LandingLayout';
import Table from '@components/Table';
import { useGuard } from 'hooks/useGuard';
import Card from '@components/Card';
import CancelForm from '@components/modalForms/CancelForm';
import BlockForm from '@components/modalForms/BlockForm';
import { UseApiCall } from 'hooks/useApiCall';
import { EyeIcon, FilterIcon, MinusCircleIcon } from '@heroicons/react/outline';
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
    header: 'Vin',
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
  const [idVehicle, setIdVehicle] = React.useState('');
  const [idTag, setIdTag] = React.useState('');
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
        console.log('data', data);
        setResponseData(data);
      },
    },
  });

  const filterHookForm = useForm<TFilterVehiclesFormInputs>({
    resolver: yupResolver(FilterVehiclesFormSchema),
  });

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

  const handleEdit = (e) => {
    const id = e.currentTarget.dataset.id;
    router.push(`/vehicle/${id}`);
  };

  const handleOpenFilter = (e) => {
    e.preventDefault();
    setOpenFilter(true);
  };

  const onSubmit: SubmitHandler<TFilterVehiclesFormInputs> = async (
    inputsData: TFilterVehiclesFormInputs
  ) => {
    const { nickname } = inputsData;
    console.log(inputsData);
    // mutate({
    //   label: name,
    //   status: StatusEnum.created,
    // });
  };

  React.useEffect(() => {
    mutate({ page: pageParam, per_page: 10 });
  }, [pageParam, mutate]);

  useEffect(() => {
    if (responseData) {
      setCountPage(responseData?.pagination?.count);
      console.log();
      const rows = responseData?.data?.map(
        ({ id, make, model, plate, vehicle_category, vin, active }) => {
          return {
            make,
            model,
            license_plate: plate,
            category_title: vehicle_category,
            tag_serial: vin,
            enabled: true,
            active: active ? (
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
                  <EyeIcon className="h-6 text-rose-400 hover:text-rose-300" />
                </button>
                {/* <button onClick={handleDisabled} data-id={id}>
                  <MinusCircleIcon className="h-6 text-rose-400 hover:text-rose-300" />
                </button> */}
                {/* <button onClick={handleCancel} data-tag={tag_id.id}>
                  <XCircleIcon className="h-6 text-rose-400 hover:text-rose-300" />
                </button> */}
              </div>
            ),
          };
        }
      );
      setRows(rows);
    }
  }, [responseData]);

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
                  : 'No hay data'
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
                  : 'No hay data'
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
              title={'Último Canal'}
              data={
                dataTotal?.data?.data?.last_transit?.lane
                  ? dataTotal?.data?.data?.last_transit?.lane
                  : 'No hay data'
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
            <button onClick={handleOpenFilter}>
              <FilterIcon className="w-4" />
            </button>
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
      </div>
    </>
  );
};

Vehicles.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default Vehicles;
