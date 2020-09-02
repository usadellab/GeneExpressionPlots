import React from 'react';
//
import { BrowserRouter as Router } from "react-router-dom";
//
import AppRoutes from './AppRoutes';
//
import { DataProvider } from './store/DataContext';
//
import SimpleLayout from './layout/SimpleLayout';


export default function App() {

  return (
    <DataProvider>
      <Router>
        <SimpleLayout>
          <AppRoutes />
        </SimpleLayout>
      </Router>
    </DataProvider>
  );
}
