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
import { UserCircleIcon, PencilAltIcon } from '@heroicons/react/solid';
import { useSelector } from 'react-redux';
import { useGuard } from 'hooks/useGuard';
import { useAxios } from 'hooks/useAxios';

interface Inputs {
  password: string;
  phone_number: string;
}
const Schema = yup.object().shape({
  phone_number: yup
    .number()
    // .test('len', 'Debe ser 11 dígitos', (val) => val.toString().length === 11)
    .max(11, 'Deben ser 11 dígitos')
    .min(11, 'Deben ser 11 dígitos')
    .typeError('Debe ser un número')
    .required('Este campo es requerido'),
  password: yup
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .max(12, 'Máximo 12 caracteres')
    .required('Este campo es requerido'),
  confirm_password: yup
    .string()
    .required('Este campo es requerido')
    .oneOf([yup.ref('password'), 'Las contraseñas deben coincidir']),
});

const User = () => {
  useGuard();
  const [isEditable, setIsEditable] = useState(false);
  const name = useSelector(
    (state: any) => state.loginUser?.user_info?.first_name
  );
  const lastName = useSelector(
    (state: any) => state.loginUser?.user_info?.last_name
  );
  const email = useSelector((state: any) => state.loginUser?.user_info?.email);

  const phoneNumber = useSelector(
    (state: any) => state.loginUser?.user_info?.phone_number
  );

  const { requester } = useAxios();
  const dispatch = useAppDispatch();
  const { mutate } = useMutation(
    (formData: Inputs) => {
      return requester({
        method: 'POST',
        data: formData,
        url: 'account-holder/update/',
      });
    },
    {
      onSuccess: (response) => {
        const { data } = response;
        console.log('response data', data);
      },
      onError: (error: AxiosError) => {
        console.log(error.response.data);
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
      <div className="flex items-center justify-between">
        <div className="border-r-2">
          <UserCircleIcon className="mr-16 h-20 pr-10 text-gray-500" />
        </div>
        <h1 className="ml-16 w-full text-center text-4xl font-bold tracking-wide">
          {name} {''} {lastName}
        </h1>
      </div>
      <div className="mt-16 flex flex-col">
        <div className="mt-6 flex items-center">
          <h3 className="mr-4 text-lg  font-bold">Correo:</h3>
          <h3 className="mr-auto text-lg">{email}</h3>
        </div>
        <div className="mt-10 flex items-start">
          {isEditable ? (
            <form className="mr-auto" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col items-start">
                <InputV2
                  label="Teléfono celular"
                  name="phone_number"
                  type="text"
                  errorMessage={errors.phone_number?.message}
                  register={register}
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
              <input
                type="submit"
                value="Confirmar"
                className="mt-14 block cursor-pointer rounded bg-emerald-600/70 px-4 py-2 text-center font-semibold text-white shadow-md hover:bg-emerald-600/50 focus:outline-none focus:ring focus:ring-emerald-600/50 focus:ring-opacity-80 focus:ring-offset-2"
              />
            </form>
          ) : (
            <>
              <h3 className="mr-4 text-lg font-bold">Teléfono:</h3>
              <h3 className="mr-auto text-lg">{phoneNumber}</h3>
            </>
          )}

          <button
            type="button"
            onClick={() =>
              isEditable ? setIsEditable(false) : setIsEditable(true)
            }
          >
            <PencilAltIcon className="h-5 text-gray-600 hover:text-emerald-500" />
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
