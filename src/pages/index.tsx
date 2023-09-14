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
    .min(8, 'Mínimo 8 caracteres')
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
        dispatch(open({ text: error.response.statusText, type: 'error' }));
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
    <div className="flex items-center bg-gradient-to-b from-cyan-100 to-cyan-500">
      <div className="flex h-screen w-screen flex-col justify-between">
        <div className="login-background">
          <img
            className="nube-1"
            src="/movil-diagrama-nubes.png"
            alt="nubes"
          />
          <img
            className="nube-2"
            src="/movil-diagrama-nubes.png"
            alt="nubes"
          />
          <img
            className="nube-3"
            src="/movil-diagrama-nubes.png"
            alt="nubes"
          />
          <img
            className="nube-4"
            src="/movil-diagrama-nubes.png"
            alt="nubes"
          />
          <img
            className="nube-5"
            src="/movil-diagrama-nubes.png"
            alt="nubes"
          />
        </div>
        <div className="login-form mx-auto my-auto items-center justify-center">
          <div className="header"></div>
          <div className="left-column"></div>
          <div className="right-column"></div>
          <div>
            <div className="">
              <img src="/logo-login.png" alt="logo" className="logo" />
            </div>
            <h1 className="motto-line">Un TAG, todas las vías</h1>
            <form className="mt-12" onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-16">
                <InputV2
                  label="Documento de identidad"
                  name="usernameOrEmail"
                  type="text"
                  errorMessage={errors.usernameOrEmail?.message}
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
              {/* <div className="my-2 flex items-center justify-center">
                <Captcha placeholder="Enter captcha" onChange={handleCaptcha} />
              </div> */}
              <div className="mt-8">
                <Button loading={isLoading} type="submit" text="Ingresar" />
              </div>
            </form>
            {/* {
              <Link href="register">
                <p className="mt-4 cursor-pointer text-center text-sm">
                  No tienes una cuenta?{' '}
                  <span className="font-bold text-blue-800 decoration-2 hover:text-blue-600">
                    Regístrate
                  </span>
                </p>
              </Link>
            } */}
          </div>
          <div className="footer"></div>
        </div>

        <div className="bottom-space-reserved"></div>
      </div>

      <div className="login-right-panel hidden w-full lg:block">
        <img src="/login-carro-peaje-2.svg" alt="peaje" />
      </div>

      <div className="login-right-panel-md lg:hidden">
        <img src="/login-carro-peaje-3.svg" alt="peaje" />
      </div>

      <div className="login-logo-box-md lg:hidden">
        <img src="/login-logo-box.svg" alt="logos" />
      </div>
    </div>
  );
};

// noinspection JSUnusedGlobalSymbols
export default Index;
