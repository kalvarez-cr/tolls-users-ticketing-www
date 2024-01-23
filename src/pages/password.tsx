import React from 'react';
import InputV2 from '@components/inputs/InputV2';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useAppDispatch  } from '@store/hooks';
import { open } from '@store/counter/snackbarReducer';
import { AxiosError } from 'axios';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAxios } from 'hooks/useAxios';
import Button from '@components/Button';
import ModalForm from '@components/modalForms/ModalForm';
import FooterLayout from '@layouts/FooterLayout';



interface Inputs {
  username: string;
}

interface TCodeInputs {
  code: string 
}



const Schema = yup.object().shape({
  username: yup.string().required('Este campo es requerido')
  
});

const codeFormSchema = yup.object().shape({
  code: yup.string().required('Este campo es requerido'),
})


const Index = () => {
  const router = useRouter();
  const { requester } = useAxios();
  const dispatch = useAppDispatch();
  const [modal, setModal ] = React.useState('')
  const [openModal, setOpenModal ] = React.useState(false)
  
  const { mutate, isLoading } = useMutation(
    (formData: Inputs) => {
      return requester({
        method: 'POST',
        data: formData,
        url: 'account-holder/confirmation-code/',
      });
    },
    {
      onSuccess: (response) => {
        const { data } = response
        setOpenModal(true)
        setModal('confirmCode')
        
      },
      onError: (error: AxiosError) => {
        dispatch(open({ text: 'Ha ocurrido un error', type: 'error' }));
      },
    }
  );

  const { mutate: mutateCode } = useMutation(
    (Data: any ) => {
      return requester({
        method: 'POST',
        data: Data,
        url: 'account-holder/check-code/',
      });
    },
    {
      onSuccess: (response) => {
        setOpenModal(false)
        router.push('/') 
        dispatch(open({ text: 'Recuperación exitosa', type: 'success' }));    
        
      },

      onError: (error: AxiosError) => {
        setOpenModal(false)
        dispatch(open({ text: 'Ha ocurrido un error', type: 'error' }));
      },
      
    }
   
  );



  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<Inputs>({
    resolver: yupResolver(Schema),
  });

  const { register: registerCode , formState: formStateCode , handleSubmit: handleSubmitCode , resetField: resetCode }  = useForm<TCodeInputs>({
    resolver: yupResolver(codeFormSchema),

  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { username } = data;
    mutate({username });
  };

  const onSubmitCode: SubmitHandler<TCodeInputs> = async (inputsData : TCodeInputs ) => {
    const { code } = inputsData;
    mutateCode({confirmation_code: code, username : getValues('username') });
    resetCode('code')
  };
  

  return (

    <>
  {modal === 'confirmCode' ?

  <ModalForm
  open={openModal}
  setOpen={setOpenModal}
  handleAccept={handleSubmitCode(onSubmitCode)}
  title='Confirmación'
  >
    <p className='-mt-2'>El código de confirmación fue enviado a su correo registrado</p>
    <div className='mt-2'>
    <InputV2
                  label="Código de confirmación"
                  name="code"
                  type='text'
                  errorMessage={formStateCode?.errors?.code?.message}
                  register={registerCode}
                
                  
                />
    </div>

    </ModalForm>

  : null}

<div className="flex items-center bg-gradient-to-r from-sky-50 to-sky-200">
    <FooterLayout>
      <div className="mx-auto my-auto flex flex-col items-center justify-center rounded-2xl bg-white/70 p-10 shadow-2xl">
        <div>
          <div className=" w-full">
            <img src="/logo-login.png" alt="logo" className="h-24 ml-8" />
          </div>
          <h1 className="motto-line">Un TAG, todas las vías</h1>
            <form className="mt-12" onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-20">
                <InputV2
                  label="Documento de identidad"
                  name="username"
                  type="text"
                  errorMessage={errors.username?.message}
                  register={register}
                  defaultValue={'V'}
                />
              </div>
             
              
              <div className="mt-12">
                <Button loading={isLoading} type="submit" text="Enviar" />
              </div>
              <div className="mt-6 ">
              <input
              value="Volver"
              onClick={() => router.back()}
              className="cursor-pointer w-full rounded px-4 py-2 bg-transparent text-center font-semibold text-red-500 focus:bg-transparent focus:outline-none"
            />
              </div>

              <div className="mt-12">
                {/* <InputV2
                  label="Contraseña"
                  name="password"
                  type='text'
                  errorMessage={errors.password?.message}
                  register={register}
                  
                /> */}
              </div>

            </form>


        </div>
      </div>
    </FooterLayout>
    <div className=" hidden w-full lg:block">
      <img className="aspect-1 max-h-screen" src="/login.svg" alt="login" />
    </div>
  </div>
    </>
  );
};

// noinspection JSUnusedGlobalSymbols
export default Index;
