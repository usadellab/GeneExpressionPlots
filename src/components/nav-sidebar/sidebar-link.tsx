import React from 'react';
import { IconType } from 'react-icons';
import { useLocation } from 'react-router-dom';
import { Icon, Text } from '@chakra-ui/react';
import SiteLink from '@/components/site-link';

export interface SidebarLinkProps {
  /** @type link url */
  href: string;
  /** @type link icon */
  icon: IconType;
  /** @type link text */
  text: string;
  /** @type pattern matching strategy to apply the active url color */
  urlMatch?: 'exact' | 'contains';
}

const SidebarLink: React.FC<SidebarLinkProps> = (props) => {
  const location = useLocation();

  const match =
    ((props.urlMatch === 'exact' || props.urlMatch === undefined) &&
      location.pathname === props.href) ||
    (props.urlMatch === 'contains' && location.pathname.includes(props.href));

  return (
    <SiteLink
      _focus={{
        outline: 'none',
        border: '1px',
        borderColor: 'orange.600',
      }}
      _hover={{
        backgroundColor: 'orange.600',
        textColor: 'white',
      }}
      alignItems="center"
      display="flex"
      paddingX={6}
      paddingY={4}
      textColor={match ? 'orange.600' : 'gray.600'}
      tabIndex={0}
      to={props.href}
    >
      <Icon as={props.icon} height={6} width={6} />
      <Text fontWeight="semibold" marginLeft={6} whiteSpace="nowrap">
        {props.text}
      </Text>
    </SiteLink>
  );
};

export default SidebarLink;
