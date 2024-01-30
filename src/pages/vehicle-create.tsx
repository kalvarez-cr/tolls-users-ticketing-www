import ModalFormInfo from '@components/modalForms/ModalFormInfo';
import InputV2 from '@components/inputs/InputV2';
import Select from '@components/inputs/Select';
import { InformationCircleIcon } from '@heroicons/react/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import LandingLayout from '@layouts/LandingLayout';
import { useGuard } from 'hooks/useGuard';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import Info from '@components/icons/info';
import { open } from '@store/counter/snackbarReducer';
import { useMutation } from 'react-query';
import { requester } from 'utils/requester';
import { useAppDispatch } from '@store/hooks';
import { AxiosError } from 'axios';
import { useSelector } from 'react-redux';
import Button from '@components/Button';

interface Inputs {
  model: string;
  plate: string;
  vehicle_weight: string;
  vehicle_axles: string;
  year: string;
  fare_category: string;
  tag_serial: string;
  tag_serial_w?: string;
  color:string 
}

interface TCodeInputs {
  plate: string;
}

const Schema = yup.object().shape({
  model: yup.string().required('Este campo es requerido'),
  vehicle_weight: yup.string() .min(1, 'Debe tener 1 dígito')
  .max(7, 'Debe tener 7 digitos').required('Este campo es requerido'),
  year: yup.string() .min(4, 'Debe tener 4 digitos')
  .max(4, 'Debe tener 4 digitos').required('Este campo es requerido'),
  vehicle_axles: yup.string() .min(1, 'Debe tener 1 dígito')
  .max(1, 'Debe tener 1 dígito').required('Este campo es requerido'),
  fare_category: yup.string().required('Este campo es requerido'),
  tag_serial: yup
    .string()
    .required('Este campo es requerido')
    .min(14, 'Debe tener 14 digitos')
    .max(14, 'Debe tener 14 digitos'),
  tag_serial_w: yup
    .string()
    .oneOf([yup.ref('tag_serial')], 'Los seriales no coinciden'),
  color: yup.string().required('Este campo es requerido'), 
});

const codeFormSchema = yup.object().shape({
  plate: yup.string() .min(6, 'Mínimo debe tener 6 digitos')
  .max(7, 'Máximo debe tener 7 digitos').required('Este campo es requerido'),
});

const VehicleCreate = () => {
  useGuard();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const category = useSelector(
    (state: any) => state.loginUser?.app_setting?.fare_product
  );

  const colors = useSelector((state: any) => state.loginUser?.app_setting?.color);
  const [openModal, setOpenModal] = React.useState(false);
  const [modal, setModal] = React.useState('');

  const renamedCategories = category?.map((cat) => {
    return {
      value: cat?.id,
      label: cat?.name,
    };
  });

  const { mutate, isLoading } = useMutation(
    (formData: Inputs) => {
      return requester({
        method: 'POST',
        data: formData,
        url: 'vehicle-account/create/',
      });
    },
    {
      onSuccess: () => {
        dispatch(open({ text: 'Registro exitoso', type: 'success' }));
        router.push('/vehicles')
      },
      onError: (error: AxiosError) => {
        //@ts-ignore
        dispatch(open({ text: error?.response?.data?.message, type: 'error' }));
      },
    }
  );

  const { mutate: mutateCode, isLoading: isLoadingPlate } = useMutation(
    (Data: any) => {
      return requester({
        method: 'POST',
        data: Data,
        url: 'vehicle-account/find-plate/',
      });
    },
    {
      onSuccess: (response) => {
        const { data } = response;
        setValue('year', data?.data?.year);
        setValue('model', data?.data?.model);
        setValue('vehicle_axles', data?.data?.vehicle_axles);
        setValue('vehicle_weight', data?.data?.vehicle_weight);
      },
      onError: (error: AxiosError) => {
        dispatch(open({ text: 'Ha ocurrido un error', type: 'error' }));
      },
    }
  );

  const handleInfo = () => {
    setOpenModal(true);
    setModal('info');
  };

  const {
    register,
    handleSubmit,

    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(Schema),
    mode: 'onChange',
  });

  const {
    register: registerCode,
    formState: formStateCode,
    handleSubmit: handleSubmitCode,
    getValues,
  } = useForm<TCodeInputs>({
    resolver: yupResolver(codeFormSchema),
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const {
      year,
      model,
      vehicle_axles,
      vehicle_weight,
      fare_category,
      tag_serial,
      color,
    } = data;

    mutate({
      plate: getValues('plate'),
      year,
      model,
      vehicle_axles,
      vehicle_weight,
      fare_category,
      tag_serial,
      color
    });
  };

  const onSubmitCode: SubmitHandler<TCodeInputs> = async (
    inputsData: TCodeInputs
  ) => {
    const { plate } = inputsData;
    mutateCode({ plate: plate.toUpperCase() });
  };

  return (
    <>
      {modal === 'info' ? (
        <ModalFormInfo
          open={openModal}
          setOpen={setOpenModal}
          handleAccept={() => setOpenModal(false)}
          title="Número correcto de serial"
        >
          <Info className="" />
          <span className='mt-4 font-bold'>Nota: </span>
          <span className='mt-4'>Este proceso es solo para tag VenVías</span>

        </ModalFormInfo>
      ) : null}

      <div className="m-10 mt-24 rounded-xl bg-gray-100 p-12 shadow-xl">
        <div className="mt-4 flex items-start justify-start md:px-16">
          <h1 className="w-full border-grey  text-xl font-bold tracking-wide text-red-700">
            Datos del vehículo
          </h1>
        </div>
        <div className=" mt-2 flex w-full md:px-16">
          <div className="flex w-full flex-wrap">
            <div className="mt-14 w-full md:w-1/2 md:pl-4">
              <InputV2
                label="Placa"
                name="plate"
                type="text"
                register={registerCode}
                errorMessage={formStateCode?.errors?.plate?.message}
              />
            </div>

            <div className="mt-14 w-full md:w-1/2 md:pl-4">
            <Button
            text="Verificar INTT"
            type="button"
            loading={isLoadingPlate}
            onClick={handleSubmitCode(onSubmitCode)}
          />
            </div>

            <div className="mt-14 w-full md:w-1/2 md:pl-4">
              <InputV2
                label="Modelo"
                name="model"
                type="text"
                register={register}
                // defaultValue={responseData?.data?.model}
                errorMessage={errors.model?.message}
              />
            </div>

            <div className="mt-14 w-full md:w-1/4 md:pl-4">
              <InputV2
                label="Año"
                name="year"
                type="text"
                register={register}
                // defaultValue={responseData?.data?.year}
                errorMessage={errors.year?.message}
              />
            </div>
            <div className="mt-14 w-full md:w-1/4 md:pl-4">
              <InputV2
                label="Ejes"
                name="vehicle_axles"
                type="text"
                register={register}
                // defaultValue={responseData?.data?.vehicle_axles}
                errorMessage={errors.vehicle_axles?.message}
              />
            </div>
            <div className="mt-14 w-full md:w-1/2 md:pl-4">
              <InputV2
                label="Peso (kg)"
                name="vehicle_weight"
                type="text"
                register={register}
                // defaultValue={responseData?.data?.vehicle_weight}
                errorMessage={errors.vehicle_weight?.message}
              />
            </div>

            <div className="mt-10 w-full md:w-1/2 md:pl-4">
              <Select
                label="Categoría de cobro"
                name="fare_category"
                options={renamedCategories}
                errorMessage={errors.fare_category?.message}
                register={register}
              />
            </div>
            <div className="mt-10 w-full md:w-1/2 md:pl-4">
              <Select
                label="Color"
                name="color"
                options={colors}
                errorMessage={errors.color?.message}
                register={register}
              />
            </div>
            <div>
              {' '}
              {/* <div className="mt-8 flex items-start justify-start md:px-14">
              <h1 className="w-full border-grey text-left ml-0 text-xl font-bold tracking-wide text-red-700">
                Registrado a nombre de
              </h1>
            </div>

            <div className="mt-14 w-full md:w-1/2 md:pl-4">
              <InputV2
                label="Nombre"
                name="year"
                type="text"
                register={register}
                errorMessage={errors.year?.message}
              />
            </div>

            <div className="mt-14 w-full md:w-1/2 md:pl-4">
              <InputV2
                label="Apellido"
                name="year"
                type="text"
                register={register}
                errorMessage={errors.year?.message}
              />
            </div> */}
            </div>

            <div className="mt-8 flex items-start justify-start md:px-14">
              <h1 className=" w-full border-grey p-8 text-start text-xl font-bold tracking-wide text-red-700">
                Información del tag{' '}
              </h1>

              <InformationCircleIcon
                className="-mx-3  mt-9 w-6  cursor-pointer"
                onClick={handleInfo}
              />
            </div>

            <div className="mt-14 w-full md:w-1/2 md:pl-4">
              <InputV2
                label="Serial"
                name="tag_serial"
                type="text"
                register={register}
                errorMessage={errors.tag_serial?.message}
              />
            </div>

            <div className="mt-14 w-full md:w-1/2 md:pl-4">
              <InputV2
                label="Confirmar serial"
                name="tag_serial_w"
                type="text"
                register={register}
                errorMessage={errors.tag_serial_w?.message}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between md:justify-end md:gap-10">
         <div className='mt-14 w-32'>
         <Button
            text="Enviar"
            type="button"
            loading={isLoading}
            onClick={handleSubmit(onSubmit)}
          />
         </div>
         


         <div className='mt-14 w-32'>
         <Button
            text="Volver"
            type="button"
            loading={false}
            disabled={isLoading}
            onClick={() => router.back()}
          />
         </div>
        </div>
      </div>
    </>
  );
};

VehicleCreate.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default VehicleCreate;
