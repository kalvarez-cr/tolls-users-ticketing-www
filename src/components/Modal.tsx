import { Fragment, ReactNode, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface modalProps {
  open: boolean;
  setOpen: any;
  title: string;
  handleAccept: any;
  acceptButtonText: string;
  icon?: ReactNode;
  cancelButtonText: string;
  loading?: boolean;
  children?: any;
}

export default function Example({
  open,
  setOpen,
  title,
  handleAccept,
  acceptButtonText,
  children,
  icon,
  cancelButtonText,
  loading,
}: modalProps) {
  const cancelButtonRef = useRef(null);
  const handleCancel = () => {
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 "
          initialFocus={cancelButtonRef}
          onKeyDown={handleKeyDown}
          onClose={() => setOpen(true)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative w-2/3 transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      {icon && (
                        <div className="h-15 w-15 mx-auto flex flex-shrink-0 items-center justify-center rounded-md sm:mx-0 sm:h-10 sm:w-10">
                          {icon}
                        </div>
                      )}
                      <div className="mt-3 w-full text-center sm:mx-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          {title}
                        </Dialog.Title>
                        <div className="mt-2">
                          <div className="mt-6 text-sm text-gray-500">
                            {children}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    {cancelButtonText && (
                      <button
                        type="button"
                        className="rounded- mt-3 inline-flex w-full justify-center bg-white px-4 py-2 text-base font-medium text-red-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={handleCancel}
                        ref={cancelButtonRef}
                      >
                        {cancelButtonText}
                      </button>
                    )}
                    <button
                      type="button"
                      className={`inline-flex  w-full justify-center rounded-md border border-transparent bg-blueVen px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blueVen  sm:ml-3 sm:w-auto sm:text-sm  
                        ${
                          loading
                            ? 'animate-pulse bg-slate-400 '
                            : ' font-bold transition-all delay-100 duration-200 hover:bg-slate-400 hover:text-white  '
                        }
                      `}
                      onClick={handleAccept}
                    >
                      {acceptButtonText}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
