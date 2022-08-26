import React from 'react';
import Button from './Button';

const Payments = () => {
  return (
    <div className="flex-wrap md:flex">
      <div className="p-4 md:w-1/2 lg:w-1/3">
        <Button
          loading={false}
          text="click me pls!"
          type="button"
          onClick={() => console.log('hi')}
        />
      </div>
      <div className="p-4 md:w-1/2 lg:w-1/3">
        <Button
          loading={false}
          text="click me pls!"
          type="button"
          onClick={() => console.log('hi')}
        />
      </div>
      <div className="p-4 md:w-1/2 lg:w-1/3">
        <Button
          loading={false}
          text="click me pls!"
          type="button"
          onClick={() => console.log('hi')}
        />
      </div>
      <div className="p-4 md:w-1/2 lg:w-1/3">
        <Button
          loading={false}
          text="click me pls!"
          type="button"
          onClick={() => console.log('hi')}
        />
      </div>
      <div className="p-4 md:w-1/2 lg:w-1/3">
        <Button
          loading={false}
          text="click me pls!"
          type="button"
          onClick={() => console.log('hi')}
        />
      </div>
      <div className="p-4 md:w-1/2 lg:w-1/3">
        <Button
          loading={false}
          text="click me pls!"
          type="button"
          onClick={() => console.log('hi')}
        />
      </div>
    </div>
  );
};

export default Payments;
