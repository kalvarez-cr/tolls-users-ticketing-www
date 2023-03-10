import React, { ReactElement, useState } from 'react';
import LandingLayout from '@layouts/LandingLayout';
import InputV2 from '@components/inputs/InputV2';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import { useAppDispatch } from '@store/hooks';
import { AxiosError } from 'axios';
import { open } from '@store/counter/snackbarReducer';
import { UserCircleIcon, PencilIcon } from '@heroicons/react/solid';
import { useSelector } from 'react-redux';
import { useGuard } from 'hooks/useGuard';
import { useAxios } from 'hooks/useAxios';
import ResetPassword from '@components/modalForms/ResetPasswordForm';
import Button from '@components/Button';

interface Inputs {
  phone_number?: string;
  id: string;
  data: any;
}
const Schema = yup.object().shape({
  phone_number: yup
    .string()
    .min(11, 'Mínimo 11 caracteres')
    .max(11, 'Máximo 11 caracteres')
    .required('Este campo es requerido'),
});

const User = () => {
  useGuard();
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const user_info = useSelector((state: any) => state.loginUser?.user_info);

  const { requester } = useAxios();
  const dispatch = useAppDispatch();
  const { mutate, isLoading } = useMutation(
    (formData: Inputs) => {
      return requester({
        method: 'POST',
        data: formData,
        url: 'account-holder/update/',
      });
    },
    {
      onSuccess: () => {
        dispatch(open({ text: 'Actualización exitosa', type: 'success' }));
      },
      onError: (error: AxiosError) => {
        dispatch(open({ text: 'Ha ocurrido un error', type: 'error' }));
      },
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(Schema),
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    const { phone_number } = data;
    mutate({
      id: user_info.id,
      data: {
        phone_number,
      },
    });
  };

  return (
    <div className="mt-28 w-5/6 rounded-xl bg-gray-100 p-24 shadow-xl">
      <div className="flex flex-col">
        <div className="ml-72">
          <UserCircleIcon className=" h-20 text-gray-500" />
        </div>
        <h1 className=" text-center text-4xl font-bold tracking-wide">
          {user_info?.first_name} {''} {user_info?.last_name}
        </h1>
        <h3 className="mt-4 text-center text-lg">{user_info?.email}</h3>
      </div>

      <div className="flex flex-col">
        <div className="mt-12 mb-10 flex items-start">
          <InputV2
            label="Teléfono celular"
            name="phone_number"
            type="text"
            errorMessage={errors.phone_number?.message}
            register={register}
            defaultValue={user_info?.phone_number}
            disabled={!isEditable}
          />
          <button
            type="button"
            onClick={() =>
              isEditable ? setIsEditable(false) : setIsEditable(true)
            }
          >
            <PencilIcon className="h-5 text-gray-600 hover:text-emerald-500" />
          </button>

          {isEditable ? (
            <div className=" mx-9 w-1/3">
              <Button
                text="Cambiar Teléfono"
                type="button"
                loading={isLoading}
                onClick={handleSubmit(onSubmit)}
              />
            </div>
          ) : null}

          <ResetPassword
            open={openResetPassword}
            setOpen={setOpenResetPassword}
            loading={isLoading}
          />
        </div>
        <Button
          text="Cambiar contraseña"
          type="button"
          loading={false}
          onClick={(e) => setOpenResetPassword(true)}
        />
      </div>
    </div>
  );
};

User.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default User;
