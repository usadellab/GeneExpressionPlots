import React    from 'react';
import { Link } from 'react-router-dom';

import Routes                from './Home.routes';
import { DataStoreProvider } from './Home.store';


export default function DataHome () {

  return (
    <DataStoreProvider>

      <header className="flex items-center p-4 w-full bg-blue-500" >

        <Link to="/data" className="ml-4 font-medium text-xl text-white" >
          Gene Expression Data
        </Link>

      </header>

      <main className="flex justify-center" >

        <Routes />

      </main>

    </DataStoreProvider>
  );
}