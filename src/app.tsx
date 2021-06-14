import React from 'react';
import { HashRouter } from 'react-router-dom';

import AppRoutes from './app.routes';
import AppLayout from './layouts/app-layout';

import { fetchResource } from '@/utils/fetch';
import { readTable } from '@/utils/parser';

import { dataTable, infoTable } from '@/store/data-store';
import { plotStore } from './store/plot-store';
import { settings } from '@/store/settings';

const App: React.FC = () => {
  React.useEffect(function preloadSettings() {
    if (settings.preloaded.settings) {
      fetchResource(settings.preloaded.settings, 'json').then(
        (settingsResponse) => {
          if (settingsResponse) {
            settings.loadgxpSettings(settingsResponse);
            plotStore.loadCountUnit(settings.gxpSettings.unit);
          }
        }
      );
    }
  }, []);

  React.useEffect(function preloadData() {
    if (settings.preloaded.data) {
      fetchResource(settings.preloaded.data, 'text').then((dataResponse) => {
        if (dataResponse)
          dataTable.loadFromObject(
            readTable(dataResponse, {
              fieldSeparator: settings.gxpSettings.expression_field_sep,
              rowNameColumn: 0,
            }),
            {
              multiHeader: settings.gxpSettings.expression_header_sep,
            }
          );
      });

      // If a custom sorting is not provided for groups and samples, use the
      // table column order.
      if (settings.gxpSettings.groupOrder.length === 0)
        settings.setGroupOrder(dataTable.groupsAsArray);
      if (settings.gxpSettings.sampleOrder.length === 0)
        settings.setSampleOrder(dataTable.samplesAsArray);
    }
  }, []);

  React.useEffect(function preloadInfo() {
    if (settings.preloaded.info) {
      fetchResource(settings.preloaded.info, 'text').then((infoResponse) => {
        if (infoResponse) {
          const table = readTable(infoResponse, {
            fieldSeparator: settings.gxpSettings.info_field_sep,
            rowNameColumn: 0,
          });

          infoTable.loadFromObject(table, { multiHeader: '*' });
        }
      });
    }
  }, []);

  React.useEffect(function preloadImage() {
    if (settings.preloaded.image) {
      fetchResource(settings.preloaded.image, 'url').then((image) => {
        if (image) plotStore.loadImage(image);
      });
    }
  }, []);

  return (
    <HashRouter>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </HashRouter>
  );
};

export default App;
