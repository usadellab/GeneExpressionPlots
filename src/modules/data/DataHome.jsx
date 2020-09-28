import React  from 'react';
import Routes from './DataRoutes';

import HomeLayout from './layout/DataLayout';


export default function DataHome () {

  return (
    <HomeLayout>
      <Routes />
    </HomeLayout>
  );
}