import React from 'react';
import Modal from '@components/Modal';




const ModalForm = ({ open, setOpen, handleAccept, title, children }) => {
 

  return (
    <>
      {open ? (
        <Modal
          open={open}
          setOpen={setOpen}
          handleAccept={handleAccept}
          title={title}
          acceptButtonText="Aceptar"
          cancelButtonText="Cancelar"
          icon={''}
        >
          {children}
        </Modal>
      ) : null}
    </>
  );
};

export default ModalForm;
