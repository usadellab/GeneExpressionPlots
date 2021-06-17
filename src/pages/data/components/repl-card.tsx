import React from 'react';
import { FaBackspace } from 'react-icons/fa';
import { Box, BoxProps, Button, Checkbox, Flex, Text } from '@chakra-ui/react';
import { dataTable } from '@/store/data-store';

interface ReplicateCardProps extends Omit<BoxProps, 'onSelect'> {
  name: string;
  onSelect?: (name: string, checked: boolean) => void;
}

const ReplicateCard: React.FC<ReplicateCardProps> = ({
  name,
  onSelect,
  ...props
}) => {
  const deleteReplicate = (): void => {
    dataTable.removeColumn(name);
  };

  const selectReplicate: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (onSelect) onSelect(name, event.target.checked);
  };

  return (
    <Box
      _focus={{
        outline: 'none',
        border: '1px',
        borderColor: 'orange.600',
      }}
      _focusWithin={{
        border: '1px',
        borderColor: 'orange.600',
      }}
      as="section"
      backgroundColor="white"
      boxShadow="md"
      maxWidth="container.md"
      padding="1.5rem"
      role="group"
      tabIndex={0}
      width="100%"
      {...props}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontWeight="semibold">{name}</Text>
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
