import InputV2 from '@components/inputs/InputV2';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import LandingLayout from '@layouts/LandingLayout';
import React, { ReactElement } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Select from '@components/inputs/Select';

const methods = [
  {
    value: 'V',
    label: 'V',
  },
  {
    value: 'P',
    label: 'P',
  },
  {
    value: 'J',
    label: 'J',
  },
];

const codes = [
  {
    value: '0414',
    label: '0414',
  },
  {
    value: '0424',
    label: '0424',
  },
  {
    value: '0412',
    label: '0412',
  },
  {
    value: '0416',
    label: '0416',
  },
  {
    value: '0426',
    label: '0416',
  },
];

const MobilePay = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    // resolver: yupResolver(),
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    console.log(data);
  };

  return (
    <div className="mt-28 w-5/6 rounded-xl bg-gray-100 p-24 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="border-r-2">
          <CreditCardIcon className="mr-16 h-20 pr-10 text-emerald-600/70" />
        </div>
        <h1 className="ml-16 w-full border-grey text-center text-4xl font-bold tracking-wide text-emerald-600/70">
          Pago móvil
        </h1>
      </div>
      <div className=" mt-12 flex  place-content-center">
        {/* <div className="mt-6 flex items-center">
          <h3 className="mr-4 text-lg  font-bold">Correo:</h3>
          <h3 className="mr-auto text-lg">{'muu'}</h3>
        </div> */}
        <div className="">
          <form className="mr-auto" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center">
              <div className=" w-1/3 pr-4">
                <Select
                  label="V"
                  name="nif_type"
                  options={methods}
                  // errorMessage={errors.nif_type?.message}
                  register={register}
                />
              </div>
              <div className="w-2/3">
                <InputV2
                  label="Cédula"
                  name="nif"
                  type="text"
                  errorMessage={errors.nif?.message}
                  register={register}
                />
              </div>
            </div>
            <div className=" flex items-center">
              <div className="w-1/3 pr-4">
                <Select
                  label="Código"
                  name="code"
                  options={codes}
                  // errorMessage={errors.nif_type?.message}
                  register={register}
                />
              </div>
              <div className="w-2/3">
                <InputV2
                  label="Teléfono"
                  name="phone"
                  type="text"
                  errorMessage={errors.phone?.message}
                  register={register}
                />
              </div>
            </div>
            <div className="mt-10 ">
              <InputV2
                label="Bancos"
                name="password"
                type="text"
                errorMessage={errors.password?.message}
                register={register}
              />
              <div className="mt-10">
                <InputV2
                  label="Monto"
                  name="confirm_password"
                  type="text"
                  errorMessage={
                    // @ts-ignore
                    errors.confirm_password && 'Las contraseñas deben coincidir'
                  }
                  register={register}
                />
              </div>
            </div>

            <input
              type="submit"
              value="Confirmar"
              className="mt-14  block cursor-pointer  rounded bg-emerald-600/70 px-4 py-2 text-center font-semibold text-white shadow-md hover:bg-emerald-600/50 focus:outline-none focus:ring focus:ring-emerald-600/50 focus:ring-opacity-80 focus:ring-offset-2"
            />
          </form>

          <>
            {/* <h3 className="mr-4 text-lg font-bold">Teléfono:</h3>
            <h3 className="mr-auto text-lg">{'muu'}</h3> */}
          </>

          {/* <button type="button" onClick={() => console.log('click')}>
            <PencilAltIcon className="h-5 text-gray-600 hover:text-emerald-500" />
          </button> */}
        </div>
      </div>
    </div>
  );
};

MobilePay.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default MobilePay;
