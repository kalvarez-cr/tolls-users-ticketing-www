import Logo from '@components/icons/Logo';
import LogoDark from '@components/icons/LogoDark';
import OutForm from '@components/modalForms/OutForm';
import { Disclosure } from '@headlessui/react';
import {
  MenuIcon,
  XIcon,
  LogoutIcon,
  UserCircleIcon,
} from '@heroicons/react/outline';
import { useAppDispatch } from '@store/hooks';

import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

interface TLandingLayout {
  children: React.ReactElement;
}

const LandingLayout = ({ children }: TLandingLayout) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);

  const handleLogout = () => {
    setOpen(true);
  };
  const navigation = [
    { name: 'Inicio', href: '/home' },
    { name: 'Recargas', href: '/recharges' },
    // { name: 'Vehículos', href: '/vehicles' },
    { name: 'Tránsitos', href: '/transit' },
    // { name: 'Calendar', href: '#' },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-200">
        <OutForm open={open} setOpen={setOpen} />
        <Disclosure
          as="nav"
          className="fixed z-10 w-full bg-gradient-to-r from-blue-400 to-blue-700"
        >
          {({ open, close }) => (
            <>
              <div className="px-2 lg:px-20">
                <div className="relative flex h-16 items-center justify-between">
                  <div className="ml-10">
                    <Logo className="w-36" />
                  </div>
                  <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
                    {/* Mobile menu button*/}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-lg p-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <MenuIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className="flex flex-1 items-center justify-center lg:items-stretch lg:justify-start">
                    <div className="flex flex-shrink-0 items-center">
                      <LogoDark className="mx-2 w-20" />
                    </div>
                    <div className="hidden lg:ml-6 lg:block">
                      <div className="flex h-full space-x-0">
                        {navigation.map((item) => (
                          <Link href={item.href} key={item.name}>
                            <button
                              className={classNames(
                                item.href === router.asPath
                                  ? 'pointer-events-none bg-blue-400/40'
                                  : 'hover:bg-blue-500/40 hover:text-white hover:shadow-xl',
                                ' p-5 font-bold uppercase tracking-wider text-white antialiased transition-all delay-100 duration-200 focus:ring-opacity-80'
                              )}
                              aria-current={
                                item.href === router.asPath ? 'page' : undefined
                              }
                            >
                              {item.name}
                            </button>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center space-x-4 pr-2 lg:static lg:inset-auto lg:ml-6 lg:pr-0">
                    <Link href="/user">
                      <button>
                        <UserCircleIcon className="h-7 text-slate-100 transition-colors delay-100 duration-200 hover:text-white" />
                      </button>
                    </Link>

                    <button className="p-2" onClick={handleLogout}>
                      <LogoutIcon className="h-7 text-slate-100 transition-colors delay-100 duration-200 hover:text-white" />
                    </button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="lg:hidden">
                <div
                  className="flex flex-col space-y-1 px-2 pt-2 pb-3"
                  onClick={() => close()}
                >
                  {navigation.map((item) => (
                    <Link href={item.href} key={item.name}>
                      <button
                        className={classNames(
                          item.href === router.asPath
                            ? 'pointer-events-none bg-blue-400/40'
                            : 'hover:bg-blue-500/40 hover:text-white hover:shadow-xl',
                          ' p-5 font-bold uppercase tracking-wider text-white antialiased transition-all delay-100 duration-200 focus:ring-opacity-80'
                        )}
                        aria-current={
                          item.href === router.asPath ? 'page' : undefined
                        }
                      >
                        {item.name}
                      </button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <main className=" mx-auto flex max-w-5xl items-start justify-center">
          {children}
        </main>
      </div>
    </>
  );
};

export default LandingLayout;
