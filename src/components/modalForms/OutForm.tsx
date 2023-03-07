import React from 'react';
import Modal from '@components/Modal';

import { useRouter } from 'next/router';
import { useAppDispatch } from '@store/hooks';
import { close } from '@store/counter/modalReducer';
import { logout } from '@store/counter/loginReducer';
import { useAxios } from 'hooks/useAxios';
import { useMutation } from 'react-query';
import { EmojiSadIcon } from '@heroicons/react/outline';

const OutForm = ({ open, setOpen }) => {
  const dispatch = useAppDispatch();
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
      {open ? (
        <Modal
          open={open}
          setOpen={setOpen}
          handleAccept={() => handleAccept()}
          title="Cierre de sesión"
          acceptButtonText="Aceptar"
          cancelButtonText="Cancelar"
          icon={<EmojiSadIcon />}
        >
          <p>¿Usted desea cerrar sesión?</p>
        </Modal>
      ) : null}
    </>
  );
};

export default OutForm;
