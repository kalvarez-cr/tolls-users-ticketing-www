import React from 'react';

const FooterLayout = ({ children }) => {
  const today = new Date().getFullYear();
  return (
    <div className="flex h-screen w-screen flex-col justify-between">
      {children}
      <div className="my-2 w-full p-2">
        <div className="my-4 flex justify-around">
          <img src="/fontur2.svg" alt="fontur2" className="h-14" />
          <img src="/fontur3.svg" alt="fontur3" className="h-14" />
          <img src="/fontur.svg" alt="fontur" className="h-16" />
        </div>
        <p className="my-2 text-center">Copyright © {today} Rse Grupo Venezuela C.A.</p>
      </div>
    </div>
  );
};

export default FooterLayout;

