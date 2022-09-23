import React from 'react';
import Modal from '@components/Modal';
import { CreditCardIcon } from '@heroicons/react/solid';
import InputV2 from '@components/inputs/InputV2';
import Select from '@components/inputs/Select';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { requester } from 'utils/requester';
import { AxiosError } from 'axios';
import { useAppDispatch } from '@store/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface Inputs {
  external_reference_id?: string;
  account_number: string;
  recharge_id?: string;
  facial_amount?: string;
  facial_iso_code?: string;
  nominal_amount?: string;
  nominal_iso_code?: string;
  issuer?: string;
  payment?: string;
  recharge?: string;
  created_from_ip_address?: string;
  reference?: string;
}

const methods = [
  {
    value: 'cash',
    label: 'Efectivo',
  },
  {
    value: 'debit/credit',
    label: 'Débito/Crédito',
  },
  {
    value: 'post-payment',
    label: 'Postpago',
  },
];

const Schema = yup.object().shape({
  recharge: yup.string().required('Este campo es requerido'),
  payment: yup.string().required('Este campo es requerido'),
});

const RechargueForm = ({ open, setOpen, accountNumber }) => {
  const dispatch = useAppDispatch();
  const { mutate } = useMutation(
    (formData: Inputs) => {
      return requester({
        method: 'POST',
        data: formData,
        url: '/recharge-module/create/',
      });
    },
    {
      onSuccess: (response) => {
        const { data } = response;
        console.log(data);
        setOpen(false);
      },
      onError: (error: AxiosError) => {
        dispatch(open({ text: error.response.statusText, type: 'error' }));
      },
    }
  );

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(Schema),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const { recharge, payment, reference } = data;
    mutate({
      facial_amount: recharge,
      external_reference_id: reference || '123456789012',
      account_number: accountNumber,
      recharge_id: '9632587410',
      facial_iso_code: '928',
      nominal_amount: recharge,
      nominal_iso_code: '928',
      issuer: 'recharge',
      created_from_ip_address: '192.168.1.107',
      payment,
    });
  };

  React.useEffect(() => {
    getValues('payment');
  }, [watch('payment')]);

  return (
    <>
      <Modal
        open={open}
        setOpen={setOpen}
        handleAccept={handleSubmit(onSubmit)}
        title="Recargar"
        acceptButtonText="Aceptar"
        cancelButtonText="Cancelar"
        icon={<CreditCardIcon />}
      >
        <form className="mt-12">
          <div className="mt-12">
            <Select
              label="Método de pago"
              name="payment"
              options={methods}
              errorMessage={errors.payment?.message}
              register={register}
            />
          </div>
          <div className="mt-12">
            <InputV2
              label="Monto de recarga"
              name="recharge"
              type="text"
              errorMessage={errors.recharge?.message}
              register={register}
            />
          </div>
          {getValues('payment') === 'cash' ? null : (
            <div className="mt-12">
              <InputV2
                label="Referencia"
                name="reference"
                type="text"
                errorMessage={errors.reference?.message}
                register={register}
                // disabled={!watch('payment')}
              />
            </div>
          )}
        </form>
      </Modal>
    </>
  );
};

export default RechargueForm;
