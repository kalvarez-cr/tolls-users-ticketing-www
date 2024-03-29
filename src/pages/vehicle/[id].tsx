import Button from '@components/Button';
import Table from '@components/Table';
import InputV2 from '@components/inputs/InputV2';
import { PencilIcon } from '@heroicons/react/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import LandingLayout from '@layouts/LandingLayout';
import { open } from '@store/counter/snackbarReducer';
import { UseApiCall } from 'hooks/useApiCall';
import { useGuard } from 'hooks/useGuard';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { currencyFormatter } from 'utils/utils';
import * as yup from 'yup';

interface Inputs {
  model?: string;
  plate?: string;
  vehicle_category?: string;
  nickname?: string;
  year?: string;
}

const Schema = yup.object().shape({
  model: yup.string(),
  plate: yup.string(),
  vehicle: yup.string(),
  nickname: yup.string(),
  year: yup.string(),
});

const headers = [
  {
    id: '1',
    key: 'moment',
    header: 'Fecha',
  },
  {
    id: '2',
    key: 'toll_site',
    header: 'Peaje ',
  },

  {
    id: '3',
    key: 'lane',
    header: 'Canal',
  },
  {
    id: '4',
    key: 'collected_amount',
    header: 'Monto',
  },
 
];

const VehicleDetail = () => {
  useGuard();
  const [pageParam, setPageParam] = React.useState(1);
  const [countPage, setCountPage] = React.useState(1);
  const [rows, setRows] = React.useState([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const [isEditable, setIsEditable] = React.useState<boolean>(false);

  const { usePost } = UseApiCall();

  const { mutate, data: response } = usePost({
    url: 'vehicle-account/get/',

    options : {
      onSuccess : ({data}) => {
      mutateTransit({
            tag_serial: data?.tag?.tag_serial,
            page: pageParam,
            per_page: 10,
          });
      }
    }
  });

  const {
    mutate: mutateTransit,
    data: responseTransit,
    isLoading,
  } = usePost({ url: 'tag-account-movements/list/' });

  const { mutate: mutateNick } = usePost({
    url: 'vehicle-account/update/',
    options: {
      onSuccess: () => {
        dispatch(open({ text: 'Actualización exitosa', type: 'success' }));
        setIsEditable(false);
      },
    },
  });

  React.useEffect(() => {
    mutate({
      id,
    });
  }, [id]);

  React.useEffect(() => {
    mutateTransit({
      tag_serial: response?.data?.tag?.tag_serial,
      page: pageParam,
      per_page: 10,
    });
  }, [pageParam]);

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(Schema),
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    const { nickname, model } = data;
    mutateNick({
      id,
      data: {
        nickname,
        maker:model,
      },
    });
  };
  React.useEffect(() => {
    if (responseTransit && response?.data?.tag !== 'Este vehiculo no posee TagAccount.') {
      setCountPage(responseTransit?.pagination?.count);

      const table = responseTransit?.data?.map(
        ({
         
          moment,
          toll_site, 
          lane,
          collected_amount, 

          
        }) => {
          return {
            collected_amount: currencyFormatter.format(collected_amount),
            toll_site,
            lane,
            moment: new Date(moment).toLocaleDateString('es-VE'),
            
          };
        }
      );
      setRows(table);
    }
  }, [responseTransit]);

  return (
    <>
      <div className="m-10 mt-24 rounded-xl bg-gray-100 p-12 shadow-xl">
        <div className="mt-4 flex items-center justify-between md:px-16">
          <h1 className="ml-16 w-full border-grey text-center text-xl font-bold tracking-wide text-red-700">
            Detalles del vehículo
          </h1>
          <button
            type="button"
            onClick={() =>
              isEditable ? setIsEditable(false) : setIsEditable(true)
            }
          >
            <PencilIcon className=" h-5  text-gray-600 hover:text-emerald-500" />
          </button>
        </div>
        <div className=" mt-2 flex w-full md:px-16">
          <div className="flex w-full flex-wrap">
            <div className="mt-14 w-full md:w-1/2 md:pl-4">
              <InputV2
                label="Marca"
                name="model"
                type="text"
                defaultValue={response?.data?.maker}
                disabled={!isEditable}
                register={register}
                errorMessage={errors.model?.message}
              />
            </div>
            <div className="mt-14 w-full md:w-1/2 md:pl-4">
              <InputV2
                label="Placa"
                name="plate"
                type="text"
                defaultValue={response?.data?.plate}
                disabled={true}
                register={register}
                errorMessage={errors.plate?.message}
              />
            </div>
            <div className="mt-14 w-full md:w-1/2 md:pl-4">
              <InputV2
                label="Categoría"
                name="vehicle_category"
                type="text"
                defaultValue={response?.data?.fare_category}
                disabled={true}
                register={register}
                errorMessage={errors.vehicle_category?.message}
              />
            </div>

            <div className="mt-14 w-full md:w-1/2 md:pl-4">
              <InputV2
                label="Año"
                name="year"
                type="text"
                defaultValue={response?.data?.year}
                disabled={true}
                register={register}
                errorMessage={errors.year?.message}
              />
            </div>
            <div className="mt-14 w-full md:w-1/2 md:pl-4">
              <InputV2
                label="Alias"
                name="nickname"
                type="text"
                defaultValue={response?.data?.nickname}
                disabled={!isEditable}
                register={register}
                errorMessage={errors.nickname?.message}
              />
            </div>

            {isEditable ? (
              <div className="mt-14 ml-2 w-1/3">
                <Button
                  text="Actualizar"
                  type="button"
                  loading={false}
                  onClick={handleSubmit(onSubmit)}
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex justify-between md:justify-end md:gap-10">
          <input
            onClick={() => router.back()}
            value="Volver"
            className="  mt-14 w-32 cursor-pointer  rounded bg-red-600/70 px-4 py-2 text-center font-semibold text-white shadow-md hover:bg-red-600/50 focus:outline-none focus:ring focus:ring-red-600/50 focus:ring-opacity-80 focus:ring-offset-2"
          />
        </div>

        <div className="mt-16">
          <h2 className="sub-header-text my-4 text-xl ">
            Tránsitos del vehículo{' '}
          </h2>

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

VehicleDetail.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default VehicleDetail;
