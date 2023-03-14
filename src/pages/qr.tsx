import Logo from '@components/icons/Logo';
import React from 'react';

const qr = () => {
  return (
    <div className="m-10 mt-24 rounded-xl bg-gray-100 p-12 shadow-xl">
      <div className="mb-5 flex w-full items-center justify-center">
        <Logo className="w-36" />
      </div>

      <div className="flex items-center justify-center">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png"
          className="w-52"
        />
      </div>

      <span className=" items-center text-center">
        Muestre este codigo QR en el peaje{' '}
      </span>
    </div>
  );
};

export default qr;
