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
import { readTable } from '@/utils/parser';

import '@/assets/svg/hero-icons.svg';

import { dataTable } from '@/store/dataframe';
export default class App extends React.Component {

  async componentDidMount () {

    let data = [];
    let captions = {};
    let image = null;

    // if (PRELOAD_DATA) {
    //   const dataRes = await fetchResource(PRELOAD_DATA, { type: 'json' });
    //   if (dataRes?.data) groups = dataRes.data;
    //   if (dataRes?.image) image = dataRes.image;
    // }
    if (PRELOAD_DATA) {
      const dataResponse = await fetchResource(PRELOAD_DATA, { type: 'text' });
      if (dataResponse) data = readTable(dataResponse, { fieldSeparator: ',' });
      console.log(data);
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
    // store.assignData(groups);
    dataTable.assignDataFrame(data.header, data.rows);
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
