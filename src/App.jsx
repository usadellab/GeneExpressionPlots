import React          from 'react';
import { HashRouter } from 'react-router-dom';

import AppRoutes from './App.routes';
import AppLayout from './layout/AppLayout';

import { store } from '@/store';
import {
  PRELOAD_DATA,
  PRELOAD_IMAGE,
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

    if (PRELOAD_IMAGE) {
      try {
        const response = await fetch(PRELOAD_IMAGE);
        if (response.ok)
          store.assignImage(response.url);
        else
          console.error('Loading preloaded image caused an error');
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
