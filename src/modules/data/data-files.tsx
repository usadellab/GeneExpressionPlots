import JSZip from 'jszip';
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
import Sidebar, { SidebarButton } from '@/components/nav-sidebar';
import FormikModal from '@/components/formik-modal';
import ReplCard from './components/repl-card';

import DbForm, { DbFormSubmitHandler } from './components/db-form';
import InfoForm, { InfoFormSubmitHandler } from './components/info-form';
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

  const refXTableInitialFocus = React.useRef<FocusableElement | null>(null);

  const {
    isOpen: isXTableOpen,
    onOpen: onXTableOpen,
    onClose: onXTableClose,
  } = useDisclosure();

  const onXTableFormSubmit: XTableFormSubmitHandler = (values, actions) => {
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

  const refInfoTableInitialFocus = React.useRef<FocusableElement | null>(null);

  const {
    isOpen: isInfoTableOpen,
    onOpen: onInfoTableOpen,
    onClose: onInfoTableClose,
  } = useDisclosure();

  const onInfoTableFormSubmit: InfoFormSubmitHandler = (values, actions) => {
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

  /* IMPORT GXP DATABASE */

  const refGXPDbInitialFocus = React.useRef<FocusableElement | null>(null);

  const {
    isOpen: isGXPDbOpen,
    onOpen: onGXPDbOpen,
    onClose: onGXPDbClose,
  } = useDisclosure();

  const onGXPDbFormSubmit: DbFormSubmitHandler = async (values, actions) => {
    // Get the file ref
    const file = values.file;

    if (file) {
      try {
        const zip = new JSZip();
        const zipImport = await zip.loadAsync(file);

        // Unpack and load GXP settings
        const gxpSettingsPtr = zipImport.files['GXP_settings.json'];
        const gxpSettingsSrc = await gxpSettingsPtr.async('string');
        const gxpSettingsJSON = JSON.parse(gxpSettingsSrc);
        settings.loadgxpSettings(gxpSettingsJSON);

        // Unpack and load the expression table
        const expressionTablePtr = zipImport.files['expression_table.txt'];
        const expressionTableSrc = await expressionTablePtr.async('string');
        const expressionTable = readTable(expressionTableSrc, {
          fieldSeparator: settings.gxpSettings.expression_field_sep,
          rowNameColumn: 0,
        });
        dataTable.loadFromObject(expressionTable, {
          multiHeader: settings.gxpSettings.expression_header_sep,
        });

        // If not defined by the user, set the default GXP database group and
        // sample order
        if (
          !settings.gxpSettings.groupOrder ||
          settings.gxpSettings.groupOrder.length === 0
        ) {
          const groupOrder = dataTable.groupsAsArray;
          settings.setGroupOrder(groupOrder);
        }
        if (
          !settings.gxpSettings.sampleOrder ||
          settings.gxpSettings.sampleOrder.length === 0
        ) {
          const sampleOrder = dataTable.samplesAsArray;
          settings.setSampleOrder(sampleOrder);
        }

        // Unpack and load the gene info file, if it exists
        const infoFilePtr = zipImport.files['info_table.txt'];
        if (infoFilePtr) {
          const geneInfoSrc = await infoFilePtr.async('string');
          const geneInfoTable = readTable(geneInfoSrc, {
            fieldSeparator: settings.gxpSettings.info_field_sep,
            rowNameColumn: 0,
          });
          infoTable.loadFromObject(geneInfoTable, null);
        }

        // Unpack and load the image file, if it exists
        const imageFilePtr = zipImport.files['image.png'];
        if (imageFilePtr) {
          const imgsrc = await imageFilePtr.async('base64');
          plotStore.loadImage('data:image/png;base64, ' + imgsrc);
        }

        actions.setSubmitting(false);
        onGXPDbClose();
      } catch (error) {
        actions.setSubmitting(false);
        console.error(error.message);
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

            <SidebarButton
              text="Import GXP Database"
              icon={FaFileImport}
              onClick={onGXPDbOpen}
            />

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
        initialFocusRef={refXTableInitialFocus}
        isOpen={isXTableOpen}
        onClose={onXTableClose}
        title="Load Expression Table"
      >
        <XTableForm
          initialFocusRef={refXTableInitialFocus}
          onCancel={onXTableClose}
          onSubmit={onXTableFormSubmit}
        />
      </FormikModal>

      <FormikModal
        initialFocusRef={refInfoTableInitialFocus}
        isOpen={isInfoTableOpen}
        onClose={onInfoTableClose}
        title="Load Gene-Info Table"
      >
        <InfoForm
          initialFocusRef={refInfoTableInitialFocus}
          onCancel={onInfoTableClose}
          onSubmit={onInfoTableFormSubmit}
        />
      </FormikModal>

      <FormikModal
        initialFocusRef={refGXPDbInitialFocus}
        isOpen={isGXPDbOpen}
        onClose={onGXPDbClose}
        title="Import GXP Database"
      >
        <DbForm
          initialFocusRef={refGXPDbInitialFocus}
          onCancel={onGXPDbClose}
          onSubmit={onGXPDbFormSubmit}
        />
      </FormikModal>
    </Flex>
  );
};

export default observer(FilesPage);
