import React             from 'react';
import { BrowserRouter } from 'react-router-dom';

import AppRoutes from './App.routes';
import AppLayout from './layout/AppLayout';


export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </BrowserRouter>
  );
}
