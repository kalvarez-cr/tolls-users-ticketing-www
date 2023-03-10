import React from 'react';
import Modal from '@components/Modal';
import InputV2 from '@components/inputs/InputV2';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { requester } from 'utils/requester';
import { AxiosError } from 'axios';
import { useAppDispatch } from '@store/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface Inputs {
  password: string;
  old_password: string;
}
const Schema = yup.object().shape({
  password: yup
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .max(8, 'Máximo 8 caracteres')
    .required('Este campo es requerido'),
  confirm_password: yup
    .string()
    .required('Este campo es requerido')
    .oneOf([yup.ref('password'), 'Las contraseñas deben coincidir']),
  old_password: yup.string().required('Este campo es requerido'),
});

const ResetPassword = ({ open, setOpen, loading }) => {
  const dispatch = useAppDispatch();
  const { mutate } = useMutation(
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
          setOpen(false);
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
    <>
      <Modal
        open={open}
        setOpen={setOpen}
        handleAccept={handleSubmit(onSubmit)}
        title="Cambiar contraseña"
        acceptButtonText="Aceptar"
        cancelButtonText="Cancelar"
        loading={loading}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
            />
          </svg>
        }
      >
        <form className="mr-auto" onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-5 flex flex-col items-center">
            <div className=" mt-5">
              <InputV2
                label="Antigua contraseña"
                name="old_password"
                type="text"
                errorMessage={errors.password?.message}
                register={register}
              />
            </div>
            <div className="mt-5">
              <InputV2
                label="Nueva contraseña"
                name="password"
                type="text"
                errorMessage={errors.password?.message}
                register={register}
              />
            </div>
            <div className="mt-5">
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
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ResetPassword;
