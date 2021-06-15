import React from 'react';
import { Stack, StackProps, useDisclosure } from '@chakra-ui/react';

export interface SidebarProps extends StackProps {
  /** @type add a top border accent to the topbar */
  accent?: boolean;
}

const SidebarNav: React.FC<React.PropsWithChildren<SidebarProps>> = (props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Stack
      backgroundColor="white"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      overflowX="hidden"
      transitionProperty="width"
      transitionDuration="0.2s"
      transitionTimingFunction="linear forwards"
      width={isOpen ? props.maxWidth ?? '15rem' : '4.5rem'}
      {...props}
    >
      {props.children}
    </Stack>
  );
};

export default SidebarNav;
