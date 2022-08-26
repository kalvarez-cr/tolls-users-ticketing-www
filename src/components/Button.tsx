import React from 'react';
import Loader2 from './loaders/Loader2';

interface ButtonProps {
  loading: boolean;
  text: string;
  type: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler;
}

const Button = ({ loading, text, type, onClick }: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={loading}
      onClick={onClick}
      className={`relative inline-flex h-10 w-full items-center justify-center rounded-md bg-emerald-600/70 py-1 px-4 align-middle text-white shadow-md  focus:outline-none focus:ring-2 focus:ring-greenLight focus:ring-offset-2 ${
        loading
          ? 'pointer-events-none'
          : ' font-bold transition-all delay-100 duration-200 hover:bg-emerald-600/50 hover:text-white hover:shadow-lg '
      }`}
    >
      {loading ? (
        <div className="absolute -top-5">
          <Loader2 />
        </div>
      ) : (
        text
      )}
    </button>
  );
};

export default Button;
