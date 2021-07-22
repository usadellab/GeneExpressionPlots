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

import { enrichmentStore } from '@/store/enrichment-store';

interface EnrichmentDetails {
  id: string;
}

const EnrichmentDetails: React.FC<EnrichmentDetails> = ({ id }) => {
  const enrichment = enrichmentStore.getAnalysisById(id);

  const data = enrichment ? enrichment.data : [];
  const TEFcolumn = enrichment ? enrichment.TEFcolumn : '';

  return (
    <Table colorScheme="orange" variant="striped">
      <TableCaption>
        {`p_Values of over-represented among ${TEFcolumn}`}
      </TableCaption>
      <Thead>
        <Tr
          sx={{
            '& > th': {
              fontSize: 14,
            },
          }}
        >
          <Th>Test Entry</Th>
          <Th isNumeric>p_Value</Th>
          <Th isNumeric>adjusted p_Value</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map(([testEntry, pValue, adjpValue]) => (
          <Tr
            key={`${testEntry}-${pValue}-${adjpValue}`}
            tabIndex={0}
            aria-label={`testEntry: ${testEntry}, pValue: ${pValue}, adjpValue: ${adjpValue} `}
            _focus={{
              outline: '2px solid',
              outlineColor: 'orange.600',
            }}
          >
            <Td>{testEntry}</Td>
            <Td isNumeric>{pValue}</Td>
            <Td isNumeric>{adjpValue}</Td>
          </Tr>
        ))}
      </Tbody>
      <Tfoot>
        <Tr>
          <Th>Test Entry</Th>
          <Th isNumeric>p_Value</Th>
          <Th isNumeric>adjusted p_Value</Th>
        </Tr>
      </Tfoot>
    </Table>
  );
};

export default EnrichmentDetails;
