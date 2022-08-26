import { CheckCircleIcon, XIcon } from '@heroicons/react/outline';
import { close, snackbar } from '@store/counter/snackbarReducer';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { useEffect } from 'react';

const Snackbar = () => {
  const dispatch = useAppDispatch();
  const { open, text, type } = useAppSelector(snackbar);
  console.log(type);

  const handleClose = () => {
    dispatch(close());
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        dispatch(close());
      }, 3000);
    }
  }, [open, dispatch]);

  return open ? (
    <div
      className={`absolute right-6 top-6 flex h-16 w-96 items-center rounded-md p-4 ${
        type == 'success' ? 'bg-emerald-300' : ''
      } ${type == 'error' ? 'bg-red-500' : ''}`}
    >
      <div className="w-1/12">
        <CheckCircleIcon
          className="block h-7 w-7 text-white"
          aria-hidden="true"
        />
      </div>
      <h1 className="mx-2 w-10/12 text-lg text-white">{text}</h1>
      <button className="w-1/12">
        <XIcon
          className="block h-7 w-7 text-white"
          aria-hidden="true"
          onClick={handleClose}
        />
      </button>
    </div>
  ) : null;
};

export default Snackbar;
