import React from 'react';
import { IconType } from 'react-icons';
import { useLocation } from 'react-router-dom';
import { Flex, Icon, Text } from '@chakra-ui/react';
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
      to={props.href}
      textColor={match ? 'orange.600' : 'gray.600'}
      _hover={{
        backgroundColor: 'orange.600',
        textColor: 'white',
      }}
      _focus={{
        outline: 'none',
      }}
    >
      <Flex paddingX={6} paddingY={4} alignItems="center">
        <Icon as={props.icon} width={6} height={6} />
        <Text fontWeight="semibold" marginLeft={8} fontSize="lg">
          {props.text}
        </Text>
      </Flex>
    </SiteLink>
  );
};

export default SidebarLink;
