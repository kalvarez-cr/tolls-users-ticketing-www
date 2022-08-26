import { UseFormRegister } from 'react-hook-form';

interface TSelectProps {
  label: string;
  name: string;
  errorMessage?: string;
  register?: UseFormRegister<any>;
  options: Array<{ value: string | number; label: string | number }>;
  initialLabelAndValue?: { value: string | number; label: string | number };
  onChange?: any;
}

const Select = ({
  label,
  name,
  errorMessage,
  register,
  options,
  initialLabelAndValue,
}: TSelectProps) => {
  return (
    <div className="my-4 flex flex-col">
      <label className="absolute left-0 -top-3.5 cursor-text text-sm text-gray-900 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600">
        {label}{' '}
      </label>
      <select
        {...register(name)}
        className={`peer h-10 w-full border-0 border-b-2 border-gray-300 bg-white/0 text-gray-900 placeholder-transparent focus:outline-none focus:ring-0 ${
          errorMessage
            ? 'border-rose-500 focus:border-rose-500'
            : 'focus:border-emerald-600'
        }`}
      >
        <option value={initialLabelAndValue?.value || ''}>
          {initialLabelAndValue?.label || label}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
