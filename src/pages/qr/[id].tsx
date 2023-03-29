import Logo from '@components/icons/Logo';
import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';

const qr = () => {
  const router = useRouter();
  const { id } = router.query;
  const [base64, setBase64] = React.useState<any>();

  const handleClick = async () => {
    const body = {
      pass_id: id,
    };

    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      const data = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}venpass/qr/`,
        body,
        {
          headers,
        }
      );

      setBase64(data.data.data.qr_code);
    } catch (error) {}
  };
  React.useEffect(() => {
    handleClick();
  }, [id]);
  return (
    <>
    <div className="bg-cel flex flex-col items-center">
      <div className="mt-7 flex w-full items-center justify-center">
        <Logo className="w-40" />
      </div>
      <p className="text-center text-lg  font-semibold mt-7">
        Su pago se ha realizado con éxito, puede transitar con su vehículo por
        el peaje, presentando este código QR{' '}
      </p>
    </div>
      <div className="flex justify-center">
        <img
          src={`data:image/png;base64,${base64}`}
          className="absolute top-1/2 w-40"
          alt="qr"
        />
      </div>
    </>

  );
};

export default qr;
