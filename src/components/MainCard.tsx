import React from 'react';

const MainCard = ({ children, title }) => {
  return (
    <div className="p-2 ">
      <div className="m-4 rounded-lg bg-gradient-to-l from-emerald-700 to-emerald-600 p-4 transition-all delay-100 duration-200">
        <h1 className="px-6 py-4 text-3xl font-bold text-white">{title}</h1>
        {children}
      </div>
    </div>
  );
};

export default MainCard;
