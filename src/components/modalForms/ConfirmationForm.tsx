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
import { ChatAltIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { open } from '@store/counter/snackbarReducer';

interface Inputs {
  sms_code: string;
}

const Schema = yup.object().shape({
  sms_code: yup.string().required('Este campo es requerido'),
});

const ConfirmationForm = ({
  openModal,
  setOpenModal,
  transaction,
  ci,
  type,
  charge_amount,
}) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(Schema),
  });

  const dispatch = useAppDispatch();
  const { mutate, isLoading } = useMutation(
    (code: any) => {
      return requester({
        method: 'POST',
        data: code,
        url: 'punto-ya/confirm-code/',
      });
    },
    {
      onSuccess: (response) => {
        const { data } = response;
        if (data.return_code === '00') {
          setOpenModal(false);
          dispatch(
            open({ text: 'Recarga realizada con éxito', type: 'success' })
          );
          router.push('/recharges');
        } else {
          setOpenModal(false);
          dispatch(open({ text: 'Error inesperado', type: 'error' }));
        }
      },
      onError: (error: AxiosError) => {
        setOpenModal(false);
        dispatch(open({ text: 'Error inesperado', type: 'error' }));
      },
    }
  );

  const onSubmit: SubmitHandler<any> = (data) => {
    const { sms_code } = data;
    mutate({
      transaction_id: transaction,
      identification: `${type}${ci}`,
      sms_code,
      channel: 'web_site',
      charge_amount,
    });
  };

  return (
    <>
      <Modal
        open={openModal}
        setOpen={setOpenModal}
        handleAccept={handleSubmit(onSubmit)}
        title="Código de confirmación"
        acceptButtonText="Proceder"
        cancelButtonText="Cancelar"
        icon={<ChatAltIcon />}
        loading={isLoading}
      >
        <p className="">Introduzca el código de confirmación recibido</p>
        <form className="mt-12">
          <div className="mt-12">
            <InputV2
              label=""
              name="sms_code"
              type="text"
              errorMessage={errors.sms_code?.message}
              register={register}
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ConfirmationForm;
