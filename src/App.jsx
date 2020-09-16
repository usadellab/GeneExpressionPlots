import React             from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes         from './App.routes';


function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
