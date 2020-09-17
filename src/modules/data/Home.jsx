import React from 'react';

import GroupList from './components/GroupList';

import { DataStoreProvider } from './Home.store';


export default function DataHome () {

  return (
    <DataStoreProvider>
      <div className="flex justify-center" >

        <GroupList className="w-1/2" />

      </div>
    </DataStoreProvider>
  );
}