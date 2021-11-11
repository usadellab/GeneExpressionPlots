import NavCard from '@/components/nav-card';
import {
  parseMercatorAndAddToInfoTable,
  validateMercator,
} from '@/utils/parser';
import { useDisclosure } from '@chakra-ui/hooks';
import { FocusableElement } from '@chakra-ui/utils';
import { Box } from '@chakra-ui/layout';
import React from 'react';

import { FaFileImport } from 'react-icons/fa';
import { VscGraphScatter } from 'react-icons/vsc';
import { MercatorFormSubmitHandler } from './mercator-form';
import FormikModal from '@/components/formik-modal';

import MercatorForm from './mercator-form';
import { dataTable } from '@/store/data-store';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/alert';
import { useToast } from '@chakra-ui/toast';

const MapMan: React.FC = () => {
  const refInitialFocus = React.useRef<FocusableElement | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const onSubmit: MercatorFormSubmitHandler = (values, actions) => {
    const file = values.file;

    if (file) {
      try {
        const reader = new FileReader();

        reader.onload = () => {
          // validate Mercator input
          const header = (reader.result as string).split('\n', 1)[0];
          if (!validateMercator(header)) {
            toast({
              title: 'Error',
              status: 'error',
              description: 'Invalid Mercator Input.',
              isClosable: true,
            });
            return;
          }

          // Parse the input file as a table
          parseMercatorAndAddToInfoTable(reader.result as string, {
            addDescription: values.addDescription,
            addName: values.addName,
          });
        };

        reader.onloadend = () => {
          actions.setSubmitting(false);
          onClose();
        };

        reader.onerror = () => {
          actions.setSubmitting(false);
          console.error('There was an error while reading the file');
        };

        reader.readAsText(file);
      } catch (error) {
        actions.setSubmitting(false);
        console.error(error);
      }
    }
  };

  return (
    <>
      {!dataTable.hasData ? (
        <Alert
          alignItems="center"
          flexDirection="column"
          minHeight="16rem"
          maxHeight="20rem"
          justifyContent="center"
          marginLeft={3}
          marginRight={3}
          marginTop={3}
          status="warning"
          textAlign="center"
          variant="subtle"
        >
          <AlertIcon boxSize="3rem" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            No data has been loaded
          </AlertTitle>
          <AlertDescription maxWidth="xl">
            It seems no data has been loaded into the application yet. You can
            load data from various formats in the Data section of the toolbar
            above.
          </AlertDescription>
        </Alert>
      ) : (
        <Box
          as="main"
          padding={6}
          width="100%"
          __css={{
            '& a:not(:first-of-type)': {
              marginTop: '2rem',
            },
          }}
        >
          <NavCard
            icon={VscGraphScatter}
            label="Mercator v4"
            text={`
              The enrichment analyses tool allows you to run enrichment tests for your data.
              Use the "Gene Info Table" to store information about differentially expressed genes.
              All tests and results will be private to your browser and will not be sent anywhere.
            `}
            to="/tools/mapman"
            onClick={() => window.open('https://plabipd.de/portal/mercator4')}
          />
          <NavCard
            icon={FaFileImport}
            label="Import Mercator output"
            text={`
              The enrichment analyses tool allows you to run enrichment tests for your data.
              Use the "Gene Info Table" to store information about differentially expressed genes.
              All tests and results will be private to your browser and will not be sent anywhere.
            `}
            to="/tools/mapman"
            onClick={onOpen}
          />
        </Box>
      )}
      <FormikModal
        initialFocusRef={refInitialFocus}
        isOpen={isOpen}
        onClose={onClose}
        title="Load Expression Table"
      >
        <MercatorForm
          initialFocusRef={refInitialFocus}
          onCancel={onClose}
          onSubmit={onSubmit}
        />
      </FormikModal>
    </>
  );
};

export default MapMan;
