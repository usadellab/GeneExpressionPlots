import React from 'react';
import { FaBackspace } from 'react-icons/fa';
import { Box, BoxProps, Button, Checkbox, Flex, Text } from '@chakra-ui/react';

interface ReplicateCardProps extends Omit<BoxProps, 'onSelect'> {
  name: string;
  onDelete?: (name: string) => void;
  onSelect?: (name: string, checked: boolean) => void;
}

const ReplicateCard: React.FC<ReplicateCardProps> = ({
  name,
  onDelete,
  onSelect,
  ...props
}) => {
  const deleteReplicate = (): void => {
    if (onDelete) {
      onDelete(name);
    }
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
        borderColor: 'orange.600',
      }}
      _focusWithin={{
        borderColor: 'orange.600',
      }}
      _hover={{
        borderColor: 'orange.600',
      }}
      border="1px"
      borderColor="transparent"
      as="section"
      backgroundColor="white"
      boxShadow="md"
      maxWidth="container.md"
      padding="1.5rem"
      role="group"
      width="100%"
      {...props}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontWeight="semibold">{name}</Text>
        {onSelect && (
          <Checkbox
            aria-label={`Add ${name} to selection`}
            colorScheme="orange"
            onChange={selectReplicate}
          />
        )}
      </Flex>

      {onDelete && (
        <Button
          _groupHover={{
            diplay: 'flex',
          }}
          aria-label={`Delete ${name}`}
          color="red.600"
          marginTop=".5rem"
          onClick={deleteReplicate}
          rightIcon={<FaBackspace />}
          size="sm"
          variant="ghost"
        >
          Delete
        </Button>
      )}
    </Box>
  );
};

export default ReplicateCard;
