import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DataFiles from './data-files';

const DataRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DataFiles />} />
    </Routes>
  );
};

export default DataRoutes;
