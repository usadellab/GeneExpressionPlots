import React          from 'react';
import { HashRouter } from 'react-router-dom';

import AppRoutes from './App.routes';
import AppLayout from './layout/AppLayout';

import { store } from '@/store';
import {
  PRELOAD_CAPTIONS,
  PRELOAD_DATA
} from './config/globals.js';

import '@/assets/svg/base.svg';

export default class App extends React.Component {

  async componentDidMount () {
    if (PRELOAD_DATA) {
      try {
        const response = await fetch(PRELOAD_DATA);
        if (response.ok)
          store.assignData( await response.json() );
        else
          console.error('Loading preloaded data caused an error');
      }
      catch (error) {
        console.error(error.message);
      }
    }

    if (PRELOAD_CAPTIONS) {
      try {
        const response = await fetch(PRELOAD_CAPTIONS);
        if (response.ok)
          store.assignCaptions( await response.json() );
        else
          console.error('Loading preloaded captions caused an error');
      }
      catch (error) {
        console.error(error.message);
      }
    }
  }

  render () {
    return (
      <HashRouter >
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </HashRouter>
    );
  }
}
