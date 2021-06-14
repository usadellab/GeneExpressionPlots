import React from 'react';
import { Stack, useDisclosure } from '@chakra-ui/react';
import SidebarLink, { SidebarLinkProps } from './sidebar-link';

interface SidebarProps {
  /** @type add a top border accent to the topbar */
  accent?: boolean;
  /** @type object with items to be rendered as links */
  links?: Omit<SidebarLinkProps, 'showText'>[];
}

const SidebarNav: React.FC<React.PropsWithChildren<SidebarProps>> = (props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Stack
      boxShadow="xl"
      height="100vh"
      position="sticky"
      top={0}
      backgroundColor="white"
      borderTop={props.accent ? '8px' : 'none'}
      borderColor="orange.600"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      {props.links?.map((link) => (
        <SidebarLink
          key={link.href}
          href={link.href}
          icon={link.icon}
          showText={isOpen}
          text={link.text}
        />
      ))}
      {props.children}
    </Stack>
  );
};

export default SidebarNav;
