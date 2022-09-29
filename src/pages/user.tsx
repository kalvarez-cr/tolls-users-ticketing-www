import React, { ReactElement, useState } from 'react';
import LandingLayout from '@layouts/LandingLayout';
import InputV2 from '@components/inputs/InputV2';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import { useAppDispatch } from '@store/hooks';
import { AxiosError } from 'axios';
import { open } from '@store/counter/snackbarReducer';
import { logout } from '@store/counter/loginReducer';
import {
  UserCircleIcon,
  PencilIcon,
  CreditCardIcon,
  TruckIcon,
  CalendarIcon,
} from '@heroicons/react/solid';
import { useSelector } from 'react-redux';
import { useGuard } from 'hooks/useGuard';
import { useAxios } from 'hooks/useAxios';

interface Inputs {
  password: string;
  phone_number: string;
}
const Schema = yup.object().shape({
  phone_number: yup
    .string()
    // .test('len', 'Debe ser 11 dígitos', (val) => val.toString().length === 11)
    .min(11, 'Deben ser 11 dígitos')
    .max(11, 'Deben ser 11 dígitos')
    .typeError('Debe ser un número')
    .optional(),
  password: yup
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .max(8, 'Máximo 8 caracteres')
    .required('Este campo es requerido'),
  confirm_password: yup
    .string()
    .required('Este campo es requerido')
    .oneOf([yup.ref('password'), 'Las contraseñas deben coincidir']),
});

const User = () => {
  useGuard();
  const [isEditable, setIsEditable] = useState(false);
  const user_info = useSelector((state: any) => state.loginUser?.user_info);
  const account_info = useSelector(
    (state: any) => state.loginUser?.account_info
  );

  const { requester } = useAxios();
  const dispatch = useAppDispatch();
  const { mutate } = useMutation(
    (formData: Inputs) => {
      return requester({
        method: 'PUT',
        data: formData,
        url: 'account-holder/update/',
      });
    },
    {
      onSuccess: () => {
        dispatch(open({ text: 'Actualización exitosa', type: 'success' }));
        setIsEditable(false);
        setTimeout(() => {
          dispatch(logout());
        }, 2000);
      },
      onError: (error: AxiosError) => {
        dispatch(open({ text: error.response.statusText, type: 'error' }));
      },
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(Schema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { phone_number, password } = data;
    mutate({ phone_number, password });
  };

  return (
    <div className="mt-28 w-5/6 rounded-xl bg-gray-100 p-24 shadow-xl">
      <div className="flex flex-col">
        <div className="ml-72">
          <UserCircleIcon className=" h-20 text-gray-500" />
        </div>
        <h1 className=" text-center text-4xl font-bold tracking-wide">
          {user_info?.first_name} {''} {user_info?.last_name}
        </h1>
        <h3 className="mt-4 text-center text-lg">{user_info?.email}</h3>
      </div>
      <div className="mt-16 flex justify-between">
        <CreditCardIcon className=" h-12  text-teal-400 " />
        <TruckIcon className="h-12 text-gray-400" />
        <CalendarIcon className="h-12 text-red-400" />
      </div>
      <div className="mt-6 flex justify-between">
        <h3 className="text-lg">
          Bs{''}
          {''} {account_info?.nominal_balance}
        </h3>
        <h3 className="text-lg">{user_info?.vehicles}</h3>
        <h3 className="text-lg">
          {new Date(account_info?.last_use_date).toLocaleDateString('es-VE')}
        </h3>
      </div>

      <div className="flex flex-col">
        <div className="mt-12 flex items-start">
          {isEditable ? (
            <form className="mr-auto" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col items-start">
                <InputV2
                  label="Teléfono celular"
                  name="phone_number"
                  type="text"
                  errorMessage={errors.phone_number?.message}
                  register={register}
                  defaultValue={user_info?.phone_number}
                />
                <div className="mt-14 flex">
                  <InputV2
                    label="Contraseña"
                    name="password"
                    type="text"
                    errorMessage={errors.password?.message}
                    register={register}
                  />
                  <div className="ml-16">
                    <InputV2
                      label="Confirmar Contraseña"
                      name="confirm_password"
                      type="text"
                      errorMessage={
                        // @ts-ignore
                        errors.confirm_password &&
                        'Las contraseñas deben coincidir'
                      }
                      register={register}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between space-x-4">
                <input
                  type="submit"
                  value="Confirmar"
                  className="mt-14 block cursor-pointer rounded bg-emerald-600/70 px-4 py-2 text-center font-semibold text-white shadow-md hover:bg-emerald-600/50 focus:outline-none focus:ring focus:ring-emerald-600/50 focus:ring-opacity-80 focus:ring-offset-2"
                />
                <input
                  onClick={() =>
                    isEditable ? setIsEditable(false) : setIsEditable(true)
                  }
                  value="Cancelar"
                  className="mt-14 block w-32 cursor-pointer rounded bg-red-600/70 px-4 py-2 text-center font-semibold text-white shadow-md hover:bg-red-600/50 focus:outline-none focus:ring focus:ring-emerald-600/50 focus:ring-opacity-80 focus:ring-offset-2"
                />
              </div>
            </form>
          ) : (
            <>
              <h3 className="mr-4 text-lg font-bold">Teléfono:</h3>
              <h3 className="mr-auto text-lg">{user_info?.phone_number}</h3>
            </>
          )}

          <button
            type="button"
            onClick={() =>
              isEditable ? setIsEditable(false) : setIsEditable(true)
            }
          >
            <PencilIcon className="h-5 text-gray-600 hover:text-emerald-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

User.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default User;
