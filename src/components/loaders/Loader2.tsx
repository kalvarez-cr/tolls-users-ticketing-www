interface TLoaderProps {
  className?:string
}

const Loader2 = ({className}: TLoaderProps) => {
  return (
    <div className={`lds-ellipsis ${className ? className : ''}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loader2;
