import React from 'react';
import { Route, Routes } from 'react-router-dom';

import PlotsHome from './plots-home';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PlotsHome />} />
    </Routes>
  );
};

export default AppRoutes;
