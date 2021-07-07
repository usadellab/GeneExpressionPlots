import React from 'react';
import { HashRouter } from 'react-router-dom';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Code,
  Flex,
  Spinner,
  Text,
} from '@chakra-ui/react';

import AppRoutes from './app-routes';
import AppLayout from './layouts/app-layout';

import { fetchResource } from '@/utils/fetch';
import { readTable } from '@/utils/parser';

import { dataTable, infoTable } from '@/store/data-store';
import { plotStore } from './store/plot-store';
import { settings } from '@/store/settings';

type AppState = 'failed' | 'idle' | 'loading';

const App: React.FC = () => {
  const [appState, setAppState] = React.useState<{
    status: AppState;
    message?: string;
  }>({
    status: 'idle',
  });

  const preload = async (): Promise<void> => {
    setAppState({ status: 'loading' });
    try {
      // Preload Settings
      if (settings.preloaded.settings) {
        const settingsResponse = await fetchResource(
          settings.preloaded.settings,
          'json'
        );

        settings.loadgxpSettings(settingsResponse);
        plotStore.loadCountUnit(settings.gxpSettings.unit);
      }

      // Preload Data
      if (settings.preloaded.data) {
        const dataResponse = await fetchResource(
          settings.preloaded.data,
          'text'
        );

        const table = readTable(dataResponse, {
          fieldSeparator: settings.gxpSettings.expression_field_sep,
          rowNameColumn: 0,
        });

        dataTable.loadFromObject(table, {
          multiHeader: settings.gxpSettings.expression_header_sep,
        });

        // If a custom sorting is not provided for groups and samples, use the
        // table column order.
        if (settings.gxpSettings.groupOrder.length === 0)
          settings.setGroupOrder(dataTable.groupsAsArray);
        if (settings.gxpSettings.sampleOrder.length === 0)
          settings.setSampleOrder(dataTable.samplesAsArray);
      }

      // Preload Info
      if (settings.preloaded.info) {
        const infoResponse = await fetchResource(
          settings.preloaded.info,
          'text'
        );
        const table = readTable(infoResponse, {
          fieldSeparator: settings.gxpSettings.info_field_sep,
          rowNameColumn: 0,
        });

        infoTable.loadFromObject(table, { multiHeader: '*' });
      }

      // Preload image
      if (settings.preloaded.image) {
        const url = await fetchResource(settings.preloaded.image, 'url');
        // Use the file name for the "alt" attribute
        const alt = url.split('/').pop()?.split('.').shift() as string;
        plotStore.addImagePlot(url, alt);
      }
      setAppState({
        status: 'idle',
      });
    } catch (error) {
      setAppState({
        status: 'failed',
        message: error.message,
      });
    }
  };

  React.useEffect(function preloadApp() {
    if (
      settings.preloaded.data ||
      settings.preloaded.image ||
      settings.preloaded.info ||
      settings.preloaded.settings
    ) {
      preload();
    }
  }, []);

  return (
    <HashRouter>
      <AppLayout>
        {appState.status === 'loading' ? (
          <Flex
            alignItems="center"
            flexDirection="column"
            flexGrow={1}
            justifyContent="center"
            width="100%"
          >
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
            <Text fontSize="xl" fontWeight="semibold" marginTop={6}>
              Loading Application Data
            </Text>
          </Flex>
        ) : appState.status === 'failed' ? (
          <Alert
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
            marginTop={10}
            padding={8}
            status="error"
            textAlign="center"
            variant="subtle"
          >
            <AlertIcon boxSize="2rem" marginRight={0} />
            <AlertTitle marginTop={6} fontSize="lg">
              The application failed to load
            </AlertTitle>
            <AlertDescription marginTop={3} maxWidth="xl">
              The application failed when trying to load data resources. You may
              try reloading the page. If the problem persists, please contact
              your administrator.
            </AlertDescription>
            <Code marginTop={6}>{appState.message}</Code>
          </Alert>
        ) : (
          <AppRoutes />
        )}
      </AppLayout>
    </HashRouter>
  );
};

export default App;
