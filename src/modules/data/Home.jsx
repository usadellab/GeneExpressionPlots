import React from 'react';

import Routes                from './Home.routes';
import { DataStoreProvider } from './store';

import HomeLayout from './layout/HomeLayout';


export default function DataHome () {

  return (
    <DataStoreProvider>
      <HomeLayout>
        <Routes />
      </HomeLayout>
    </DataStoreProvider>
  );
}