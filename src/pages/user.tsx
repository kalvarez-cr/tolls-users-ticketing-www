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
import { updateUserInfo } from '@store/counter/loginReducer';

interface Inputs {
  phone_number?: string;
  id: string;
  data: any;
  first_name?: string;
  last_name?: string;
  phone_legal?: string;
  last_legal?: string;
  name_legal?: string;
}
const Schema = yup.object().shape({
  phone_number: yup
    .string()
    .min(11, 'Mínimo 11 caracteres')
    .max(14, 'Máximo 14 caracteres'),

  first_name: yup.string(),
  last_name: yup.string(),
  phone_legal: yup
    .string()
    .min(11, 'Mínimo 11 caracteres')
    .max(14, 'Máximo 14 caracteres'),
  last_legal: yup.string(),
  name_legal: yup.string(),
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
      onSuccess: ({data}) => {
       
        dispatch(open({ text: 'Actualización exitosa', type: 'success' }));
        dispatch(updateUserInfo(data.data[0]))
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
    const {
      phone_number,
      first_name,
      last_name,
      name_legal,
      last_legal,
      phone_legal,
    } = data;
    mutate({
      id: user_info.id,
      data: {
        phone_number:
          user_info?.account_type === 'personal_account'
            ? phone_number
            : phone_legal,
        first_name:
          user_info?.account_type === 'personal_account'
            ? first_name
            : name_legal,
        last_name:
          user_info?.account_type === 'personal_account'
            ? last_name
            : last_legal,
      },
    });
  };
  return (
    <>
      {user_info?.account_type === 'personal_account' ? (
        <div className="mt-28 w-5/6 rounded-xl bg-gray-100 p-24 shadow-xl">
          <div className="flex flex-col">
            <div className="flex justify-start space-x-2">
              <div className="">
                <UserCircleIcon className=" h-20 text-gray-500" />
              </div>
              <h1 className="mt-6 text-lg font-semibold">
                {user_info?.first_name} {'  '}
                {user_info?.last_name}
              </h1>
            </div>
            <div className="mt-5 flex items-start">
              <h1 className=" text-lg font-semibold">Datos Personales </h1>
              <button
                type="button"
                onClick={() =>
                  isEditable ? setIsEditable(false) : setIsEditable(true)
                }
              >
                <PencilIcon className="mx-3 h-5  text-gray-600 hover:text-emerald-500" />
              </button>
            </div>
            <div className="mt-7 flex flex-col items-start md:flex-row">
              <div className="w-full md:w-1/3 ">
                <InputV2
                  label=""
                  name="first_name"
                  type="text"
                  errorMessage={errors.first_name?.message}
                  register={register}
                  defaultValue={user_info?.first_name}
                  disabled={!isEditable}
                />
              </div>

              <div className="w-full md:w-1/3">
                <InputV2
                  label=""
                  name="last_name"
                  type="text"
                  errorMessage={errors.last_name?.message}
                  register={register}
                  defaultValue={user_info?.last_name}
                  disabled={!isEditable}
                />
              </div>

              <div className="mt-3 ml-5 w-full md:w-1/2">
                <span>
                  {user_info?.holder_id_doc_type}-{user_info?.holder_id_number}
                </span>
              </div>
            </div>

            <h3 className="mt-5 text-start text-lg font-semibold">Contacto</h3>
            <div className="mt-7 flex flex-col items-start md:flex-row">
              <div className="w-full md:w-1/2 ">
                <InputV2
                  label="Teléfono"
                  name="phone_number"
                  type="text"
                  errorMessage={errors.phone_number?.message}
                  register={register}
                  defaultValue={user_info?.phone_number}
                  disabled={!isEditable}
                />
              </div>

              <div className="ml-5 w-full md:mt-4 md:w-1/2">
                <span>{user_info?.email}</span>
              </div>
            </div>

            <ResetPassword
              open={openResetPassword}
              setOpen={setOpenResetPassword}
              loading={isLoading}
            />

            {isEditable ? (
              <div className="mt-6 w-full">
                <Button
                  text="Actualizar datos"
                  type="button"
                  loading={isLoading}
                  onClick={handleSubmit(onSubmit)}
                />
              </div>
            ) : null}

            <div className="mt-6">
              <Button
                text="Cambiar contraseña"
                type="button"
                loading={false}
                onClick={(e) => setOpenResetPassword(true)}
              />
            </div>
          </div>
        </div>
      ) : (
        //Form de persona juridica
        <div className="mt-28 w-5/6 rounded-xl bg-gray-100 p-24 shadow-xl">
          <div className="flex flex-col">
            <div className="flex justify-start space-x-2">
              <div className="">
                <UserCircleIcon className=" h-20 text-gray-500" />
              </div>
              <h1 className="mt-6 text-lg font-semibold">
                {user_info?.company_name}
              </h1>
              <h1 className="ml-3 mt-6 text-lg font-semibold">
                Rif: {user_info?.holder_id_doc_type}
                {''}
                {user_info?.holder_id_number}
              </h1>
            </div>

            <div className="mt-5 flex items-start">
              <h1 className=" text-lg font-semibold">
                Datos de contacto de la empresa{' '}
              </h1>
              <button
                type="button"
                onClick={() =>
                  isEditable ? setIsEditable(false) : setIsEditable(true)
                }
              >
                <PencilIcon className="mx-3 h-5  text-gray-600 hover:text-emerald-500" />
              </button>
            </div>
            <div className="mt-7 flex flex-col items-start md:flex-row">
              <div className="w-full md:w-1/3 ">
                <InputV2
                  label=""
                  name="phone_number"
                  type="text"
                  errorMessage={errors.phone_number?.message}
                  register={register}
                  defaultValue={user_info?.phone_number}
                  disabled={!isEditable}
                />
              </div>

              <div className="mt-3 ml-5 w-full md:w-1/2">
                <span>{user_info?.email}</span>
              </div>
            </div>

            <h3 className="mt-5 text-start text-lg font-semibold">
              Representante Legal
            </h3>
            <div className="mt-7 flex flex-col items-start md:flex-row">
              <div className="w-full md:w-1/2 ">
                <InputV2
                  label=""
                  name="name_legal"
                  type="text"
                  errorMessage={errors.name_legal?.message}
                  register={register}
                  defaultValue={user_info?.legal_representative?.first_name}
                  disabled={!isEditable}
                />
              </div>

              <div className="w-full md:w-1/2 ">
                <InputV2
                  label=""
                  name="last_legal"
                  type="text"
                  errorMessage={errors.last_legal?.message}
                  register={register}
                  defaultValue={user_info?.legal_representative?.last_name}
                  disabled={!isEditable}
                />
              </div>

              <div className="ml-5 w-full md:mt-4 md:w-1/2">
                <span>
                  {user_info?.legal_representative?.contact_id_document}
                </span>
              </div>
            </div>

            <div className="mt-7 flex flex-col items-start md:flex-row">
              <div className="w-full md:w-1/2 ">
                <InputV2
                  label=""
                  name="phone_legal"
                  type="text"
                  errorMessage={errors.phone_legal?.message}
                  register={register}
                  defaultValue={
                    user_info?.legal_representative?.contact_phone_number
                  }
                  disabled={!isEditable}
                />
              </div>

              <div className="ml-5 w-full md:mt-4 md:w-1/2">
                <span>{user_info?.legal_representative?.contact_email}</span>
              </div>
            </div>

            <ResetPassword
              open={openResetPassword}
              setOpen={setOpenResetPassword}
              loading={isLoading}
            />

            {isEditable ? (
              <div className="mt-6 w-full">
                <Button
                  text="Actualizar datos"
                  type="button"
                  loading={isLoading}
                  onClick={handleSubmit(onSubmit)}
                />
              </div>
            ) : null}

            <div className="mt-6">
              <Button
                text="Cambiar contraseña"
                type="button"
                loading={false}
                onClick={(e) => setOpenResetPassword(true)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

User.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default User;
