import { useDisclosure } from '@chakra-ui/hooks';
import { FocusableElement } from '@chakra-ui/utils';
import { Box } from '@chakra-ui/layout';
import React from 'react';

import { FaFileImport } from 'react-icons/fa';
import { VscGraphScatter } from 'react-icons/vsc';
import { MercatorFormSubmitHandler } from './mercator-form';
import FormikModal from '@/components/formik-modal';

import MercatorForm from './mercator-form';
import { dataTable, infoTable } from '@/store/data-store';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/alert';
import { useToast } from '@chakra-ui/toast';
import CardButton from '@/components/card-button';

/**
 * Sanity check to validate if the expected Mercator headers are present
 * @param table
 */
export function validateMercator(headerLine: string): boolean {
  const header = headerLine.split('\t');
  if (
    header[0] === 'BINCODE' &&
    header[1] === 'NAME' &&
    header[2] === 'IDENTIFIER' &&
    header[3] === 'DESCRIPTION' &&
    header[4] === 'TYPE'
  )
    return true;

  return false;
}

/**
 *
 * @param rowName rowName to add column to
 * @param columns array of columns to add
 * @param colIndex column index to start appending from
 * @param isEmptyInfoTable depending on whether the infotable has data, we get the valid row names
 */
function addMercatorColumns(
  rowName: string,
  columns: string[],
  colIndex: number,
  isEmptyInfoTable: boolean
): void {
  // check if infoTable has data and find the matching gene
  const validRowName = isEmptyInfoTable
    ? infoTable.rowNames.find((row) => row.toLowerCase() === rowName)
    : dataTable.rowNames.find((row) => row.toLowerCase() === rowName);

  if (validRowName) {
    if (!Array.isArray(infoTable.rows[validRowName]))
      infoTable.rows[validRowName] = [];
    if (infoTable.rows[validRowName].length <= colIndex)
      infoTable.rows[validRowName].push(...columns);
    else {
      for (let i = colIndex; i < columns.length + colIndex; i++) {
        infoTable.rows[validRowName][i] += `,${columns[i - colIndex]}`;
      }
    }
  }
}

/**
 *
 * @param table mercator table parsed as string
 * @param options options which columns to parse and add to the info table
 */
export function parseMercatorAndAddToInfoTable(
  table: string, // The File to be parsed as string. infoTable will be passed from the frontend
  options: { addName: boolean; addDescription: boolean } // options to add columns
): void {
  const lines = table.split('\n').map(function (line) {
    // reader.results of the read file can be parsed at infoTable point
    return line.split('\t');
  });
  const colIndex = infoTable.header.length;

  const infoTableHasData = infoTable.hasData;
  const fillLength: number =
    1 + (options.addName ? 1 : 0) + (options.addDescription ? 1 : 0);

  infoTable.addMercatorHeaderAndPrepareColumns(
    options.addName,
    options.addDescription
  );

  lines.forEach((mcLine, i) => {
    // skip the first line
    if (i === 0) return;

    if (mcLine[0].length !== 0) {
      // Skip lines without a defined BINCODE
      const mcBin: string = mcLine[0].replace(/[']+/g, ''); // remove extra quotation marks
      const mcName: string = mcLine[1].replace(/[']+/g, '');
      const mcGeneId: string = mcLine[2].replace(/[']+/g, ''); // remove extra quotation marks
      const mcDescription: string = mcLine[3].replace(/[']+/g, '');
      if (mcGeneId.length !== 0) {
        const mcColumns = [mcBin];

        if (options?.addName) {
          mcColumns.push(mcName);
        }
        if (options?.addDescription) {
          mcColumns.push(mcDescription);
        }
        addMercatorColumns(mcGeneId, mcColumns, colIndex, infoTableHasData);
      }
    }
  });

  if (infoTableHasData) {
    infoTable.rowNames.forEach((rowName) => {
      if (infoTable.rows[rowName].length < infoTable.header.length) {
        const lengthDiff =
          infoTable.header.length - infoTable.rows[rowName].length;
        infoTable.rows[rowName].push(...Array(lengthDiff).fill(''));
      }
    });
  } else {
    dataTable.rowNames.forEach((rowName) => {
      if (!infoTable.rows[rowName]) {
        infoTable.rows[rowName] = Array(fillLength).fill('');
      }
    });
  }
}

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
          toast({
            title: 'Successfully imported Mercator table',
            status: 'success',
            description:
              'The provided Mercator tabular output was successfully imported into the application.',
            isClosable: true,
          });
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
      <Box
        as="main"
        padding={6}
        width="100%"
        __css={{
          '& button:not(:first-of-type)': {
            marginTop: '2rem',
          },
        }}
      >
        {!dataTable.hasData ? (
          <Alert
            alignItems="center"
            flexDirection="column"
            minHeight="16rem"
            maxHeight="20rem"
            justifyContent="center"
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
          <>
            <CardButton
              icon={VscGraphScatter}
              label="Mercator v4"
              text={`
              Use the Mercator v4 tool to annotate your genes with MapMan Bins. Clicking here
              will bring you to the plabipd online resources to run Mercator on your DNA or protein
              sequences. After running Mercator you can import the output table into GXP by using
              the Card below. 
            `}
              onClick={() => window.open('https://plabipd.de/portal/mercator4')}
            />
            <CardButton
              icon={FaFileImport}
              label="Import Mercator output"
              text={`
              Import Mercator v4 tabular output into the GXP. Importing the file will automatically
              append the Mercator columns to already uploaded gene info. If no gene info was uploaded
              yet, the in memory gene info will be created for you.
            `}
              onClick={onOpen}
            />
          </>
        )}
      </Box>
      <FormikModal
        initialFocusRef={refInitialFocus}
        isOpen={isOpen}
        onClose={onClose}
        title="Load Mercator Table"
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
