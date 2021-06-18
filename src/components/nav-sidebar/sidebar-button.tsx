import React from 'react';
import { IconType } from 'react-icons';
import { Flex, FlexProps, Icon, SpaceProps, Text } from '@chakra-ui/react';

export interface SidebarButtonProps extends Omit<FlexProps, 'onClick'> {
  /** @type link icon */
  icon: IconType;
  /** @type on activation callback */
  onClick?: <
    T extends
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>
  >(
    event: T
  ) => void;
  /** @type link text */
  text: string;
  /** @type spacing between the icon and text */
  textGap?: SpaceProps['marginLeft'];
}

const SidebarButton: React.FC<SidebarButtonProps> = ({
  icon,
  onClick,
  text,
  textGap,
  ...props
}) => {
  const activateOnMouseDown: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.preventDefault();
    if (event.button === 0 && onClick) onClick(event);
  };

  const activateOnKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (
    event
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      if (onClick) onClick(event);
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
      {...props}
    >
      <Icon as={icon} width={6} height={6} />
      <Text fontWeight="semibold" marginLeft={textGap ?? 6} whiteSpace="nowrap">
        {text}
      </Text>
    </Flex>
  );
};

export default SidebarButton;
