import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface TPaymentMethodCardProps {
  image: string;
  href: string;
}

const PaymentMethodCard = ({ image, href }: TPaymentMethodCardProps) => {
  return (
    <Link href={href}>
      <div className="flex h-28 cursor-pointer items-center justify-center rounded-xl bg-white px-6 shadow-md">
        <Image src={image} height={200} width={200} />
      </div>
    </Link>
  );
};

export default PaymentMethodCard;
