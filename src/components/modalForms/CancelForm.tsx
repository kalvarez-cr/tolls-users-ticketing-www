import React from 'react';
import Modal from '@components/Modal';
import { useAppDispatch } from '@store/hooks';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { requester } from 'utils/requester';
import { XIcon } from '@heroicons/react/outline';

const CancelForm = ({ open, setOpen, idVehicle }) => {
  const dispatch = useAppDispatch();
  const { mutate } = useMutation(
    (id: any) => {
      return requester({
        method: 'POST',
        data: id,
        url: '/registered-vehicle/cancel/',
      });
    },
    {
      onSuccess: (response) => {
        const { data } = response;
        return data.data;
        // dispatch(open({text:'Operación exitosa', type: 'success'}))
      },
      onError: (error: AxiosError) => {
        dispatch(open({ text: error.response.statusText, type: 'error' }));
      },
    }
  );

  const handleAccept = () => {
    mutate({ id: idVehicle });
    setOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        setOpen={setOpen}
        handleAccept={() => handleAccept()}
        title="Desasociar vehículo"
        acceptButtonText="Proceder"
        cancelButtonText="Cancelar"
        icon={<XIcon className="h-6 text-rose-400" />}
      >
        <p>¿Usted desea desasociar este vehículo?</p>
      </Modal>
    </>
  );
};

export default CancelForm;
