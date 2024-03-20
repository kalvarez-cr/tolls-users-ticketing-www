import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/outline';

interface TCardProps {
  title: string;
  data: string | any;
  icon: React.ReactNode;
  moreInfo: boolean;
  link: string;
  isLoading?: boolean;
  
}

const Card = ({ title, data, icon, moreInfo, link, isLoading  }: TCardProps) => {
  return (
    <div className="h-36 justify-center rounded-xl shadow-md">
      <div
        className={`flex items-center space-x-6  bg-white px-6 ${
          moreInfo ? 'h-4/6 rounded-t-xl' : 'h-full rounded-xl'
        }`}
      >
       
        {icon}
        <div>
      
          <h2 className={`card-title ${moreInfo ? 'text-md' : 'text-lg'}`}>
            {title}
          </h2>
          {isLoading ? (
            <div className='flex '>
            <svg className={` h-5 w-5 m-2 animate-spin rounded-lg bg-blue-400 `}></svg>
            <svg className={` h-5 w-5 m-2 animate-spin rounded-lg bg-blue-400 `}></svg>
            <svg className={` h-5 w-5 m-2 animate-spin rounded-lg bg-blue-400 `}></svg>
            </div>
          ) : (
          
            <h2 className={`card-data ${moreInfo ? 'text-xl' : 'text-2xl'}`}>
              {data}
            </h2>
            
          )}
        </div>
      </div>
      {moreInfo ? (
        <Link href={link}>
          <div className="flex h-2/6 items-center justify-end rounded-b-xl bg-gray-100 px-6 text-gray-500 decoration-gray-500 decoration-2 hover:underline">
            <h4 className="text-link text-sm">más información</h4>
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
