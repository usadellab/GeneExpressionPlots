import { IconButton } from '@chakra-ui/button';
import Icon from '@chakra-ui/icon';
import { Box, BoxProps, Flex, Text } from '@chakra-ui/layout';
import React from 'react';
import { AiOutlineEye } from 'react-icons/ai';

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
      <Flex alignItems="center" marginBottom={2} gridGap="1rem">
        <Text
          as="h1"
          color="orange.600"
          fontWeight="semibold"
          fontSize="lg"
          id={accession}
        >
          {accession}
        </Text>
        <Icon
          aria-label="show tabular transcript expression values"
          as={AiOutlineEye}
          w={5}
          h={5}
          color="gray.600"
          onClick={
            props.onDoubleClick as
              | React.MouseEventHandler<SVGElement>
              | undefined
          }
          _hover={{
            color: 'gray.800',
          }}
        ></Icon>
      </Flex>

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
