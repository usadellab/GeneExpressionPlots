import React from 'react';
import { IconType } from 'react-icons';
import { Flex, Icon, Input, InputProps, Text } from '@chakra-ui/react';

export interface InputFileProps extends InputProps {
  icon: IconType;
  text: string;
}

const InputFile: React.FC<InputFileProps> = ({ icon, text, ...inputProps }) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const activateOnKeyDown: React.KeyboardEventHandler<HTMLLabelElement> = (
    event
  ) => {
    if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click();
  };

  return (
    <Flex
      as="label"
      _hover={{
        textColor: 'orange.600',
      }}
      _focus={{
        outline: 'none',
        textColor: 'orange.600',
      }}
      alignItems="center"
      flexWrap="nowrap"
      paddingX={6}
      paddingY={4}
      tabIndex={0}
      textColor="gray.600"
      onKeyDown={
        activateOnKeyDown as unknown as React.KeyboardEventHandler<HTMLDivElement>
      }
    >
      <Input
        ref={(ref) => (inputRef.current = ref)}
        type="file"
        hidden
        {...inputProps}
      />
      <Icon as={icon} width={6} height={6} />
      <Text fontWeight="semibold" marginLeft={6} whiteSpace="nowrap">
        {text}
      </Text>
    </Flex>
  );
};

export default InputFile;
