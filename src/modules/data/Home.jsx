import React, { useState } from 'react';
import { Link }            from 'react-router-dom';

import Routes                from './Home.routes';
import { DataStoreProvider } from './Home.store';

import AppButton from '@components/AppButton';
import AppDrawer from '@components/AppDrawer';
import IconData  from './assets/svg/hi-database.svg';
import IconHome  from './assets/svg/hi-home.svg';


export default function DataHome () {

  const [ showGroup, setShowGroup ] = useState(false);

  return (
    <DataStoreProvider>

      <header className="flex justify-between items-center p-2 w-full bg-blue-500" >

        <Link to="/data" className="flex items-center ml-4 font-medium text-xl text-white" >
          <IconHome className="w-6 h-6" />
          <span className="pl-3">Gene Expression Data</span>
        </Link>


        <AppButton
          className="p-2 mr-4 rounded-full"
          onClick={ (e) => setShowGroup(true) }
        >
          <IconData className="w-6 h-6 text-white" />
        </AppButton>

      </header>

      <main className="flex justify-center" >

        <Routes />

      </main>

      <AppDrawer
        className="w-1/3"
        show={ showGroup }
        setShow={ setShowGroup }
      >
      </AppDrawer>

    </DataStoreProvider>
  );
}