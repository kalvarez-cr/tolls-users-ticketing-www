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
  smsCode: string;
  paymentMethod: string;
}

const Schema = yup.object().shape({
  smsCode: yup.string().required('Este campo es requerido'),
});

const ConfirmationSmsForm = ({
  openModal,
  setOpenModal,
  token,
  paymentMethod,
}) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    resetField,
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
        url: 'external-recharge/confirm_bdv_sms/',
      });
    },
    {
      onSuccess: (response) => {
        const { data } = response;

        if (data.data?.bdv_response?.success === 1) {
          setOpenModal(false);
          dispatch(
            open({ text: data.data?.bdv_response?.message, type: 'success' })
          );
          router.push('/recharges');
        } else if(data.data?.bdv_response?.success === 4){
          setOpenModal(false);
          dispatch(
            open({ text: data.data?.bdv_response?.message, type: 'error' })
          );
        }else if(data.data?.bdv_response?.success === 0){
          setOpenModal(false);
          dispatch(
            open({ text: data.data?.bdv_response?.message, type: 'error' })
          );
        }else {
          setOpenModal(false);
          dispatch(
            open({ text: data.data?.bdv_response?.message, type: 'error' })
          );
        }
      },
      onError: (error: AxiosError) => {
        dispatch(open({ text: error.response.statusText, type: 'error' }));
      },
    }
  );

  const onSubmit: SubmitHandler<any> = (data) => {
    const { smsCode } = data;
    mutate({
      token,
      smsCode,
      channel: 'web_site',
      bank: '1',
      paymentMethod,
    });

    resetField('smsCode')
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
          <div className="w-full">
            <InputV2
              label="Código"
              name="smsCode"
              type="text"
              errorMessage={errors.smsCode?.message}
              register={register}
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ConfirmationSmsForm;
