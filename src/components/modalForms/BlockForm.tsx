import React from 'react';
import Modal from '@components/Modal';
import { useAppDispatch } from '@store/hooks';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { requester } from 'utils/requester';
import { MinusCircleIcon } from '@heroicons/react/outline';

const CancelForm = ({ open, setOpen, idTag }) => {
  const dispatch = useAppDispatch();
  const { mutate } = useMutation(
    (id: any) => {
      return requester({
        method: 'POST',
        data: id,
        url: '/registered-vehicle/block/',
      });
    },
    {
      onSuccess: (response) => {
        const { data } = response;
        return data.data;
      },
      onError: (error: AxiosError) => {
        dispatch(open({ text: error.response.statusText, type: 'error' }));
      },
    }
  );

  const handleAccept = () => {
    mutate({ id: idTag });
    setOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        setOpen={setOpen}
        handleAccept={() => handleAccept()}
        title="Bloquear vehículo"
        acceptButtonText="Aceptar"
        cancelButtonText="Cancelar"
        icon={<MinusCircleIcon />}
      >
        <p>¿Usted desea bloquear este vehículo?</p>
      </Modal>
    </>
  );
};

export default CancelForm;
