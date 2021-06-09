import React          from 'react';
import { HashRouter } from 'react-router-dom';

import AppRoutes from './App.routes';
import AppLayout from './layout/AppLayout';

import { fetchResource } from '@/utils/fetch';
import { readTable } from '@/utils/parser';

import { dataTable, infoTable } from '@/store/data-store';
import { plotStore } from './store/plot-store';
import { settings } from '@/store/settings';

export default class App extends React.Component {

  async componentDidMount () {

    if (settings.preloaded.settings) {
      const settingsResponse = await fetchResource(settings.preloaded.settings, { type: 'json' });
      if (settingsResponse) {
        settings.loadgxpSettings(settingsResponse);
        plotStore.loadCountUnit(settings.gxpSettings.unit);
      }
      else throw new Error('Please provide a GXP_settings.json file.');
    }

    if (settings.preloaded.data) {
      const dataResponse = await fetchResource(settings.preloaded.data, { type: 'text' });
      if (dataResponse) dataTable.loadFromObject(
        readTable(dataResponse, {
          fieldSeparator: settings.gxpSettings.expression_field_sep,
          rowNameColumn: 0,
        }), {
          multiHeader: settings.gxpSettings.expression_header_sep
        }
      );
    }

    if (settings.preloaded.info) {
      const infoResponse = await fetchResource(settings.preloaded.info, { type: 'text' });
      if (infoResponse) infoTable.loadFromObject(
        readTable(infoResponse, {
          fieldSeparator: settings.gxpSettings.info_field_sep,
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
