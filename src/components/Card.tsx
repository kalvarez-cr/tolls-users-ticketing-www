import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/outline';

interface TCardProps {
  title: string;
  data: string;
  icon: React.ReactNode;
  moreInfo: boolean;
}

const Card = ({ title, data, icon, moreInfo }: TCardProps) => {
  return (
    <div className="h-36 rounded-xl shadow-md">
      <div
        className={`flex items-center space-x-6  bg-white px-6 ${
          moreInfo ? 'h-4/6 rounded-t-xl' : 'h-full rounded-xl'
        }`}
      >
        {icon}
        <div>
          <h2 className={`text-gray-600 ${moreInfo ? 'text-md' : 'text-lg'}`}>
            {title}
          </h2>
          <h2 className={`font-medium ${moreInfo ? 'text-xl' : 'text-2xl'}`}>
            {data}
          </h2>
        </div>
      </div>
      {moreInfo ? (
        <Link href="/recharges">
          <div className="flex h-2/6 items-center rounded-b-xl bg-gray-100 px-6 text-emerald-600 decoration-emerald-600 decoration-2 hover:underline">
            <h4 className="text-sm font-normal">Más información</h4>
            <ChevronRightIcon className="h-4 w-4" />
          </div>
        </Link>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Card;
