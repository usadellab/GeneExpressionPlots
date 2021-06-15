import React from 'react';
import { IconType } from 'react-icons';
import { Flex, Icon, Text } from '@chakra-ui/react';

export interface SidebarButtonProps {
  /** @type link icon */
  icon: IconType;
  /** @type link text */
  text: string;
  /** @type on activation callback */
  onClick?: <
    T extends
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>
  >(
    event: T
  ) => void;
}

const SidebarButton: React.FC<SidebarButtonProps> = (props) => {
  const activateOnMouseDown: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.preventDefault();
    if (props.onClick) props.onClick(event);
  };

  const activateOnKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (
    event
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      if (props.onClick) props.onClick(event);
    }
  };

  return (
    <Flex
      _hover={{
        textColor: 'orange.600',
      }}
      _focus={{
        outline: 'none',
        textColor: 'orange.600',
      }}
      alignItems="center"
      as="button"
      flexWrap="nowrap"
      paddingX={6}
      paddingY={4}
      textColor="gray.600"
      onKeyDown={
        activateOnKeyDown as unknown as React.KeyboardEventHandler<HTMLDivElement>
      }
      onMouseDown={
        activateOnMouseDown as unknown as React.MouseEventHandler<HTMLDivElement>
      }
    >
      <Icon as={props.icon} width={6} height={6} />
      <Text fontWeight="semibold" marginLeft={6} whiteSpace="nowrap">
        {props.text}
      </Text>
    </Flex>
  );
};

export default SidebarButton;
