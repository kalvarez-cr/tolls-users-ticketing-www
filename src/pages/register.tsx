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
import Select from '@components/inputs/Select';
import FooterLayout from '@layouts/FooterLayout';
// import Link from 'next/link';
// import Captcha from 'demos-react-captcha';



interface Inputs {
  email: string;
  // password: string;
  doc_number:string 
  phone_number: string 
  doc_type: string
  last_name: string 
  first_name: string 
}

const methodsP = [
  {
    value: 'V',
    label: 'V',
  },
  {
    value: 'J',
    label: 'J',
  },
  {
    value: 'G',
    label: 'G',
  },
];




const Schema = yup.object().shape({
  last_name: yup.string() .max(50, "Máximo 50 carácteres").required('Este campo es requerido'),
  first_name: yup.string() .max(50, "Máximo 50 carácteres").required('Este campo es requerido'),
  
  phone_number: yup
  .string()
  .matches(/[0-9]\d*$/, "Debe ser un número válido ")
  .min(11, "Mínimo 11 carácteres")
  .max(20, "Máximo 20 carácteres")
  .required("Este campo es requerido"),
  doc_type: yup.string().required('Este campo es requerido'),
  doc_number: yup
  .string()
  .matches(/[0-9]\d*$/, "Debe ser un número válido ")
  .min(7, "Debe tener mínimo 7 caracteres")
  .max(12, "Debe tener máximo 12 caracteres")
  .required("Este campo es requerido"),
  email: yup.string().email('Debe ser un email').required('Este campo es requerido'),
  // password: yup
  //   .string()
  //   .min(6, 'Mínimo 6 caracteres')
  //   .max(20, 'Máximo 20 caracteres')
  //   .required('Este campo es requerido'),
  // captcha: yup.boolean().required('Este c'),
});

const Register = () => {
  const router = useRouter();
  const { requester } = useAxios();
  const dispatch = useAppDispatch();
  // const [captcha, setCaptcha] = useState(false);
  // const [showPassword, setShowPassword] = React.useState<boolean>(false);
  // const handleShowPassword = () => {
  //   setShowPassword(!showPassword);
  // };

  const { mutate, isLoading } = useMutation(
    (formData: Inputs) => {
      return requester({
        method: 'POST',
        data: formData,
        url: '/account-holder/create/',
      });
    },
    {
      onSuccess: () => {
       

        dispatch(open({ text: 'Registro exitoso', type: 'success' }));
        router.push('/').then();
      },
      onError: (error: AxiosError) => {
        //@ts-ignore
        dispatch(open({ text: error?.response?.data?.message  , type: 'error' }));
      },
    }
  );

  // useEffect(() => {
  //   loggedIn ? router.push('/home') : null;
  // }, [loggedIn]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(Schema),
    
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { email, doc_number, phone_number, doc_type, last_name, first_name } = data;
    //@ts-ignore
    mutate({
      email, 
      
      doc_number: `${doc_type}${doc_number}`,
      phone_number,
      last_name,
      first_name,
    });
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
            <img src="/logo-login.png" alt="logo" className="h-24 ml-8" />
          </div>
          <h1 className="motto-line">Un TAG, todas las vías</h1>
            <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
           
            <div className="mt-2">
                <InputV2
                  label="Nombre"
                  name="first_name"
                  type="text"
                  errorMessage={errors.first_name?.message}
                  register={register}
                />
              </div>
           
            <div className="mt-2">
                <InputV2
                  label="Apellido"
                  name="last_name"
                  type="text"
                  errorMessage={errors.last_name?.message}
                  register={register}
                />
              </div>
             
              <div className='flex justify-between' >
            <div className=" ">
            <Select
                label="Tipo"
                name="doc_type"
                options={methodsP}
                errorMessage={errors.doc_type?.message}
                register={register}
              />
              </div>
              
              <div className="mt-4">
                <InputV2
                  label="Documento"
                  name="doc_number"
                  type="text"
                  errorMessage={errors.doc_number?.message}
                  register={register}
                />
              </div>
              </div>
              <div className="mt-2">
                <InputV2
                  label="Correo "
                  name="email"
                  type="text"
                  errorMessage={errors.email?.message}
                  register={register}
                />
              </div>

              <div className="mt-4">
                <InputV2
                  label="Número de teléfono"
                  name="phone_number"
                  type="text"
                  errorMessage={errors.phone_number?.message}
                  register={register}
                />
              </div>
              {/* <div className="mt-8">
                <InputV2
                  label="Contraseña"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  errorMessage={errors.password?.message}
                  register={register}
                  icon={
                    <EyeIcon
                      className="h-5 w-full"
                      onClick={handleShowPassword}
                    />
                  }
                />
              </div> */}
             
              <div className="mt-6">
                <Button loading={isLoading} type="submit" text="Registrarse" />
              </div>
            </form>
            {
              <Link href="/">
                <p className="mt-1 cursor-pointer text-center text-sm">
                ¿Ya tienes una cuenta?{' '}
                  <span className="font-bold text-blue-800 decoration-2 hover:text-blue-600">
                   Ingresa 
                  </span>
                </p>
              </Link>
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
export default Register;
