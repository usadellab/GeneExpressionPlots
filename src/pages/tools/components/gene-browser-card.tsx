import { Box, BoxProps, Flex, Text } from '@chakra-ui/layout';
import React from 'react';

interface GeneCardProps extends BoxProps {
  color?: string;
  accession: string;
  geneInfo: Map<string, string>;
}

const GeneCard: React.FC<GeneCardProps> = ({
  accession,
  geneInfo,
  ...props
}) => {
  return (
    <Box
      as="section"
      aria-label="Gene info card"
      aria-describedby={accession}
      display="flex"
      flexDirection="column"
      {...props}
    >
      <Text
        as="h1"
        color="orange.600"
        fontWeight="semibold"
        fontSize="lg"
        id={accession}
        marginBottom={2}
      >
        {accession}
      </Text>

      {geneInfo.size > 0 ? (
        [...geneInfo.entries()].map(([colName, cellValue]) => (
          <Flex key={`${colName}-${accession}`} paddingY={1}>
            <Flex
              flexShrink={0}
              marginLeft={2}
              maxWidth={36}
              fontWeight="semibold"
              textColor="gray.600"
              textTransform="uppercase"
              width={36}
              wordBreak="break-all"
            >
              {colName}
            </Flex>
            <Flex marginLeft={5} wordBreak="break-all">
              {cellValue}
            </Flex>
          </Flex>
        ))
      ) : (
        <Text>There is no information available for this gene</Text>
      )}
    </Box>
  );
};

export default GeneCard;
