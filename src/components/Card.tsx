import { useRouter } from 'next/router';
import React from 'react';

interface TCardProps {
  title: string;
  data: string;
  icon: React.ReactNode;
  href: string;
}

const Card = ({ title, data, icon, href }: TCardProps) => {
  const { push } = useRouter();
  const handleClick = () => {
    push(href);
  };
  return (
    <button
      onClick={handleClick}
      className="flex aspect-[7/3] w-full rounded-lg  bg-gradient-to-l from-emerald-700 to-emerald-600 text-black shadow-lg transition-all delay-100 duration-200 hover:from-emerald-600 hover:to-emerald-600 hover:shadow-xl"
    >
      <div className="flex w-1/3 items-center justify-center self-center p-2 text-white">
        {icon}
      </div>
      <div className="flex h-full w-2/3 flex-col justify-center p-2 text-left">
        <h1 className="text-2xl font-bold text-white lg:text-3xl">{title}</h1>
        <h2 className="text-4xl text-white lg:text-4xl">{data}</h2>
      </div>
    </button>
  );
};

export default Card;
