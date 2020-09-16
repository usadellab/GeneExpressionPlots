import React from 'react';
import { BrowserRouter } from 'react-router-dom';
//
import AppRoutes from './App.routes';
import { DataProvider } from './store/DataContext';

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
