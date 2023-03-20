import Logo from '@components/icons/Logo';
import React from 'react';

const qr = () => {
  return (
    <div className="m-10 mt-24   rounded-xl bg-gray-100 p-12 shadow-xl">
      <div className="mb-5 flex w-full items-center justify-center">
        <Logo className="w-40" />
      </div>

      <div className="flex items-center justify-center">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png"
          className="w-52"
        />
      </div>

      <p className="text-center">
        Su pago se ha realizado con éxito, puede transitar con su vehículo por
        el peaje, presentando este código QR{' '}
      </p>
    </div>
  );
};

export default qr;
