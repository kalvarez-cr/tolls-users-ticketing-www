import React from 'react';
import { HTMLInputTypeAttribute } from 'react';
import { UseFormRegister } from 'react-hook-form';

interface TInputProps {
  label: string;
  name: string;
  errorMessage: any;
  register: UseFormRegister<any>;
  type: HTMLInputTypeAttribute;
  disabled?: boolean;
  labelClassName?: string;
  defaultValue?: string;
}

const InputV2 = ({
  label,
  type,
  name,
  register,
  errorMessage,
  disabled,
  defaultValue,
}: TInputProps) => {
  return (
    <div className="relative">
      <input
        id={name}
        name={name}
        type={type}
        className={`peer h-10 w-full border-0 border-b-2 border-gray-300 bg-white/0 text-gray-900 placeholder-transparent focus:outline-none focus:ring-0 ${
          errorMessage
            ? 'border-rose-500 focus:border-rose-500'
            : 'focus:border-emerald-600'
        }`}
        placeholder={label}
        disabled={disabled}
        defaultValue={defaultValue}
        autoComplete="off"
        ref={register}
        {...register(name)}
      />
      <label
        htmlFor={name}
        className="absolute left-0 -top-3.5 cursor-text text-sm text-gray-900 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
      >
        {label}
      </label>
      <label
        htmlFor={name}
        className="text-rose absolute left-0 top-11 font-medium"
      >
        {errorMessage ? (
          <span className="text-sm text-rose-500">({errorMessage})</span>
        ) : null}
      </label>
    </div>
  );
};

export default InputV2;
