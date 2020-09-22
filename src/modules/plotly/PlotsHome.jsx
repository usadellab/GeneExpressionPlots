import React from 'react';

import Routes                from './Plots.routes';
import { DataStoreProvider } from '../data/store';
import { PlotStoreProvider } from './store/context';

import HomeLayout from './layout/HomeLayout';


export default function DataHome () {

  return (
    <DataStoreProvider>
      <PlotStoreProvider>
        <HomeLayout>
          <Routes />
        </HomeLayout>
      </PlotStoreProvider>
    </DataStoreProvider>
  );
}