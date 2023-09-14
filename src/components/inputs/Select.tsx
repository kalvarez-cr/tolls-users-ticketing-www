import LoaderSelect from '@components/loaders/LoaderSelect';
import { UseFormRegister } from 'react-hook-form';


interface TSelectProps {
  label?: string;
  name: string;
  errorMessage?: string;
  register?: UseFormRegister<any>;
  options: Array<{ value: string | number; label: string | number }>;
  initialLabelAndValue?: { value: string | number; label: string | number };
  onChange?: any;
  disabled?: boolean
  isLoading?: boolean
  defaultValue?: string | number;

}

const Select = ({
  label,
  name,
  errorMessage,
  register,
  options,
  onChange, 
  disabled,
  isLoading,
  defaultValue,
}: TSelectProps) => {
  return (
    <div className="relative my-4 flex flex-col">
     <label
        htmlFor={name}
        className="absolute left-0 -top-3.5 cursor-text text-sm text-gray-900 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
      >
        {label}
      </label>
      <select
        {...register(name)}
        className={`peer h-10 w-full border-0 border-b-2 border-gray-300 bg-white/0 text-gray-900 placeholder-transparent focus:outline-none focus:ring-0 ${
          errorMessage
            ? 'border-rose-500 focus:border-rose-500'
            : 'focus:border-emerald-600'
        }`}
        placeholder={label}
        onChange={(e) =>{ 
          register(name).onChange(e)
          onChange && onChange(e)
        }}
        disabled={disabled}
        defaultValue={defaultValue}
      >
        <option value="" disabled selected hidden className='text-gray-300'>{isLoading ? 'cargando...': defaultValue}</option>
        { options?.length < 1 && <option value="" disabled className='text-gray-300'>No hay opciones disponibles</option>}
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label
        htmlFor={name}
        className="text-rose absolute left-0 top-11 font-medium"
      >
        {errorMessage ? (
          <span className="text-sm text-rose-500">({errorMessage})</span>
        ) : null}
      </label>
      {isLoading && <LoaderSelect className='absolute text-black right-14'/>}

    </div>
  );
};

export default Select;
