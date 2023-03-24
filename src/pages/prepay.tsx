import InputV2 from '@components/inputs/InputV2';
import { CreditCardIcon } from '@heroicons/react/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { SubmitHandler, useForm  } from 'react-hook-form';
import Select from '@components/inputs/Select';
import { useAxios } from 'hooks/useAxios';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';
import * as yup from 'yup';
import Logo from '@components/icons/Logo';
import { UseApiCall } from 'hooks/useApiCall';
import ModalForm from '@components/modalForms/ModalForm';



interface Inputs {
  letter: string;
  number: string;
  amount: string;
  title: string;
  description: string;
  code?: string;
  phone?: string;
  email: string;
  cellphone: string;
  channel?: string;
  paymentMethod: string;
  state?:string 
  toll_site?:string 
  vehicle_category?:string 
}
interface TConfirmationFormInputs {
  smsCode: string 
  token?:string 
  vehicle_category?:string
  bank?:string
  paymentMethod?:string 
  code?:string 
  phone?:string 
  phone_number?:string 
  toll_site?:string 
  payment_method?:string 
  status_reason?:string 

}
const Schema = yup.object().shape({
  letter: yup.string().required('Este campo es requerido'),
  number: yup
    .string()
    .min(7, 'Mínimo 7 caracteres')
    .max(8, 'Máximo 8 caracteres')
    .required('Este campo es requerido'),
  amount: yup.string().required('Este campo es requerido'),
  code: yup.string().required('Este campo es obligatorio'),
  phone: yup.string().required('Este campo es obligatorio'),
  paymentMethod: yup.string().required('Este campo es requerido'),
  state: yup.string().required('Este campo es requerido'),
  toll_site: yup.string().required('Este campo es obligatorio'),
  vehicle_category: yup.string().required('Este campo es requerido')
});

const ConfirmationFormSchema = yup.object().shape({
  smsCode: yup.string().required('Este campo es requerido'),
})



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
  {
    value: 'E',
    label: 'E',
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
    label: '0426',
  },
];

const payments = [
  {
    label: 'Ahorro',
    value: '1',
  },
  {
    label: 'Corriente',
    value: '2',
  },
  {
    label: 'Crédito Visa',
    value: '3',
  },
  {
    label: 'Crédito MasterCard',
    value: '4',
  },
];

const prepay = () => {
  const { requester } = useAxios();
  const [token, SetToken] = React.useState('');
  const [ open, setOpen ] = React.useState(false)
  const [modal , setModal ] = React.useState('')
  const [ message , setMessage ] = React.useState('')
  const [ pass , setPass ] = React.useState('')
  
  const { useGet, usePost } = UseApiCall();

  const { data, isLoading : isLoadingState  } = useGet({
    queryKey: 'getState',
    url: 'state/list/',
  });



const { mutate : mutateToll, data: tollData, isLoading: isLoadingToll } = usePost({
  url: 'toll-sites/list/',
  
});


const { mutate : mutateFare, data: tollFare, isLoading: isLoadingFare } = usePost({
  url: '/fare-products/list/',
  
});


  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(Schema),
  });

  const { register: registerCode , formState: formStateCode , handleSubmit: handleSubmitCode}  = useForm<TConfirmationFormInputs>({
    resolver: yupResolver(ConfirmationFormSchema),

  })
 
 const handleSelectState = (e) => {
    setValue('toll_site', '')
    setValue('vehicle_category', '')
    setValue('amount', '')
    const value = e.target.value
    mutateToll({
      state: value
    })
  }

  
  
  const fares = tollFare?.data?.map((fare) => {
    return {
        label: fare.name,
        value: fare.category.category,
        amount : fare.nominal_amount 
    }
  })

  
  const handleSelectToll = (e) => {
    setValue('vehicle_category', '')
    setValue('amount', '')
    const value = e.target.value
    mutateFare({
      toll_site: value 
    })
  }

  const handleSelectAmount = (e) => {
    const value = e.target.value
    const amount = fares.find((fare) => fare.value === value).amount
    setValue('amount', amount)
   
  }


  const value = getValues('toll_site')
  const siteCode = tollData?.data?.find((toll) => toll.value === value)?.site_code
  


  
  const { mutate, isLoading } = useMutation(
    (formData: Inputs) => {
      return requester({
        method: 'POST',
        data: formData,
        url: 'external-recharge/payment_bdv_external/',
      });
    },
    {
      onSuccess: (response) => {
        const { data } = response;

        if (data) {
          SetToken(data.data.paymentId);
          setOpen(true)
          setModal('prepay')
          setMessage('Su pago esta siendo procesado, recibirá un código por mensaje de texto.')
        }
      },
      onError: (error: AxiosError) => {
        setOpen(true)
        setModal('prepay')
        setMessage('Ha ocurrido un error,  intente nuevamente')
      },
    }
  );

  const { mutate: mutateConfirm, data: dataVenpass, isLoading: isLoadingConfirm} = useMutation(
    (Data: TConfirmationFormInputs ) => {
      return requester({
        method: 'POST',
        data: Data,
        url: 'external-recharge/confirm_bdv_sms_venpass/',
      });
    },
    {
      onSuccess: (response) => {
        const { data } = response;

        if (data) {
          setPass(data?.data?.venpass?.pass_id)
          setOpen(true)
          setModal('confirm')
          setMessage('¡Hemos enviado un SMS donde podrás obtener tu código QR! Si no te llego, por favor pulsa en reenviar mensaje y así podrás disfrutar de tu pase.')
        }
      },
      onError: (error: AxiosError) => {
        setOpen(true)
        setModal('confirm')
        setMessage('Ha ocurrido un error, intente de nuevo')
      },
    }
  );


  const { mutate: mutateSms, isLoading: isLoadingSms } = useMutation(
    (Data: any ) => {
      return requester({
        method: 'POST',
        data: Data,
        url: 'venpass/resend_sms/',
      });
    },
   
  );


  


  const onSubmitCreateForm: SubmitHandler<Inputs> = async (data) => {
    const {
      letter,
      number,
      code,
      phone,
      email,
      amount,
      paymentMethod,
    } = data;

    mutate({
      letter,
      number,
      amount,
      title: 'Venpass',
      description: 'Venpass',
      email,
      cellphone: `${code}${phone}`,
      paymentMethod,
    });
  };



  const onSubmit: SubmitHandler<TConfirmationFormInputs> = async (inputsData : TConfirmationFormInputs) => {
    const { smsCode } = inputsData
    mutateConfirm({
      token: token,
      smsCode: smsCode,
      bank:'1',
      paymentMethod: getValues('paymentMethod'),
      phone_number: `${getValues('code')}${getValues('phone')}`,
      toll_site: siteCode,
      vehicle_category: getValues('vehicle_category'),
      payment_method: "debit/credit",
      status_reason: 'active'
    })
  }


  const handleResendSms = () => {
    mutateSms({
      phone_number: `${getValues('code')}${getValues('phone')}`,
      pass_id: pass
    })
  }

  
  return (
    <>

    {modal === 'prepay' ?

    <ModalForm
    open={open}
    setOpen={setOpen}
    handleAccept={() => setOpen(false)}
    title={'Información'}
    >

     <p>{message}</p> 

    </ModalForm>

    : null}


    {modal === 'confirm' ?

    <ModalForm
    open={open}
    setOpen={setOpen}
    handleAccept={() => setOpen(false)}
    title={'Advertencia'}

  
    >

      <p className='text-red-500 text-lg'>{message}</p>
     <div className='flex justify-center'>
     {dataVenpass?.data?.return_code === '9000' ? 
     <input
            type="button"
            value="Reenviar mensaje"
            onClick={handleResendSms}
            className={`mt-14 cursor-pointer rounded bg-red-600/50 px-4 py-2 text-center font-semibold text-white shadow-md hover:bg-red-600/25
          ${
            isLoadingSms
              ? 'animate-pulse bg-slate-400 pointer-events-none'
              : ' font-bold transition-all delay-100 duration-200 hover:bg-red-600/50 hover:text-white  '
          }`}
          />
          : null}
     </div>

    </ModalForm>

   : null }

      <div className="container m-10 mx-auto mt-24 rounded-xl bg-gray-100 p-12 px-4 shadow-xl">
        <div className="mb-5 flex w-full items-center justify-center">
          <Logo className="w-36" />
        </div>

        <div className="mt-8 mb-10 flex flex-wrap md:px-16">
          <div className="flex w-full items-center md:w-1/2 md:pr-4">
            <div className="w-2/5 pr-4 md:w-1/3">
              <Select
                label="Tipo"
                name="letter"
                options={methods}
                errorMessage={errors.letter?.message}
                register={register}
              />
            </div>
            <div className="w-3/5 md:w-2/3">
              <InputV2
                label="Cédula"
                name="number"
                type="text"
                errorMessage={errors.number?.message}
                register={register}
              />
            </div>
          </div>
          <div className="flex w-full items-center md:w-1/2 md:pl-4">
            <div className="w-2/5 pr-4 md:w-1/3">
              <Select
                label="04XX"
                name="code"
                options={codes}
                errorMessage={errors.code?.message}
                register={register}
              />
            </div>
            <div className="w-3/5 md:w-2/3">
              <InputV2
                label="Teléfono"
                name="phone"
                type="text"
                errorMessage={errors.phone?.message}
                register={register}
              />
            </div>
          </div>


          <div className="my-4 w-full pr-4 items-center  md:w-1/2">
          <InputV2
                label="Correo"
                name="email"
                type="text"
                errorMessage={errors.email?.message}
                register={register}
              />
          </div>
          <div className="w-full pr-4 md:w-1/2">
            <Select
              label="Tipo de cuenta"
              name="paymentMethod"
              options={payments}
              errorMessage={errors.paymentMethod?.message}
              register={register}
            />
          </div>

          

          <div className=" w-full pr-4 md:w-1/2">
            <Select
              label="Estado"
              name="state"
              options={data?.data?.data}
              errorMessage={errors.state?.message}
              register={register}
              onChange={handleSelectState}
              isLoading={isLoadingState}
            />
          </div>
          <div className=" w-full pr-4 md:w-1/2">
            <Select
              label="Peaje"
              name="toll_site"
              options={tollData?.data}
              errorMessage={errors.toll_site?.message}
              register={register}
              onChange={handleSelectToll}
              isLoading={isLoadingToll}
              disabled={!watch('state')}
            />
          </div>

          <div className="w-full pr-4 md:w-1/2">
            <Select
              label="Tarifa"
              name="vehicle_category"
              options={fares}
              errorMessage={errors.vehicle_category?.message}
              register={register}
              onChange={handleSelectAmount}
              isLoading={isLoadingFare}
              disabled={!watch('toll_site')}
            />
          </div>
          <div className="my-4 w-full items-center  md:w-1/2">
            <InputV2
              label="Monto"
              name="amount"
              type="text"
              errorMessage={errors.amount?.message}
              register={register}
    
              disabled={true}
            />
          </div>
         
         
        </div>
        <div className="-mt-14 mr-16 flex justify-center md:justify-end md:gap-10">
            <input
              type="button"
              value="Enviar"
              onClick={handleSubmit(onSubmitCreateForm)}
              className={`mt-14 cursor-pointer rounded bg-emerald-600/70 px-4 py-2 text-center font-semibold text-white shadow-md hover:bg-emerald-600/50  
          ${
            isLoading
              ? 'animate-pulse bg-slate-400 pointer-events-none '
              : ' font-bold transition-all delay-100 duration-200 hover:bg-emerald-600/70 hover:text-white  '
          }`}
            />
          </div>
        <div className="mt-4 flex items-center justify-between md:px-16">
          <div className="border-r-2">
            <CreditCardIcon className="mr-16 h-10 text-red-700" />
          </div>
          <h1 className="ml-16 w-full border-grey text-xl font-bold tracking-wide text-red-700">
            Ingrese el código recibido
          </h1>
        </div>
        <div className=" mt-2 flex w-full md:px-16">
          <div className="flex w-full flex-wrap">
            <div className="mt-10 w-full md:w-1/2 md:pl-4">
              <InputV2
                label="Código"
                name="smsCode"
                type="text"
                errorMessage={formStateCode?.errors?.smsCode?.message}
                register={registerCode}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between md:justify-center md:gap-10">
          <input
            type="button"
            value="Confirmar"
            onClick={handleSubmitCode(onSubmit)}
            className={`mt-14 cursor-pointer rounded bg-emerald-600/70 px-4 py-2 text-center font-semibold text-white shadow-md hover:bg-emerald-600/50  
          ${
            isLoadingConfirm
              ? 'animate-pulse bg-slate-400 pointer-events-none'
              : ' font-bold transition-all delay-100 duration-200 hover:bg-emerald-600/70 hover:text-white  '
          }`}
          />
        </div>
      </div>
    </>
  );
};

export default prepay;
