import { saveAs } from 'file-saver';
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
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  Button,
  Flex,
  useDisclosure,
  Wrap,
  WrapItem,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';
import Sidebar, { SidebarButton } from '@/components/nav-sidebar';
import FormikModal from '@/components/formik-modal';
import ReplCard from './components/repl-card';

import ExportGXPForm, {
  ExportGXPFormSubmitHandler,
} from './components/export-form';
import ImportGXPForm, {
  ImportGXPFormSubmitHandler,
} from './components/import-form';
import InfoForm, { InfoFormSubmitHandler } from './components/info-form';
import XTableForm, { XTableFormSubmitHandler } from './components/xtable-form';

import { dataTable } from '@/store/data-store';
import { infoTable } from '@/store/data-store';
import { plotStore } from '@/store/plot-store';
import { settings } from '@/store/settings';

import { GxpImage } from '@/types/plots';
import { fetchResource } from '@/utils/fetch';
import { parseEnrichmentData, readTable } from '@/utils/parser';
import { unescapeDelimiters } from '@/utils/string';
import { enrichmentStore } from '@/store/enrichment-store';
import { EnrichmentExport } from '@/types/enrichment';
import { nanoid } from 'nanoid';

const DataFiles: React.FC = () => {
  const replCardWidth = useBreakpointValue({
    base: '100%',
    lg: '45%',
    xl: '30%',
  });

  const [selectedReplicates, setSelectedReplicates] = React.useState<string[]>(
    []
  );

  const deleteReplicate = (name: string): void => {
    dataTable.removeColumns(name);
  };

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
    plotStore.loadCountUnit(unescapeDelimiters(values.countUnit));

    settings.loadgxpSettings({
      unit: values.countUnit,
      expression_field_sep: unescapeDelimiters(values.columnSep),
      expression_header_sep: unescapeDelimiters(values.headerSep),
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
          info_field_sep: unescapeDelimiters(values.columnSep),
        });

        const reader = new FileReader();

        reader.onload = () => {
          // Parse the input file as a table
          const table = readTable(reader.result as string, {
            fieldSeparator: unescapeDelimiters(values.columnSep),
            rowNameColumn: 0,
          });

          // Load the store from the parsed table
          infoTable.loadFromObject(table);
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

  const refGXPImportInitialFocus = React.useRef<FocusableElement | null>(null);

  const {
    isOpen: isGXPImportOpen,
    onOpen: onGXPImportOpen,
    onClose: onGXPImportClose,
  } = useDisclosure();

  const onGXPImportFormSubmit: ImportGXPFormSubmitHandler = async (
    values,
    actions
  ) => {
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
          infoTable.loadFromObject(geneInfoTable);
        }

        // Unpack and load the image file, if it exists
        const imageFilePtr = zipImport.files['image.png'];
        if (imageFilePtr) {
          const imgsrc = await imageFilePtr.async('blob');
          const imgUrl = URL.createObjectURL(imgsrc);
          plotStore.addImagePlot(imgUrl, 'Database Image');
        }

        // Unpack and load the enrichment analysis files, if exists
        const enrichmentPtr = zipImport.files['enrichment_analyses.json'];
        if (enrichmentPtr) {
          const enrichmentSrc = await enrichmentPtr.async('string');
          const analyses: EnrichmentExport[] = JSON.parse(enrichmentSrc);

          await Promise.all(
            analyses.map(async (analysis) => {
              const { rawData: raw_data, ...options } = analysis;
              const enrichmentDataFilePtr = zipImport.files[raw_data];
              const enrichmentDataFileSrc = await enrichmentDataFilePtr.async(
                'string'
              );
              const enrichmentData = parseEnrichmentData(
                enrichmentDataFileSrc,
                settings.gxpSettings.expression_field_sep
              );

              enrichmentStore.addRawEnrichmentAnalysis({
                id: nanoid(),
                isLoading: false,
                options: options,
                data: enrichmentData,
              });
            })
          );
        }

        // unpack and load plot files
        zip.folder('plots')?.forEach(async (relativePath, file) => {
          console.log({ relativePath, file });
          const plotFilePtr = zipImport.files[file.name];
          const plotFileSrc = await plotFilePtr.async('string');
          const plotData = JSON.parse(plotFileSrc);
          plotStore.addRawPlot({
            id: nanoid(),
            isLoading: false,
            ...plotData,
          });
        });

        actions.setSubmitting(false);
        onGXPImportClose();
      } catch (error) {
        actions.setSubmitting(false);
        console.error(error.message);
      }
    }
  };

  /* EXPORT GXP DATABASE */

  const refGXPDbExportInitialFocus = React.useRef<FocusableElement | null>(
    null
  );

  const {
    isOpen: isGXPExportOpen,
    onOpen: onGXPExportOpen,
    onClose: onGXPExportClose,
  } = useDisclosure();

  const onGXPExportFormSubmit: ExportGXPFormSubmitHandler = async (
    values,
    actions
  ) => {
    try {
      // Generate source data
      const geneExpressionSrc = dataTable.toString(
        unescapeDelimiters(values.columnSep)
      );
      const geneInfoSrc = infoTable.hasData
        ? infoTable.toString(settings.gxpSettings.info_field_sep)
        : null;

      const imagePlot = plotStore.plots.find((plot) => plot.type === 'image');

      const gxpSettingsSrc = JSON.stringify(
        Object.assign({}, settings.gxpSettings, {
          expression_field_sep: unescapeDelimiters(values.columnSep),
        }),
        null,
        2
      );

      // Package as a zip file
      const zip = new JSZip();
      zip.file('GXP_settings.json', gxpSettingsSrc);
      zip.file('expression_table.txt', geneExpressionSrc);

      // enrichment tables
      if (values.exportEnrichments) {
        const enrichmentSrc = values.exportEnrichments
          ? JSON.stringify(enrichmentStore.metadataToJSON(), null, 2)
          : undefined;
        if (enrichmentSrc) {
          zip.file('enrichment_analyses.json', enrichmentSrc);
          zip.folder('enrichment_analyses');
          enrichmentStore.analyses.forEach((analysis) => {
            const data = enrichmentStore.dataToCSV(
              analysis,
              unescapeDelimiters(values.columnSep)
            );
            zip.file(
              `enrichment_analyses/${analysis.options.title.replace(
                /\s+/g,
                '_'
              )}.txt`,
              data
            );
          });
        }
      }

      if (values.exportPlots) {
        zip.folder('plots');
        plotStore.plots.forEach((plot) => {
          const data = JSON.stringify(plotStore.toJSObject(plot.id), null, 2);
          console.log({ data });
          if (data) {
            zip.file(`plots/${plot.id}_${plot.type}.json`, data);
          }
        });
      }

      if (geneInfoSrc) zip.file('info_table.txt', geneInfoSrc);
      if (imagePlot) {
        const imageSrc = await fetchResource(
          (imagePlot as GxpImage).src,
          'blob'
        );
        if (imageSrc) {
          zip.file('image.png', imageSrc, { base64: true });
        }
      }

      zip
        .generateAsync({ type: 'blob' })
        .then((zipFile) => {
          saveAs(zipFile, values.fileName + '.zip');
        })
        .finally(() => {
          actions.setSubmitting(false);
          onGXPExportClose();
        });
    } catch (error) {
      actions.setSubmitting(false);
      console.error(error);
    }
  };

  /* REMOVE DATA */

  const dataAvailable = dataTable.hasData;

  const bulkRemoveReplicates = (): void => {
    if (selectedReplicates.length > 0) {
      dataTable.removeColumns(...selectedReplicates);
      setSelectedReplicates([]);
    } else {
      dataTable.clearData();
      infoTable.clearData();
    }
  };

  /* LOAD EXAMPLE DATA */
  const handleLoadExampleClick = async (): Promise<void> => {
    plotStore.loadCountUnit('raw');

    settings.loadgxpSettings({
      unit: 'raw',
      expression_field_sep: '\t',
      expression_header_sep: '*',
      info_field_sep: '\t',
    });
    try {
      // Load Expression Table
      const expressionFileResponse = await fetch('upload_expression_table.tsv');
      const expressionText = await expressionFileResponse.text();
      const expressionTable = readTable(expressionText, {
        fieldSeparator: '\t',
        rowNameColumn: 0,
      });

      // Load the store from the parsed table
      dataTable.loadFromObject(expressionTable, {
        multiHeader: '*',
      });

      // set default group and sample order in the settings
      settings.setGroupOrder(dataTable.groupsAsArray);
      settings.setSampleOrder(dataTable.samplesAsArray);

      // Load Info Table
      const geneInfoFileResponse = await fetch('upload_info_table.tsv');
      const geneInfoText = await geneInfoFileResponse.text();
      const geneInfoTable = readTable(geneInfoText, {
        fieldSeparator: '\t',
        rowNameColumn: 0,
      });

      // Load the store from the parsed table
      infoTable.loadFromObject(geneInfoTable);
    } catch (error) {
      console.error('There was an error while loading the examle data');
    }
  };

  return (
    <Flex as="main" flexGrow={1}>
      <Sidebar maxWidth="17rem">
        {!settings.preloaded.data && (
          <SidebarButton
            text="Load Expression Table"
            icon={FaFile}
            onClick={onXTableOpen}
          />
        )}

        {!settings.preloaded.data && (
          <SidebarButton
            text="Load Gene Info Table"
            icon={FaFileAlt}
            onClick={onInfoTableOpen}
          />
        )}

        {!settings.preloaded.data && (
          <SidebarButton
            text="Import GXP Database"
            icon={FaFileImport}
            onClick={onGXPImportOpen}
          />
        )}

        <SidebarButton
          text="Export GXP Database"
          icon={FaFileExport}
          onClick={onGXPExportOpen}
        />

        {!settings.preloaded.data && (
          <SidebarButton
            text={
              selectedReplicates.length > 0
                ? 'Remove selected'
                : 'Remove All Data'
            }
            icon={FaTrashAlt}
            onClick={bulkRemoveReplicates}
            disabled={!dataAvailable}
          />
        )}
      </Sidebar>

      <Flex
        alignItems="center"
        flexDirection="column"
        padding="2rem"
        width="100%"
      >
        {!dataAvailable && (
          <Alert
            alignItems="center"
            flexDirection="column"
            minHeight="20rem"
            justifyContent="center"
            marginLeft={3}
            marginTop={3}
            status="info"
            textAlign="center"
            variant="subtle"
            colorScheme="orange"
          >
            <AlertIcon boxSize="3rem" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              No data has been loaded
            </AlertTitle>
            <AlertDescription maxWidth="xl">
              It seems no data has been loaded into the application yet.
            </AlertDescription>
            <AlertDescription maxWidth="xl" marginTop={3}>
              Load your data via the Sidebar or play around with some examples
              using the button below.
            </AlertDescription>
            <Button
              colorScheme="orange"
              variant="solid"
              marginTop={3}
              onClick={handleLoadExampleClick}
            >
              Load examples
            </Button>
          </Alert>
        )}
        <Wrap
          role="region"
          aria-label="Loaded replicates"
          justify="center"
          spacing="1rem"
          width="100%"
        >
          {dataTable.colNames.map((replicateName) => (
            <WrapItem key={replicateName} width={replCardWidth}>
              <ReplCard
                aria-label={replicateName}
                key={replicateName}
                name={replicateName}
                onDelete={settings.preloaded.data ? undefined : deleteReplicate}
                onSelect={
                  settings.preloaded.data ? undefined : updateSelectedReplicates
                }
                tabIndex={settings.preloaded.data ? 0 : undefined}
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
        initialFocusRef={refGXPImportInitialFocus}
        isOpen={isGXPImportOpen}
        onClose={onGXPImportClose}
        title="Import GXP Database"
      >
        <ImportGXPForm
          initialFocusRef={refGXPImportInitialFocus}
          onCancel={onGXPImportClose}
          onSubmit={onGXPImportFormSubmit}
        />
      </FormikModal>

      <FormikModal
        initialFocusRef={refGXPDbExportInitialFocus}
        isOpen={isGXPExportOpen}
        onClose={onGXPExportClose}
        title="Export GXP Database"
      >
        <ExportGXPForm
          initialFocusRef={refGXPDbExportInitialFocus}
          onCancel={onGXPExportClose}
          onSubmit={onGXPExportFormSubmit}
        />
      </FormikModal>
    </Flex>
  );
};

export default observer(DataFiles);
