import React from 'react';
import { Stack, StackProps, useDisclosure } from '@chakra-ui/react';
import SidebarLink, { SidebarLinkProps } from './sidebar-link';

interface SidebarProps extends StackProps {
  /** @type add a top border accent to the topbar */
  accent?: boolean;
  /** @type object with items to be rendered as links */
  links?: Omit<SidebarLinkProps, 'showText'>[];
}

const SidebarNav: React.FC<React.PropsWithChildren<SidebarProps>> = ({
  accent,
  links,
  ...stackProps
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Stack
      backgroundColor="white"
      borderTop={accent ? '8px' : 'none'}
      borderColor="orange.600"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      overflowX="hidden"
      transitionProperty="width"
      transitionDuration="0.2s"
      transitionTimingFunction="linear forwards"
      width={isOpen ? stackProps.maxWidth ?? '15rem' : '4.5rem'}
      {...stackProps}
    >
      {links?.map((link) => (
        <SidebarLink
          key={link.href}
          href={link.href}
          icon={link.icon}
          text={link.text}
        />
      ))}
      {stackProps.children}
    </Stack>
  );
};

export default SidebarNav;
