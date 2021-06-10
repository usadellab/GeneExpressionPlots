import React from 'react';

import Routes from './PlotsRoutes';

import HomeLayout from './layout/PlotsLayout';

export default function DataHome() {
  return (
    <HomeLayout>
      <Routes />
    </HomeLayout>
  );
}
