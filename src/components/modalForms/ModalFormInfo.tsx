import React from 'react';
import Modal from '@components/Modal';




const ModalFormInfo = ({ open, setOpen, handleAccept, title, children }) => {
 

  return (
    <>
      {open ? (
        <Modal
          open={open}
          setOpen={setOpen}
          handleAccept={handleAccept}
          title={title}
          acceptButtonText="Aceptar"
         
         
        >
          {children}
        </Modal>
      ) : null}
    </>
  );
};

export default ModalFormInfo;