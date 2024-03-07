import React from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';
import FooterLayout from '@layouts/FooterLayout';
import Button from '@components/Button';


const Register = () => {
  const router = useRouter();
 

  return (
    <div className="flex items-center bg-gradient-to-r from-sky-50 to-sky-200 overflow-scroll">
    <FooterLayout>
      <div className="mx-auto my-auto flex flex-col items-center justify-center rounded-2xl bg-white/70 p-10 shadow-2xl ">
        <div>
          <div className=" w-full">
            <img src="/logo-login.png" alt="logo" className="h-24 ml-8" />
          </div>
          <h1 className="motto-line">Un TAG, todas las vías</h1>

          <p className='mt-6 font-bold text-blue-800 decoration-2'>Datos de la nueva cuenta</p>

          <div className="mt-6">
                <Button loading={false} type="button" text="Natural" onClick={() => router.push('/registerNatural') } />
              </div>

              <div className="mt-6">
                <Button loading={false} type="button" text="Empresa" onClick={() => router.push('/registerCompany') } />
              </div>
           
            {
              <Link href="/">
                <p className="mt-4 cursor-pointer text-center text-sm">
                ¿Ya tienes una cuenta?{' '}
                  <span className="font-bold text-blue-800 decoration-2 hover:text-blue-600">
                   Ingresa 
                  </span>
                </p>
              </Link>
            }


        </div>
      </div>
    </FooterLayout>
    <div className=" hidden w-full lg:block">
      <img className="aspect-1 max-h-screen" src="/login.svg" alt="login" />
    </div>
  </div>
  );
};

// noinspection JSUnusedGlobalSymbols
export default Register;
