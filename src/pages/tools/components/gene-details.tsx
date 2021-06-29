import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from '@chakra-ui/react';

import { dataTable } from '@/store/data-store';
import { settings } from '@/store/settings';

interface GeneDetailsProps {
  accessionId: string;
}

const GeneDetails: React.FC<GeneDetailsProps> = (props) => {
  const geneData = dataTable.getRow(props.accessionId);
  const headerSep = settings.gxpSettings.expression_header_sep;
  const countUnit = settings.gxpSettings.unit;
  const tableRows = dataTable.colNames.map((colName, index) => [
    ...colName.split(headerSep),
    geneData[index],
  ]);

  return (
    <Table variant="striped" colorScheme="orange">
      {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
      <TableCaption>
        Expression count per replicate file found for this accession
      </TableCaption>
      <Thead>
        <Tr>
          <Th>Group</Th>
          <Th>Sample</Th>
          <Th>Replicate</Th>
          <Th isNumeric>Count [{countUnit}]</Th>
        </Tr>
      </Thead>
      <Tbody>
        {tableRows.map(([group, sample, replicate, count]) => (
          <Tr
            key={`${group}-${sample}-${replicate}`}
            tabIndex={0}
            aria-label={`Group: ${group}, Sample: ${sample}, Replicate: ${replicate} Count: ${count}`}
            _focus={{
              outline: '2px solid',
              outlineColor: 'orange.600',
            }}
          >
            <Td>{group}</Td>
            <Td>{sample}</Td>
            <Td>{replicate}</Td>
            <Td isNumeric>{count}</Td>
          </Tr>
        ))}
      </Tbody>
      <Tfoot>
        <Tr>
          <Th>Group</Th>
          <Th>Sample</Th>
          <Th>Replicate</Th>
          <Th isNumeric>Count [{countUnit}]</Th>
        </Tr>
      </Tfoot>
    </Table>
  );
};

export default GeneDetails;
