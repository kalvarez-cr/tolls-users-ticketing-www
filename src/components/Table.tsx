import { EyeSlashIcon, XMarkIcon, ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import React from 'react';

interface TableProps {
  headers: any;
  data: any;
  isLoading: any;
  children?: React.ReactNode;
}

const Table = ({ headers, data, isLoading }: TableProps) => {
  const headerKeys: any[] = [];
  for (const header of headers) {
    headerKeys.push(header.key);
  }

  return (
    <div className=" w-full">
      <div className="hidden md:block">
        <div className="text-md table w-full rounded-t-lg bg-white shadow-md">
          <div className="table-header-group font-medium uppercase text-gray-800 antialiased">
            <div className="table-row">
              {headers.map((header) => {
                return header.id === '1' ? (
                  <div
                    className="table-cell rounded-tl-lg bg-emerald-600/30 py-4 pl-10"
                    key={header.id}
                  >
                    {header.header}
                  </div>
                ) : header.id == headers.length ? (
                  <div
                    className="table-cell rounded-tr-lg bg-emerald-600/30 pl-10 py-4"
                    key={header.id}
                  >
                    {header.header}
                  </div>
                ) : (
                  <div
                    className="table-cell bg-emerald-600/30 py-4 pl-10"
                    key={header.id}
                  >
                    {header.header}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="table-row-group text-black antialiased">
            {isLoading ? (
              <>
                <div className="table-row">
                  {headerKeys.map((headerKey) => {
                    return (
                      <div
                        className="table-cell border-t py-4 pl-10 align-middle"
                        key={headerKey}
                      >
                        <div className="h-6 w-5/6 animate-pulse rounded-md bg-gray-200" />
                      </div>
                    );
                  })}
                </div>
                <div className="table-row">
                  {headerKeys.map((headerKey) => {
                    return (
                      <div
                        className="table-cell border-t py-4 pl-10 align-middle"
                        key={headerKey}
                      >
                        <div className="h-6 w-5/6 animate-pulse rounded-md bg-gray-200" />
                      </div>
                    );
                  })}
                </div>
                <div className="table-row">
                  {headerKeys.map((headerKey) => {
                    return (
                      <div
                        className="table-cell border-t py-4 pl-10 align-middle"
                        key={headerKey}
                      >
                        <div className="h-6 w-5/6 animate-pulse rounded-md bg-gray-200" />
                      </div>
                    );
                  })}
                </div>
                <div className="table-row">
                  {headerKeys.map((headerKey) => {
                    return (
                      <div
                        className="table-cell border-t py-4 pl-10 align-middle"
                        key={headerKey}
                      >
                        <div className="h-6 w-5/6 animate-pulse rounded-md bg-gray-200" />
                      </div>
                    );
                  })}
                </div>
                <div className="table-row">
                  {headerKeys.map((headerKey) => {
                    return (
                      <div
                        className="table-cell border-t py-4 pl-10 align-middle"
                        key={headerKey}
                      >
                        <div className="h-6 w-5/6 animate-pulse rounded-md bg-gray-200" />
                      </div>
                    );
                  })}
                </div>
                <div className="table-row">
                  {headerKeys.map((headerKey) => {
                    return (
                      <div
                        className="table-cell border-t py-4 pl-10 align-middle"
                        key={headerKey}
                      >
                        <div className="h-6 w-5/6 animate-pulse rounded-md bg-gray-200" />
                      </div>
                    );
                  })}
                </div>
                <div className="table-row">
                  {headerKeys.map((headerKey) => {
                    return (
                      <div
                        className="table-cell border-t py-4 pl-10 align-middle"
                        key={headerKey}
                      >
                        <div className="h-6 w-5/6 animate-pulse rounded-md bg-gray-200" />
                      </div>
                    );
                  })}
                </div>
                <div className="table-row">
                  {headerKeys.map((headerKey) => {
                    return (
                      <div
                        className="table-cell border-t py-4 pl-10 align-middle"
                        key={headerKey}
                      >
                        <div className="h-6 w-5/6 animate-pulse rounded-md bg-gray-200" />
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              data.map((row) => {
                return (
                  <div className="table-row" key={row.id}>
                    {headerKeys.map((headerKey) => {
                      const value = row[headerKey];
                      return (
                        <div
                          className="table-cell border-t py-4 pl-10 align-middle"
                          key={headerKey}
                        >
                          {value}
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
            {data.map((row) => {
              return (
                <div className="table-row" key={row.id}>
                  {headerKeys.map((headerKey) => {
                    const value = row[headerKey];
                    return (
                      <div
                        className="table-cell border-t py-4 pl-10 align-middle"
                        key={headerKey}
                      >
                        {value}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        <nav
          className="shadow-md mb-10 rounded-b-lg flex items-center justify-between border-t border-gray-200 bg-white px-4 py-4 sm:px-6"
          aria-label="Pagination"
        >
          <div className="hidden sm:block ml-3">
            <p className="text-sm text-gray-700">
              Mostrando{' '}
              <span className="font-medium">5</span> de{' '}
              <span className="font-medium">20</span> resultados
            </p>
          </div>
          <div className="flex flex-1 justify-between sm:justify-end mr-3">
            <a
              href="#"
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ArrowLongLeftIcon className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ArrowLongRightIcon className="h-5 w-5" />
            </a>
          </div>
        </nav>
      </div>
      <div className="grid grid-cols-1 gap-4 md:hidden">
        <div className="space-y-3 rounded-lg bg-gray-100 p-4 shadow">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex space-x-2">
              <div>Ford</div>
              <div>Fiesta</div>
              <div>AA4-B44</div>
              <div>QR</div>
            </div>
            <div className="flex space-x-2">
              <Link
                href="#"
                className="font-medium text-blue-400 hover:text-blue-500 "
              >
                <EyeSlashIcon className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="font-medium text-red-400 hover:text-red-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div>Punta Piedra</div>
            <div>DD/MM/AA</div>
          </div>
        </div>
        <div className="space-y-3 rounded-lg bg-gray-100 p-4 shadow">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex space-x-2">
              <div>Ford</div>
              <div>Fiesta</div>
              <div>AA4-B44</div>
              <div>QR</div>
            </div>
            <div className="flex space-x-2">
              <Link
                href="#"
                className="font-medium text-blue-400 hover:text-blue-500 "
              >
                <EyeSlashIcon className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="font-medium text-red-400 hover:text-red-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div>Punta Piedra</div>
            <div>DD/MM/AA</div>
          </div>
        </div>
        <div className="space-y-3 rounded-lg bg-gray-100 p-4 shadow">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex space-x-2">
              <div>Ford</div>
              <div>Fiesta</div>
              <div>AA4-B44</div>
              <div>QR</div>
            </div>
            <div className="flex space-x-2">
              <Link
                href="#"
                className="font-medium text-blue-400 hover:text-blue-500 "
              >
                <EyeSlashIcon className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="font-medium text-red-400 hover:text-red-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div>Punta Piedra</div>
            <div>DD/MM/AA</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
