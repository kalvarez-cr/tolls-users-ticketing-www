import React, { useEffect } from 'react';
import InputV2 from '@components/inputs/InputV2';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { login, loginUser } from '@store/counter/loginReducer';
import { open } from '@store/counter/snackbarReducer';
import { AxiosError } from 'axios';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAxios } from 'hooks/useAxios';
import Button from '@components/Button';
import { EyeIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import FooterLayout from '@layouts/FooterLayout';
// import Link from 'next/link';
// import Captcha from 'demos-react-captcha';

const IS_PROD = process.env.NODE_ENV == 'production';
const DEFAULT_USERNAME = IS_PROD
  ? ''
  : process.env.NEXT_PUBLIC_DEFAULT_USERNAME;
const DEFAULT_PASSWORD = IS_PROD
  ? ''
  : process.env.NEXT_PUBLIC_DEFAULT_PASSWORD;

interface Inputs {
  usernameOrEmail: string;
  password: string;
}

const initialValues = {
  name: IS_PROD ? '' : DEFAULT_USERNAME,
  password: IS_PROD ? '' : DEFAULT_PASSWORD,
};

const Schema = yup.object().shape({
  usernameOrEmail: yup.string().required('Este campo es requerido'),
  password: yup
    .string()
    .min(6, 'Mínimo 6 caracteres')
    .max(20, 'Máximo 20 caracteres')
    .required('Este campo es requerido'),
  // captcha: yup.boolean().required('Este c'),
});

const Index = () => {
  const router = useRouter();
  const { requester } = useAxios();
  const dispatch = useAppDispatch();
  const [items] = React.useState(initialValues);
  const { loggedIn } = useAppSelector(loginUser);
  // const [captcha, setCaptcha] = useState(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const { mutate, isLoading } = useMutation(
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
        router.push('/home').then();
      },
      onError: (error: AxiosError) => {
        dispatch(open({ text: 'Ha ocurrido un error', type: 'error' }));
      },
    }
  );

  useEffect(() => {
    loggedIn ? router.push('/home') : null;
  }, [loggedIn]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(Schema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { usernameOrEmail, password } = data;
    mutate({ usernameOrEmail, password });
  };

  // const handleCaptcha = (value: boolean) => {
  //   setCaptcha(value);
  // };

  return (
    <div className="flex items-center bg-gradient-to-r from-sky-50 to-sky-200">
      <FooterLayout>
        <div className="mx-auto my-auto flex flex-col items-center justify-center rounded-2xl bg-white/70 p-10 shadow-2xl">
          <div>
            <div className=" w-full">
              <img src="/logo-login.png" alt="logo" className="ml-8 h-24" />
            </div>
            <h1 className="motto-line">Un TAG, todas las vías</h1>
            <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-14">
                <InputV2
                  label="Documento de identidad"
                  name="usernameOrEmail"
                  type="text"
                  errorMessage={errors.usernameOrEmail?.message}
                  register={register}
                  defaultValue={items.name}
                />
              </div>
              <div className="mt-12">
                <InputV2
                  label="Contraseña"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  errorMessage={errors.password?.message}
                  register={register}
                  defaultValue={items.password}
                  icon={
                    <EyeIcon
                      className="h-5 w-full"
                      onClick={handleShowPassword}
                    />
                  }
                />
              </div>

              <div className="mt-8">
                <Button loading={isLoading} type="submit" text="Ingresar" />
              </div>
            </form>
            {
              <>
                <Link href="password">
                  <p className="mt-4 cursor-pointer text-center text-sm">
                    ¿Olvidaste tu contraseña?{' '}
                    <span className="font-bold text-blue-800 decoration-2 hover:text-blue-600">
                      Click aquí
                    </span>
                  </p>
                </Link>

                <Link href="register">
                  <p className="mt-5 cursor-pointer text-center text-sm">
                    ¿No tienes una cuenta?{' '}
                    <span className="font-bold text-blue-800 decoration-2 hover:text-blue-600">
                      Registrate
                    </span>
                  </p>
                </Link>
              </>
            }
          </div>
        </div>
      </FooterLayout>
      <div className=" hidden w-full lg:block">
        <img className="aspect-1 max-h-screen" src="/login.svg" alt="login" />
      </div>
    </div>
  );
};

// noinspection JSUnusedGlobalSymbols
export default Index;
