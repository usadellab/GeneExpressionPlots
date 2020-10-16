import React             from 'react';
import { HashRouter } from 'react-router-dom';

import AppRoutes from './App.routes';
import AppLayout from './layout/AppLayout';

import '@/assets/svg/base.svg';

export default function App() {
  return (
    <HashRouter >
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </HashRouter>
  );
}
