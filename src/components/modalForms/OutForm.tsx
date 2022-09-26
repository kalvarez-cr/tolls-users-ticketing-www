import React from 'react';
import Modal from '@components/Modal';
import { CreditCardIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { close, modal, open } from '@store/counter/modalReducer';
import { logout } from '@store/counter/loginReducer';
import { useAxios } from 'hooks/useAxios';
import { useMutation } from 'react-query';

const OutForm = () => {
  const dispatch = useAppDispatch();
  const modalState = useAppSelector(modal);
  const router = useRouter();
  const { requester } = useAxios();
  const { mutate } = useMutation(
    () => {
      return requester({
        method: 'POST',
        data: '',
        url: '/logout/',
      });
    },
    {
      onSuccess: () => {
        dispatch(close());
      },
    }
  );
  const handleAccept = () => {
    dispatch(logout());
    mutate();
    router.push('/');
  };

  return (
    <>
      {modalState.open ? (
        <Modal
          open={modalState.open}
          setOpen={dispatch(open())}
          handleAccept={() => handleAccept()}
          title="Advertencia"
          acceptButtonText="Aceptar"
          cancelButtonText={null}
          icon={<CreditCardIcon />}
        >
          <p>Usted será redirigido al login</p>
        </Modal>
      ) : null}
    </>
  );
};

export default OutForm;
