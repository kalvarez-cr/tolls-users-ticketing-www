import { ReactNode } from 'react';

interface TSimpleContainerProps {
  title: string;
  children: string | ReactNode;
  rightComponent: ReactNode;
}

const SimpleContainer = ({ title, children, rightComponent }) => {
  return (
    <div className="rounded-lg bg-white">
      <div>
        <div className="flex items-center justify-between px-10 py-4">
          <h1 className="">{title}</h1>
          {rightComponent}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default SimpleContainer;
