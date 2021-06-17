import { observer } from 'mobx-react';
import React from 'react';
import {
  FaFile,
  FaFileAlt,
  FaFileExport,
  FaFileImport,
  FaTrashAlt,
} from 'react-icons/fa';
import {
  chakra,
  Flex,
  SlideFade,
  useDisclosure,
  Wrap,
  WrapItem,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';
import Sidebar, { SidebarButton, SidebarFile } from '@/components/nav-sidebar';
import FormikModal from '@/components/formik-modal';
import InfoForm, { InfoFormSubmitHandler } from './components/info-form';
import ReplCard from './components/repl-card';
import XTableForm, { XTableFormSubmitHandler } from './components/xtable-form';

import { dataTable } from '@/store/data-store';
import { infoTable } from '@/store/data-store';
import { plotStore } from '@/store/plot-store';
import { settings } from '@/store/settings';

import { readTable } from '@/utils/parser';
import { unescapeDelimiters } from '@/utils/string';

const FilesPage: React.FC = () => {
  const replCardWidth = useBreakpointValue({
    base: '100%',
    lg: '45%',
    xl: '30%',
  });

  const [selectedReplicates, setSelectedReplicates] = React.useState<string[]>(
    []
  );

  const updateSelectedReplicates = (name: string, checked: boolean): void => {
    if (checked) {
      setSelectedReplicates([...selectedReplicates, name]);
    } else {
      setSelectedReplicates(selectedReplicates.filter((repl) => repl !== name));
    }
  };

  /* LOAD EXPRESSION TABLE */

  const {
    isOpen: xTableOpen,
    onOpen: onXTableOpen,
    onClose: onXTableClose,
  } = useDisclosure();

  const xTableInitialFocusRef = React.useRef<FocusableElement | null>(null);

  const xTableFormSubmit: XTableFormSubmitHandler = (values, actions) => {
    plotStore.loadCountUnit(values.countUnit);

    settings.loadgxpSettings({
      unit: values.countUnit,
      expression_field_sep: values.columnSep,
      expression_header_sep: values.headerSep,
    });

    const file = values.file;

    if (file) {
      try {
        const reader = new FileReader();

        reader.onload = () => {
          // Parse the input file as a table
          const table = readTable(reader.result as string, {
            fieldSeparator: unescapeDelimiters(values.columnSep),
            rowNameColumn: 0,
          });

          // Load the store from the parsed table
          dataTable.loadFromObject(table, {
            multiHeader: values.headerSep,
          });

          // set default group and sample order in the settings
          settings.setGroupOrder(dataTable.groupsAsArray);
          settings.setSampleOrder(dataTable.samplesAsArray);
        };

        reader.onloadend = () => {
          actions.setSubmitting(false);
          onXTableClose();
        };

        reader.onerror = () => {
          actions.setSubmitting(false);
          console.error('There was an error while reading the file');
        };

        reader.readAsText(file);
      } catch (error) {
        actions.setSubmitting(false);
        console.error(error.message);
      }
    }
  };

  /* LOAD GENE-INFO TABLE */

  const {
    isOpen: infoTableOpen,
    onOpen: onInfoTableOpen,
    onClose: onInfoTableClose,
  } = useDisclosure();

  const infoTableInitialFocusRef = React.useRef<FocusableElement | null>(null);

  const infoTableFormSubmit: InfoFormSubmitHandler = (values, actions) => {
    const file = values.file;

    if (file) {
      try {
        settings.loadgxpSettings({
          info_field_sep: values.columnSep,
        });

        const reader = new FileReader();

        reader.onload = () => {
          // Parse the input file as a table
          const table = readTable(reader.result as string, {
            fieldSeparator: values.columnSep,
            rowNameColumn: 0,
          });

          // Load the store from the parsed table
          infoTable.loadFromObject(table, null);
        };

        reader.onloadend = () => {
          actions.setSubmitting(false);
          onInfoTableClose();
        };

        reader.onerror = () => {
          actions.setSubmitting(false);
          console.error('There was an error while reading the file');
        };

        reader.readAsText(file);
      } catch (error) {
        actions.setSubmitting(false);
        console.error('There was an error while reading the file');
      }
    }
  };

  /* REMOVE DATA */

  const bulkRemoveReplicates = (): void => {
    if (selectedReplicates.length > 0) {
      selectedReplicates.forEach((repl) => dataTable.removeColumn(repl));
      setSelectedReplicates([]);
    } else {
      dataTable.clearData();
    }
  };

  return (
    <Flex flexGrow={1}>
      <SlideFade initial={{ x: -20 }} animate={{ x: 0 }} exit={{ x: -20 }}>
        <chakra.div boxShadow="xl" height="100%" backgroundColor="white">
          <Sidebar position="sticky" top={0} maxWidth="17rem" paddingY="1rem">
            <SidebarButton
              text="Load Expression Table"
              icon={FaFile}
              onClick={onXTableOpen}
            />

            <SidebarButton
              text="Load Gene Info Table"
              icon={FaFileAlt}
              onClick={onInfoTableOpen}
            />

            <SidebarFile text="Import GXP Database" icon={FaFileImport} />

            <SidebarButton text="Export GXP Database" icon={FaFileExport} />

            <SidebarButton
              text={
                selectedReplicates.length > 0
                  ? 'Remove selected'
                  : 'Remove All Data'
              }
              icon={FaTrashAlt}
              onClick={bulkRemoveReplicates}
            />
          </Sidebar>
        </chakra.div>
      </SlideFade>
      <Flex
        as="main"
        alignItems="center"
        flexDirection="column"
        padding="2rem"
        width="100%"
      >
        <Wrap spacing="1rem" justify="center">
          {dataTable.colNames.map((replicateName) => (
            <WrapItem key={replicateName} width={replCardWidth}>
              <ReplCard
                name={replicateName}
                onSelect={updateSelectedReplicates}
              />
            </WrapItem>
          ))}
        </Wrap>
      </Flex>

      <FormikModal
        initialFocusRef={xTableInitialFocusRef}
        isOpen={xTableOpen}
        onClose={onXTableClose}
        title="Load Expression Table"
      >
        <XTableForm
          initialFocusRef={xTableInitialFocusRef}
          onCancel={onXTableClose}
          onSubmit={xTableFormSubmit}
        />
      </FormikModal>

      <FormikModal
        initialFocusRef={infoTableInitialFocusRef}
        isOpen={infoTableOpen}
        onClose={onInfoTableClose}
        title="Load Gene-Info Table"
      >
        <InfoForm
          initialRef={infoTableInitialFocusRef}
          onCancel={onInfoTableClose}
          onSubmit={infoTableFormSubmit}
        />
      </FormikModal>
    </Flex>
  );
};

export default observer(FilesPage);
