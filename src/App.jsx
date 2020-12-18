import React          from 'react';
import { HashRouter } from 'react-router-dom';

import AppRoutes from './App.routes';
import AppLayout from './layout/AppLayout';

import { fetchResource } from '@/utils/fetch';
import { readTable } from '@/utils/parser';

import { dataTable, infoTable } from '@/store/data-store';
import { plotStore } from './store/plot-store';
import { settings } from '@/store/settings';

import '@/assets/svg/hero-icons.svg';


export default class App extends React.Component {

  async componentDidMount () {

    if (settings.preloaded.data) {
      const dataResponse = await fetchResource(settings.preloaded.data, { type: 'text' });
      if (dataResponse) dataTable.loadFromObject(
        readTable(dataResponse, {
          fieldSeparator: '\t',
          rowNameColumn: 0,
        }), {
          multiHeader: '*'
        }
      );
    }

    if (settings.preloaded.info) {
      const infoResponse = await fetchResource(settings.preloaded.info, { type: 'text' });
      if (infoResponse) infoTable.loadFromObject(
        readTable(infoResponse, {
          fieldSeparator: '\t',
          rowNameColumn: 0,
        })
      );
    }

    if (settings.preloaded.image) {
      const image = await fetchResource(settings.preloaded.image, { type: 'url' });
      if (image) plotStore.loadImage(image);
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
