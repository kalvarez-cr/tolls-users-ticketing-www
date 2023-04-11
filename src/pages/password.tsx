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

  const { register: registerCode , formState: formStateCode , handleSubmit: handleSubmitCode}  = useForm<TCodeInputs>({
    resolver: yupResolver(codeFormSchema),

  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { username } = data;
    mutate({username });
  };

  const onSubmitCode: SubmitHandler<TCodeInputs> = async (inputsData : TCodeInputs ) => {
    const { code } = inputsData;
    mutateCode({confirmation_code: code, username : getValues('username') });
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
     <InputV2
                  label="Código de confirmación"
                  name="code"
                  type='text'
                  errorMessage={formStateCode?.errors?.code?.message}
                  register={registerCode}
                  
                />

    </ModalForm>

  : null}

    <div className="flex items-center bg-gradient-to-b from-cyan-100 to-cyan-500">
      <div className="flex h-screen w-screen flex-col justify-between">
        <div className="login-background">
          <img className="nube-1" src="/movil-diagrama-nubes.png" alt="nubes" />
          <img className="nube-2" src="/movil-diagrama-nubes.png" alt="nubes" />
          <img className="nube-3" src="/movil-diagrama-nubes.png" alt="nubes" />
          <img className="nube-4" src="/movil-diagrama-nubes.png" alt="nubes" />
          <img className="nube-5" src="/movil-diagrama-nubes.png" alt="nubes" />
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
                  name="username"
                  type="text"
                  errorMessage={errors.username?.message}
                  register={register}
                  defaultValue={'V'}
                />
              </div>
             
              
              <div className="mt-10">
                <Button loading={isLoading} type="submit" text="Enviar" />
              </div>
              <div className="mt-2 ">
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
    </>
  );
};

// noinspection JSUnusedGlobalSymbols
export default Index;
