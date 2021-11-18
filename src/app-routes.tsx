import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AppHome from './app-home';
import DataRoutes from './pages/data/data-routes';
import InfoRoutes from './pages/info/info-routes';
import PlotsRoutes from './pages/plots/plots-routes';
import ToolsRoutes from './pages/tools/tools-routes';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppHome />} />
      <Route path="/data/*" element={<DataRoutes />} />
      <Route path="/plots/*" element={<PlotsRoutes />} />
      <Route path="/tools/*" element={<ToolsRoutes />} />
      <Route path="/docs/*" element={<InfoRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
