import React from 'react';
import { FaBackspace } from 'react-icons/fa';
import { Box, Button, Text } from '@chakra-ui/react';
import { dataTable } from '@/store/data-store';

const ReplicateCard: React.FC<{ name: string }> = (props) => {
  const deleteReplicate = (name: string) => () => {
    dataTable.removeColumn(name);
  };

  return (
    <Box
      as="section"
      backgroundColor="white"
      boxShadow="md"
      maxWidth="container.md"
      padding="1.5rem"
      role="group"
      width="100%"
    >
      <Text fontWeight="semibold">{props.name}</Text>
      <Button
        _groupHover={{
          diplay: 'flex',
        }}
        color="red.600"
        marginTop=".5rem"
        onClick={deleteReplicate(props.name)}
        rightIcon={<FaBackspace />}
        size="sm"
        variant="ghost"
      >
        Delete
      </Button>
    </Box>
  );
};

export default ReplicateCard;
