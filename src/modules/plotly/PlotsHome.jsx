import React from 'react';

import Routes                from './PlotsRoutes';
import { PlotStoreProvider } from './store/context';

import HomeLayout from './layout/PlotsLayout';


export default function DataHome () {

  return (
    <PlotStoreProvider>
      <HomeLayout>
        <Routes />
      </HomeLayout>
    </PlotStoreProvider>
  );
}