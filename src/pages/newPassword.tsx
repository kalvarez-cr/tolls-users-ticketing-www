import React from 'react'
import FooterLayout from '@layouts/FooterLayout';
import InputV2 from '@components/inputs/InputV2';
import { useAppDispatch } from '@store/hooks';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { requester } from 'utils/requester';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { open } from '@store/counter/snackbarReducer';
import { AxiosError } from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '@components/Button';



interface Inputs {
  password: string;
  old_password: string;
}
const Schema = yup.object().shape({
  password: yup
    .string()
    .min(6, 'Mínimo 6 caracteres')
    .max(12, 'Máximo 12 caracteres')
    .required('Este campo es requerido'),
  confirm_password: yup
    .string()
    .required('Este campo es requerido')
    .oneOf([yup.ref('password'), 'Las contraseñas deben coincidir']),
  old_password: yup.string().required('Este campo es requerido'),
});


const newPassword = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { mutate , isLoading } = useMutation(
    (formData: Inputs) => {
      return requester({
        method: 'POST',
        data: formData,
        url: 'account-holder/update-password/',
      });
    },
    {
      onSuccess: (response) => {
        const { data } = response;
        if (data) {
          
          dispatch(
            open({
              text: 'Actualización exitosa, sera redirido al login',
              type: 'success',
            })
          );
          setTimeout(() => {
            
            router.push('/');
          }, 3000);
         
        }
      },
      onError: (error: AxiosError) => {
       
        dispatch(open({ text: 'Ha ocurrido un error', type: 'error' }));
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
    const { password, old_password } = data;
    mutate({ password, old_password });
  };

  return (
    <div className="flex items-center bg-gradient-to-r from-sky-50 to-sky-200">
    <FooterLayout>
      <div className="mx-auto my-auto flex flex-col items-center justify-center rounded-2xl bg-white/70 p-10 shadow-2xl">
        <div>
          <div className=" w-full">
            <img src="/logo-login.png" alt="logo" className="h-24 ml-8" />
          </div>
          <h1 className="motto-line">Un TAG, todas las vías</h1>
          <form className="mr-auto" onSubmit={handleSubmit(onSubmit)}>
        
          <div className="mt-10 flex flex-col items-center">
            <div className=" mt-8">
              <InputV2
                label="Antigua contraseña"
                name="old_password"
                type="text"
                errorMessage={errors.password?.message}
                register={register}
              />
            </div>
            <div className="mt-8 ">
              <InputV2
                label="Nueva contraseña"
                name="password"
                type="text"
                errorMessage={errors.password?.message}
                register={register}
              />
            </div>
            <div className="mt-8 ">
              <InputV2
                label="Confirmar contraseña"
                name="confirm_password"
                type="text"
                errorMessage={
                  // @ts-ignore
                  errors.confirm_password && 'Las contraseñas deben coincidir'
                }
                register={register}
              />
            </div>

            <div className="mt-8 w-full">
                <Button loading={isLoading} type="submit" text="Cambiar contraseña" />
              </div>
          </div>
        </form>
            

        </div>
      </div>
    </FooterLayout>
    <div className=" hidden w-full lg:block">
      <img className="aspect-1 max-h-screen" src="/login.svg" alt="login" />
    </div>
  </div>
  )
}



export default newPassword