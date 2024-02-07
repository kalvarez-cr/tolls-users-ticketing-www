import React from 'react';
import Loader2 from './loaders/Loader2';

interface ButtonProps {
  loading: boolean;
  text: string;
  type: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler;
  disabled?: boolean
}

const Button = ({ loading, text, type, onClick, disabled }: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}

      onClick={onClick}
      className={`focus:ring-blueLight relative inline-flex h-10 w-full items-center justify-center rounded-md 
      bg-red-600 py-1 px-4 align-middle text-white  shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        loading || disabled
          ? 'cursor-wait'
          : ' font-bold transition-all delay-100 duration-200 hover:bg-red-500 hover:text-white hover:shadow-lg '
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
