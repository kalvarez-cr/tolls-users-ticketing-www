import InputV2 from '@components/inputs/InputV2';
import { CreditCardIcon, UserCircleIcon } from '@heroicons/react/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Select from '@components/inputs/Select';
import { useAxios } from 'hooks/useAxios';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';
import { useAppDispatch } from '@store/hooks';
import { open } from '@store/counter/snackbarReducer';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { useGuard } from 'hooks/useGuard';
import ConfirmationSmsForm from '@components/modalForms/ConfirmationSmsForm';
import { useSelector } from 'react-redux';
import Logo from '@components/icons/Logo';

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
  channel?: string;
  paymentMethod: string;
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
  paymentMethod: yup.string().required('Este campo es requerido'),
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

const payments = [
  {
    label: 'Ahorro',
    value: '1',
  },
  {
    label: 'Corriente',
    value: '2',
  },
  {
    label: 'Crédito Visa',
    value: '3',
  },
  {
    label: 'Crédito MasterCard',
    value: '4',
  },
];

const prepay = () => {
  const { requester } = useAxios();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [token, SetToken] = React.useState('');
  const [modal, setModal] = React.useState('');
  const account = useSelector(
    (state: any) => state.loginUser?.account_info?.account_number
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(Schema),
  });

  const { mutate, isLoading } = useMutation(
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
          SetToken(data.data.paymentId);
        }
      },
      onError: (error: AxiosError) => {
        dispatch(open({ text: 'Ha ocurrido un error', type: 'error' }));
      },
    }
  );

  const onSubmit: SubmitHandler<any> = async (data) => {
    const {
      letter,
      number,
      amount,
      description,
      code,
      phone,
      title,
      email,
      paymentMethod,
    } = data;

    mutate({
      letter,
      number,
      amount,

      title,
      description,
      email,
      cellphone: `${code}${phone}`,
      paymentMethod,
    });
  };

  return (
    <>
      <div className="container m-10 mx-auto mt-24 rounded-xl bg-gray-100 p-12 px-4 shadow-xl">
        <div className="mb-5 flex w-full items-center justify-center">
          <Logo className="w-36" />
        </div>

        <div className="mt-8 mb-10 flex flex-wrap md:px-16">
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
            <Select
              label="Tipo de cuenta"
              name="paymentMethod"
              options={payments}
              // errorMessage={errors.nif_type?.message}
              register={register}
            />
          </div>
          <div className=" w-full pr-4 md:w-1/2">
            <Select
              label="Peaje"
              name="paymentMethod"
              options={payments}
              // errorMessage={errors.nif_type?.message}
              register={register}
            />
          </div>

          <div className="w-full pr-4 md:w-1/2">
            <Select
              label="Tarifa"
              name="paymentMethod"
              options={payments}
              // errorMessage={errors.nif_type?.message}
              register={register}
            />
          </div>
          <div className="my-2 w-1/2  items-center  md:w-1/2">
            <InputV2
              label="Monto"
              name="phone"
              type="text"
              errorMessage={errors.phone?.message}
              register={register}
              defaultValue={'monto'}
              disabled={true}
            />
          </div>

          <div className="-mt-8 ml-6 justify-end">
            <input
              type="button"
              value="Enviar"
              onClick={handleSubmit(onSubmit)}
              className={`mt-14 cursor-pointer rounded bg-emerald-600/70 px-4 py-2 text-center font-semibold text-white shadow-md hover:bg-emerald-600/50  
          ${
            isLoading
              ? 'animate-pulse bg-slate-400 '
              : ' font-bold transition-all delay-100 duration-200 hover:bg-emerald-600/70 hover:text-white  '
          }`}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between md:px-16">
          <div className="border-r-2">
            <CreditCardIcon className="mr-16 h-10 text-red-700" />
          </div>
          <h1 className="ml-16 w-full border-grey text-xl font-bold tracking-wide text-red-700">
            Ingrese el código recibido
          </h1>
        </div>
        <div className=" mt-2 flex w-full md:px-16">
          <div className="flex w-full flex-wrap">
            <div className="mt-10 w-full md:w-1/2 md:pl-4">
              <InputV2
                label="Código"
                name="amount"
                type="text"
                errorMessage={errors.amount?.message}
                register={register}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between md:justify-center md:gap-10">
          <input
            type="button"
            value="Confirmar"
            onClick={handleSubmit(onSubmit)}
            className={`mt-14 cursor-pointer rounded bg-emerald-600/70 px-4 py-2 text-center font-semibold text-white shadow-md hover:bg-emerald-600/50  
          ${
            isLoading
              ? 'animate-pulse bg-slate-400 '
              : ' font-bold transition-all delay-100 duration-200 hover:bg-emerald-600/70 hover:text-white  '
          }`}
          />
        </div>
      </div>
    </>
  );
};

export default prepay;
