import InputV2 from '@components/inputs/InputV2';
import { CreditCardIcon } from '@heroicons/react/outline';
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
import { useGuard } from 'hooks/useGuard';
import ConfirmationForm from '@components/modalForms/ConfirmationForm';
import { useSelector } from 'react-redux';

interface Inputs {
  phone: string;
  bank_code: string;
  ci?: string;
  type?: string;
  charge_amount: string;
  identification: string;
  instrument: string;
  instrument_type: string;
}

const Schema = yup.object().shape({
  charge_amount: yup.string().required('Este campo es requerido'),
  type: yup.string().required('Este campo es requerido'),
  ci: yup
    .string()
    .min(7, 'Mínimo 7 caracteres')
    .max(9, 'Máximo 9 caracteres')
    .required('Este campo es requerido'),
  bank_code: yup.string().required('Este campo es requerido'),
  phone: yup
    .string()
    .required('Este campo es requerido')
    .min(11, 'Mínimo 11 caracteres')
    .max(20, 'Máximo 20 caracteres'),
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
  {
    value: 'G',
    label: 'G',
  },
];

const credicard = () => {
  useGuard();
  const { requester } = useAxios();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [openModal, setOpenModal] = React.useState(false);
  const [transaction, SetTransaction] = React.useState('');
  const [modal, setModal] = React.useState('');

  const banks = useSelector((state: any) => state.loginUser?.banks);
  const user_info = useSelector((state: any) => state.loginUser?.user_info);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(Schema),
    mode: 'onChange',
  });

  const { mutate, isLoading } = useMutation(
    (formData: Inputs) => {
      return requester({
        method: 'POST',
        data: formData,
        url: 'punto-ya/request-code/',
      });
    },
    {
      onSuccess: (response) => {
        const { data } = response;
        console.log(response);
        if (data) {
          setOpenModal(true);
          setModal('confirmation');
          SetTransaction(data.data.transactionId);

          setTimeout(() => {
            setOpenModal(false);
          }, 120000);
        }
      },
      onError: (error: AxiosError) => {
        dispatch(open({ text: 'Ha ocurrido un error', type: 'error' }));
      },
    }
  );

  const onSubmit: SubmitHandler<any> = async (data) => {
    const { phone, charge_amount, ci, bank_code, type } = data;

    mutate({
      phone,
      bank_code,
      charge_amount,
      identification: `${type}${ci}`,
      instrument: '01',
      instrument_type: '00',
    });
  };

  return (
    <>
      {modal === 'confirmation' ? (
        <ConfirmationForm
          openModal={openModal}
          setOpenModal={setOpenModal}
          transaction={transaction}
          ci={watch('ci')}
          type={watch('type')}
          charge_amount={watch('charge_amount')}
        />
      ) : null}

      <div className="m-10 mt-24 rounded-xl bg-gray-100 p-12 shadow-xl">
        <div className="mb-5 flex w-full items-center justify-center">
          <img
            src="/puntoYa.svg"
            alt="puntoYa-logo"
            className=" w-28 md:w-44"
          />
        </div>

        <div className="mt-4 flex items-center justify-between md:px-16">
          <div className="border-r-2">
            <CreditCardIcon className="mr-16 h-10 text-blue-700" />
          </div>
          <h1 className="ml-16 w-full border-grey text-xl font-bold tracking-wide text-blue-700">
            Recarga por pago móvil
          </h1>
        </div>
        <div className=" mt-2 flex w-full md:px-16">
          <div className="flex w-full flex-wrap">
            <div className="mt-10 mr-5 w-full  md:w-1/6">
              <Select
                label="Tipo"
                name="type"
                options={methods}
                errorMessage={errors.type?.message}
                register={register}
                defaultValue={user_info?.holder_id_doc_type}

              />
            </div>
            <div className="mt-14 w-full md:w-1/3">
              <InputV2
                label="Documento"
                name="ci"
                type="text"
                errorMessage={errors.ci?.message}
                register={register}
                defaultValue={user_info?.holder_id_number}
              />
            </div>
            <div className="mt-14 w-full md:w-1/3 md:pl-4">
              <InputV2
                label="Número de teléfono"
                name="phone"
                type="text"
                errorMessage={errors.phone?.message}
                register={register}
                defaultValue={user_info?.phone_number}
              />
            </div>
            <div className="mt-10 w-full md:w-1/3 ">
              <Select
                label="Banco"
                name="bank_code"
                options={banks}
                errorMessage={errors.bank_code?.message}
                register={register}
              />
            </div>
            <div className="mt-14 w-full md:w-1/2 md:pl-8">
              <InputV2
                label="Monto"
                name="charge_amount"
                type="text"
                errorMessage={errors.charge_amount?.message}
                register={register}
                defaultValue={'1.0'}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between md:justify-end md:gap-10">
          <input
            type="button"
            value="Confirmar"
            onClick={handleSubmit(onSubmit)}
            className={`mt-14 cursor-pointer rounded bg-blue-600/70 px-4 py-2 text-center font-semibold text-white shadow-md hover:bg-blue-600/50 
            ${
              isLoading
                ? 'animate-pulse bg-slate-400 '
                : ' font-bold transition-all delay-100 duration-200 hover:bg-blue-600/70 hover:text-white  '
            }
            
            `}
          />
          <input
            onClick={() => router.back()}
            value="Volver"
            className="  mt-14 w-32 cursor-pointer  rounded bg-red-600/70 px-4 py-2 text-center font-semibold text-white shadow-md hover:bg-red-600/50 focus:outline-none focus:ring focus:ring-red-600/50 focus:ring-opacity-80 focus:ring-offset-2"
          />
        </div>
      </div>
    </>
  );
};

credicard.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default credicard;
