import InputV2 from '@components/inputs/InputV2';
import * as yup from 'yup';
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import Select from '@components/inputs/Select';

export interface TFilterVehiclesFormInputs {
  nickname: string;
  category: string;
  status: string;
}

export const FilterVehiclesFormSchema = yup.object().shape({
  nickname: yup.string(),
  category: yup.string(),
  status: yup.string(),
});

interface FilterVehiclesFormProps {
  data?: TFilterVehiclesFormInputs;
  useForm: UseFormReturn<TFilterVehiclesFormInputs, any>;
}

export default function FilterVehiclesForm({
  data,
  useForm,
}: FilterVehiclesFormProps) {
  const { register, setValue, formState } = useForm;

  useEffect(() => {
    if (data) {
      setValue('nickname', data.nickname);
    }
  }, [data, setValue]);

  return (
    <div className="flex gap-5">
      <div className="w-full">
        <InputV2
          errorMessage={formState?.errors?.nickname?.message}
          label="Nickname"
          name="nickname"
          register={register}
          type={'text'}
        />
        <Select
          label="Categoría"
          name="category"
          options={[]}
          // errorMessage={errors.nif?.message}
          register={register}
        />
        <Select
          label="Status"
          name="status"
          options={[]}
          //   errorMessage={errors.nif?.message}
          register={register}
        />
      </div>
    </div>
  );
}
