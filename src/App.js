import React from 'react';
//
import { BrowserRouter as Router } from "react-router-dom";
//
import AppRoutes from './AppRoutes';
import MenuBar   from './components/MenuBar';
//
import { DataProvider } from './store/DataContext';


export default function App() {

  return (
    <DataProvider>
      <Router>

        <MenuBar />

        <AppRoutes />

      </Router>
    </DataProvider>
  );
}
