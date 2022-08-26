import { UseFormRegister } from 'react-hook-form';

interface TInputProps {
  label: string;
  name: string;
  errorMessage: string;
  register: UseFormRegister<any>;
  rows?: number;
}

const Input = ({ label, name, errorMessage, register, rows }: TInputProps) => {
  return (
    <div className="my-4 flex flex-col">
      <label className="font-bold">
        {label}{' '}
        {errorMessage ? (
          <span className="font-bold text-red-600">({errorMessage})</span>
        ) : null}
      </label>
      <textarea
        rows={rows || 6}
        className={`input ${errorMessage ? 'input-error' : ''}`}
        name={name}
        {...register(name)}
      />
    </div>
  );
};

export default Input;
