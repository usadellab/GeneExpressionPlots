import React             from 'react';
import { HashRouter } from 'react-router-dom';

import AppRoutes from './App.routes';
import AppLayout from './layout/AppLayout';


export default function App() {
  return (
    <HashRouter basename={ `${process.env.BASE_URL}` } >
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </HashRouter>
  );
}
