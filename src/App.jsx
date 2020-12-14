import React          from 'react';
import { HashRouter } from 'react-router-dom';

import AppRoutes from './App.routes';
import AppLayout from './layout/AppLayout';

import { store } from '@/store';
import {
  PRELOAD_CAPTIONS,
  PRELOAD_DATA,
  PRELOAD_IMAGE,
} from './config/globals.js';

import { fetchResource } from '@/utils/fetch';
import { readTable }     from '@/utils/parser';
import { dataTable }     from '@/store/data-store';

import '@/assets/svg/hero-icons.svg';


export default class App extends React.Component {

  async componentDidMount () {

    let captions = {};
    let image = null;

    if (PRELOAD_DATA) {
      const dataResponse = await fetchResource(PRELOAD_DATA, { type: 'text' });
      if (dataResponse) dataTable.loadFromObject(
        readTable(dataResponse, { fieldSeparator: '\t' })
      );
    }

    if (PRELOAD_CAPTIONS) {
      const captionsResponse = await fetchResource(PRELOAD_CAPTIONS, { type: 'text' });
      if (captionsResponse) captions = readTable(captionsResponse, { fieldSeparator: '\t' });
    }

    if (PRELOAD_IMAGE) {
      image = await fetchResource(PRELOAD_IMAGE, { type: 'url' });
    }

    store.assignCaptions(captions);
    store.assignImage(image);
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
