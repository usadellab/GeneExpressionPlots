import React from 'react';
//
import { BrowserRouter as Router } from "react-router-dom";
//
import AppRoutes from './AppRoutes';
import MenuBar   from './components/MenuBar';


export default function App() {

  return (
    <Router>

      <MenuBar />

      <AppRoutes />

    </Router>
  );
}
