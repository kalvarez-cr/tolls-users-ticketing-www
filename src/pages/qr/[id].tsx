import Logo from '@components/icons/Logo';
import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';

const qr = () => {
  const router = useRouter()
  const { id } = router.query
  const [base64, setBase64] = React.useState<any>()
    console.log('base',base64)

  const handleClick = async () => {
    const body = {
      pass_id: id
    }

    console.log(body)
    
    try {
        
       

        const headers = {
            'Content-Type': 'application/json',
        }
        const responseType = 'arraybuffer'
        
        const data = await axios.post(
          `${process.env.NEXT_PUBLIC_APP_BASE_URL}venpass/qr/`,
            body, {
              headers, 
              responseType
            }
            
        )
        console.log('data',data.data)
        const base64data = new Buffer(data.data.qr_code).toString('base64')
        setBase64(base64data)
        
        
    } catch (error) {
        console.log(error)
        
    }
}
 React.useEffect(() => {
 handleClick()

 },[id])  
  return (
    <div className="m-10 mt-24   rounded-xl bg-gray-100 p-12 shadow-xl">
      <div className="mb-5 flex w-full items-center justify-center">
        <Logo className="w-40" />
      </div>

      <div className="flex items-center justify-center">
        <img
          src={`data:image/png;base64,${base64}`}
          className="w-52"
          alt='qr'
        />
      </div>

      <p className="text-center">
        Su pago se ha realizado con éxito, puede transitar con su vehículo por
        el peaje, presentando este código QR{' '}
      </p>
    </div>
  );
};

export default qr;
