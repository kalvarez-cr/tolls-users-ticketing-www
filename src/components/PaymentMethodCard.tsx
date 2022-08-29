import React from 'react';
import Image from 'next/image';

interface TPaymentMethodCardProps {
  image: string;
}

const PaymentMethodCard = ({
  image
}: TPaymentMethodCardProps) => {
  return (
    <div className="flex h-28 cursor-pointer items-center justify-center rounded-xl bg-white px-6 shadow-md">
      <Image src={image} height={200} width={200} />
    </div>
  );
};

export default PaymentMethodCard;
