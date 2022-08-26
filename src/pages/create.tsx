import Button from '@components/Button';
import Input from '@components/inputs/Input';
import { login } from '@store/counter/loginReducer';
import { open } from '@store/counter/snackbarReducer';
import { useAppDispatch } from '@store/hooks';
import { AxiosError } from 'axios';
import { useAxios } from 'hooks/useAxios';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from 'react-query';

interface Inputs {
  email: string;
  password: string;
}

const Create = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { requester } = useAxios();
  const { mutate, isLoading, isError } = useMutation(
    (formData: Inputs) => {
      return requester({
        method: 'POST',
        data: formData,
        url: '/login/',
      });
    },
    {
      onSuccess: (response) => {
        const { data } = response;
        console.log('response data', data);
        dispatch(login(data));
        router.push('/');
      },
      onError: (error: AxiosError) => {
        console.log(error.response.data);
        dispatch(open({ text: error.response.statusText, type: 'error' }));
      },
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { email, password } = data;
    mutate({ email, password });
    console.log(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {isError ? <p>Error...</p> : null}
        <Input
          labelClassName=" font-semibold"
          errorMessage={errors.email}
          label="Email"
          name="email"
          type="text"
          register={register}
        />

        <Input
          labelClassName=" font-semibold"
          errorMessage={errors.password}
          label="Contraseña"
          name="password"
          type="password"
          register={register}
        />

        <Button loading={isLoading} text="Ingresar" type="submit" />
      </form>
    </>
  );
};

export default Create;
