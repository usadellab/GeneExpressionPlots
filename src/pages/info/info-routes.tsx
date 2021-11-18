import React from 'react';
import { Route, Routes } from 'react-router-dom';

import InfoHome from './info-home';

const InfoRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<InfoHome />} />
    </Routes>
  );
};

export default InfoRoutes;
