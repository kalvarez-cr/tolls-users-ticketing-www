import React from 'react';
import FooterLayout from '@layouts/FooterLayout';
import LogoDark from '@components/icons/LogoDark';
import InputV2 from '@components/inputs/InputV2';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useAppDispatch } from '@store/hooks';
import { login } from '@store/counter/loginReducer';
import { open } from '@store/counter/snackbarReducer';
import { AxiosError } from 'axios';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAxios } from 'hooks/useAxios';

interface Inputs {
  email: string;
  password: string;
}
const initialValues = {
  name: 'dinojefe@mail.com',
  password: 'V20895698',
};

const Schema = yup.object().shape({
  email: yup
    .string()
    .email('Debe ser un correo válido')
    .required('Este campo es requerido'),
  password: yup
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .max(12, 'Máximo 12 caracteres')
    .required('Este campo es requerido'),
});

const Register = () => {
  const router = useRouter();
  const { requester } = useAxios();
  const dispatch = useAppDispatch();
  const [items] = React.useState(initialValues);
  const { mutate } = useMutation(
    (formData: Inputs) => {
      return requester({
        method: 'POST',
        data: formData,
        url: '/login/',
      });
    },
    {
      onSuccess: (response) => {
        const { data } = response;

        dispatch(login(data));
        router.push('/');
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
    const { email, password } = data;
    mutate({ email, password });
  };

  return (
    <div className="flex items-center bg-gradient-to-l from-emerald-700 to-emerald-100">
      <FooterLayout>
        <div className="mx-auto my-auto flex flex-col items-center justify-center rounded-2xl bg-white/75 p-10 shadow-2xl">
          <div>
            <div className=" w-full">
              <img src="/logo.svg" alt="logo" className="h-15" />
            </div>
            <h1 className="my-4 w-full text-3xl font-bold text-emerald-900">
              Bienvenido al sistema
            </h1>
            <form className="mt-12" onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-16">
                <InputV2
                  label="Correo electrónico"
                  name="email"
                  type="text"
                  errorMessage={errors.email?.message}
                  register={register}
                  defaultValue={items.name}
                />
              </div>
              <div className="mt-16">
                <InputV2
                  label="Contraseña"
                  name="password"
                  type="password"
                  errorMessage={errors.password?.message}
                  register={register}
                  defaultValue={items.password}
                />
              </div>
              <input
                type="submit"
                value="Ingresar"
                className="mt-20 block w-full cursor-pointer rounded bg-emerald-600/70 px-4 py-2 text-center font-semibold text-white shadow-md hover:bg-emerald-600/50 focus:outline-none focus:ring focus:ring-emerald-600/50 focus:ring-opacity-80 focus:ring-offset-2"
              />
            </form>
            {/* <Link href="register">
              <p className="mt-4 cursor-pointer text-center text-sm">
                No tienes una cuenta?{' '}
                <span className="underline decoration-emerald-600 decoration-2 hover:text-emerald-600">
                  Regístrate
                </span>
              </p>
            </Link> */}
          </div>
        </div>
      </FooterLayout>
      <div className=" hidden w-full lg:block">
        <img className="aspect-1 max-h-screen" src="/login.svg" alt="login" />
      </div>
    </div>
  );
};

export default Register;
