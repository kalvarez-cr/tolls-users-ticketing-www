import React from 'react';
import Modal from '@components/Modal';
import { useAppDispatch } from '@store/hooks';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { requester } from 'utils/requester';
import { MinusCircleIcon } from '@heroicons/react/outline';

const CancelForm = ({ open, setOpen, idTag, status }) => {
  const dispatch = useAppDispatch();
  const { mutate } = useMutation(
    (id: any) => {
      return requester({
        method: 'POST',
        data: id,
        url: '/vehicle-account/update/',
      });
    },
    {
      onError: (error: AxiosError) => {
        dispatch(open({ text: error.response.statusText, type: 'error' }));
      },
    }
  );

  const handleAccept = () => {
    mutate({
      id: idTag,
      data: {
        status,
      },
    });
    setOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        setOpen={setOpen}
        handleAccept={() => handleAccept()}
        title="Bloquear vehículo"
        acceptButtonText="Proceder"
        cancelButtonText="Cancelar"
        icon={<MinusCircleIcon />}
      >
        <p>¿Usted desea bloquear este vehículo?</p>
      </Modal>
    </>
  );
};

export default CancelForm;
