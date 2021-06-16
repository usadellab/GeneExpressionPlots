import React from 'react';
import { FaBackspace } from 'react-icons/fa';
import { Box, Button, Checkbox, Flex, Text } from '@chakra-ui/react';
import { dataTable } from '@/store/data-store';

interface ReplicateCardProps {
  name: string;
  onSelect?: (name: string, checked: boolean) => void;
}

const ReplicateCard: React.FC<ReplicateCardProps> = (props) => {
  const deleteReplicate = (): void => {
    dataTable.removeColumn(props.name);
  };

  const selectReplicate: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (props.onSelect) props.onSelect(props.name, event.target.checked);
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
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontWeight="semibold">{props.name}</Text>
        <Checkbox onChange={selectReplicate} />
      </Flex>
      <Button
        _groupHover={{
          diplay: 'flex',
        }}
        color="red.600"
        marginTop=".5rem"
        onClick={deleteReplicate}
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
