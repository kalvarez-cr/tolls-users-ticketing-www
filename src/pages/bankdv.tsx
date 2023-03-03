import InputV2 from '@components/inputs/InputV2';
import { CreditCardIcon, UserCircleIcon } from '@heroicons/react/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import LandingLayout from '@layouts/LandingLayout';
import React, { ReactElement } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Select from '@components/inputs/Select';
import { useAxios } from 'hooks/useAxios';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';
import { useAppDispatch } from '@store/hooks';
import { open } from '@store/counter/snackbarReducer';
import * as yup from 'yup';
import { useRouter } from 'next/router';

interface Inputs {
  letter: string;
  number: string;
  amount: string;
  title: string;
  description: string;
  code?: string;
  phone?: string;
  email: string;
  cellphone: string;
}

const Schema = yup.object().shape({
  letter: yup.string().required('Este campo es requerido'),
  number: yup
    .string()
    .min(7, 'Mínimo 7 caracteres')
    .max(8, 'Máximo 8 caracteres')
    .required('Este campo es requerido'),
  amount: yup.string().required('Este campo es requerido'),
  title: yup.string().required('Este campo es requerido'),
  email: yup
    .string()
    .email('Debe ser un correo valido')
    .required('Este campo es requerido'),
  description: yup.string().required('Este campo es requerido'),
  code: yup.string().required('Este campo es obligatorio'),
  phone: yup.string().required('Este campo es obligatorio'),
});

const methods = [
  {
    value: 'V',
    label: 'V',
  },
  {
    value: 'P',
    label: 'P',
  },
  {
    value: 'J',
    label: 'J',
  },
  {
    value: 'E',
    label: 'E',
  },
];

const codes = [
  {
    value: '0414',
    label: '0414',
  },
  {
    value: '0424',
    label: '0424',
  },
  {
    value: '0412',
    label: '0412',
  },
  {
    value: '0416',
    label: '0416',
  },
  {
    value: '0426',
    label: '0426',
  },
];

const MobilePay = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(Schema),
  });
  const { requester } = useAxios();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { mutate } = useMutation(
    (formData: Inputs) => {
      return requester({
        method: 'POST',
        data: formData,
        url: 'external-recharge/payment_bdv_external/',
      });
    },
    {
      onSuccess: (response) => {
        const { data } = response;
        if (data) {
          router.push(`/bdv-payment/${data.data.paymentId}`);
        }
      },
      onError: (error: AxiosError) => {
        dispatch(open({ text: error.response.statusText, type: 'error' }));
      },
    }
  );

  const onSubmit: SubmitHandler<any> = async (data) => {
    const { letter, number, amount, description, code, phone, title, email } =
      data;

    mutate({
      letter,
      number,
      amount,

      title,
      description,
      email,
      cellphone: `${code}${phone}`,
    });
  };

  return (
    <div className="m-10 mt-24 rounded-xl bg-gray-100 p-12 shadow-xl">
      <div className="mb-5 flex w-full items-center justify-center">
        <img
          src="/app/metodos-de-pago-01.svg"
          alt="bdv-logo"
          className="w-28 md:w-44"
        />
        <p className="font-bold text-red-700">Banco de Venezuela</p>
      </div>
      <div className="flex items-center justify-between md:px-16">
        <div className="border-r-2">
          <UserCircleIcon className="mr-16 h-10 text-red-700" />
        </div>
        <h1 className="ml-16 w-full border-grey text-xl font-bold tracking-wide text-red-700">
          Usuario
        </h1>
      </div>
      <div className="mt-8 mb-10 flex flex-wrap md:px-16">
        {/* <div className="mt-6 flex items-center">
          <h3 className="mr-4 text-lg  font-bold">Correo:</h3>
          <h3 className="mr-auto text-lg">{'muu'}</h3>
        </div> */}
        <div className="flex w-full items-center md:w-1/2 md:pr-4">
          <div className="w-2/5 pr-4 md:w-1/3">
            <Select
              label="Tipo"
              name="letter"
              options={methods}
              // errorMessage={errors.nif?.message}
              register={register}
            />
          </div>
          <div className="w-3/5 md:w-2/3">
            <InputV2
              label="Cédula"
              name="number"
              type="text"
              errorMessage={errors.number?.message}
              register={register}
            />
          </div>
        </div>
        <div className="flex w-full items-center md:w-1/2 md:pl-4">
          <div className="w-2/5 pr-4 md:w-1/3">
            <Select
              label="04XX"
              name="code"
              options={codes}
              // errorMessage={errors.nif_type?.message}
              register={register}
            />
          </div>
          <div className="w-3/5 md:w-2/3">
            <InputV2
              label="Teléfono"
              name="phone"
              type="text"
              errorMessage={errors.phone?.message}
              register={register}
            />
          </div>
        </div>
        <div className="my-2 w-full">
          <InputV2
            label="Correo"
            name="email"
            type="text"
            errorMessage={errors.email?.message}
            register={register}
          />
        </div>

        <>
          {/* <h3 className="mr-4 text-lg font-bold">Teléfono:</h3>
            <h3 className="mr-auto text-lg">{'muu'}</h3> */}
        </>

        {/* <button type="button" onClick={() => console.log('click')}>
            <PencilAltIcon className="h-5 text-gray-600 hover:text-emerald-500" />
          </button> */}
      </div>
      <div className="mt-4 flex items-center justify-between md:px-16">
        <div className="border-r-2">
          <CreditCardIcon className="mr-16 h-10 text-red-700" />
        </div>
        <h1 className="ml-16 w-full border-grey text-xl font-bold tracking-wide text-red-700">
          Recarga
        </h1>
      </div>
      <div className=" mt-2 flex w-full md:px-16">
        {/* <div className="mt-6 flex items-center">
          <h3 className="mr-4 text-lg  font-bold">Correo:</h3>
          <h3 className="mr-auto text-lg">{'muu'}</h3>
        </div> */}
        <div className="flex w-full flex-wrap">
          <div className="mt-10 w-full md:w-1/2 md:pr-4">
            <InputV2
              label="Monto"
              name="amount"
              type="text"
              errorMessage={errors.amount?.message}
              register={register}
            />
          </div>
          <div className="mt-10 w-full md:w-1/2 md:pl-4">
            <InputV2
              label="Título"
              name="title"
              type="text"
              errorMessage={errors.title?.message}
              register={register}
            />
          </div>
          <div className="mt-10 w-full">
            <InputV2
              label="Descripción"
              name="description"
              type="text"
              errorMessage={errors.description?.message}
              register={register}
            />
          </div>
        </div>
        <>
          {/* <h3 className="mr-4 text-lg font-bold">Teléfono:</h3>
            <h3 className="mr-auto text-lg">{'muu'}</h3> */}
        </>

        {/* <button type="button" onClick={() => console.log('click')}>
            <PencilAltIcon className="h-5 text-gray-600 hover:text-emerald-500" />
          </button> */}
      </div>
      <div className="flex justify-between md:justify-end md:gap-10">
        <input
          type="button"
          value="Confirmar"
          onClick={handleSubmit(onSubmit)}
          className="mt-14 cursor-pointer rounded bg-emerald-600/70 px-4 py-2 text-center font-semibold text-white shadow-md hover:bg-emerald-600/50 focus:outline-none focus:ring focus:ring-emerald-600/50 focus:ring-opacity-80 focus:ring-offset-2"
        />
        <input
          onClick={() => router.back()}
          value="Volver"
          className="  mt-14 w-32 cursor-pointer  rounded bg-red-600/70 px-4 py-2 text-center font-semibold text-white shadow-md hover:bg-red-600/50 focus:outline-none focus:ring focus:ring-red-600/50 focus:ring-opacity-80 focus:ring-offset-2"
        />
      </div>
    </div>
  );
};

MobilePay.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default MobilePay;
