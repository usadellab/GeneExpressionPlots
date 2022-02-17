import React from 'react';
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td } from '@chakra-ui/react';

import { enrichmentStore } from '@/store/enrichment-store';

interface EnrichmentDetails {
  id: string;
  filterSignificant: boolean;
}

const EnrichmentDetails: React.FC<EnrichmentDetails> = ({
  id,
  filterSignificant,
}) => {
  const enrichment = enrichmentStore.getAnalysisById(id);

  const data = enrichment ? enrichment.data : [];
  const hasDescriptions = enrichment?.options.descriptionColumn != 'None';
  const offset = hasDescriptions ? 1 : 0;
  const filterValuesFn = filterSignificant
    ? (x: number) => x <= 0.05
    : (x: number) => x;

  return (
    <Table colorScheme="orange" variant="striped">
      <Thead>
        <Tr
          sx={{
            '& > th': {
              fontSize: 14,
            },
          }}
        >
          <Th>Test Entry</Th>
          {hasDescriptions && <Th>Description</Th>}
          <Th isNumeric>p_Value</Th>
          <Th isNumeric>adjusted p_Value</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data &&
          data
            .filter((row) => filterValuesFn(row[2 + offset] as number))
            .map((row) => {
              const testEntry = row[0];
              const pValue = row[1 + offset];
              const adjpValue = row[2 + offset];
              const description = hasDescriptions ? row[1] : undefined;
              return (
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
                  {hasDescriptions && <Td maxWidth={'25rem'}>{description}</Td>}
                  <Td isNumeric>{pValue}</Td>
                  <Td isNumeric>{adjpValue}</Td>
                </Tr>
              );
            })}
      </Tbody>
      <Tfoot>
        <Tr>
          <Th>Test Entry</Th>
          {hasDescriptions && <Th>Description</Th>}
          <Th isNumeric>p_Value</Th>
          <Th isNumeric>adjusted p_Value</Th>
        </Tr>
      </Tfoot>
    </Table>
  );
};

export default EnrichmentDetails;
