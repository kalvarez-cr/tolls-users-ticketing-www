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

interface Inputs {
  sms_code: string;
}

const Schema = yup.object().shape({
  sms_code: yup.string().required('Este campo es requerido'),
});

const ConfirmationForm = ({ open, setOpen, transaction, ci, type }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(Schema),
  });

  const dispatch = useAppDispatch();
  const { mutate } = useMutation(
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
        if (data) {
          setOpen(false);
          router.push('/recharges');
        }
      },
      onError: (error: AxiosError) => {
        dispatch(open({ text: error.response.statusText, type: 'error' }));
      },
    }
  );

  const onSubmit: SubmitHandler<any> = (data) => {
    const { sms_code } = data;
    mutate({
      transaction_id: transaction,
      identification: `${type}${ci}`,
      sms_code,
    });
  };

  return (
    <>
      <Modal
        open={open}
        setOpen={setOpen}
        handleAccept={handleSubmit(onSubmit)}
        title="Código de confirmación"
        acceptButtonText="Proceder"
        cancelButtonText="Cancelar"
        icon={<ChatAltIcon />}
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
