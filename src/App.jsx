import React          from 'react';
import { HashRouter } from 'react-router-dom';

import AppRoutes from './App.routes';
import AppLayout from './layout/AppLayout';

import { store } from '@/store';
import {
  PRELOAD_CAPTIONS,
  PRELOAD_DATA
} from './config/globals.js';

import '@/assets/svg/hero-icons.svg';


export default class App extends React.Component {

  async componentDidMount () {
    if (PRELOAD_DATA) {
      try {
        const response = await fetch(PRELOAD_DATA);
        if (response.ok) {
          const {data, captions} = await response.json();
          if (data)
            store.assignData( data );
          else 
            throw new Error('Loading preloaded data caused an error: no data found');
          if (captions)
            store.assignCaptions( captions );
        }
        else
          console.error('Loading preloaded data caused an error');
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
