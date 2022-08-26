import { HTMLInputTypeAttribute } from 'react';
import { UseFormRegister } from 'react-hook-form';

interface TInputProps {
  label: string;
  name: string;
  errorMessage?: any;
  register?: UseFormRegister<any>;
  type: HTMLInputTypeAttribute;
  disabled?: boolean;
  labelClassName?: string;
}

const Input = ({
  label,
  name,
  errorMessage,
  register,
  type,
  disabled,
  labelClassName,
}: TInputProps) => {
  return (
    <div className="my-4 flex flex-col">
      <label className={labelClassName}>
        {label}
        {errorMessage ? (
          <span className="font-bold text-red-600">({errorMessage})</span>
        ) : null}
      </label>
      <input
        type={type}
        className={`input ${
          errorMessage
            ? 'input-error'
            : 'focus:border-greenDark focus:ring-greenDark'
        }`}
        name={name}
        disabled={disabled}
        {...register(name)}
      />
    </div>
  );
};

export default Input;
