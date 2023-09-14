interface TLoaderProps {
  className?:string
}

const LoaderSelect = ({className}: TLoaderProps) => {
  return (
    <div className={`lds-ring2 ${className ? className : ''}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LoaderSelect;
