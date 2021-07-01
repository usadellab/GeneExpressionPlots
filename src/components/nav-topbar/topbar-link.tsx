import React from 'react';
import { useLocation } from 'react-router-dom';
import { Icon, ListItem, Text, useBreakpointValue } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import SiteLink from '@/components/site-link';

export interface TopbarLinkProps {
  /** @type url address */
  href: string;
  /** @type icon to display */
  icon: IconType;
  /** @type text to display */
  text: string;
  /** @type pattern matching strategy to apply the active url color */
  urlMatch?: 'exact' | 'contains';
}

const ToolbarLink: React.FC<TopbarLinkProps> = (props): React.ReactElement => {
  const fontSize = useBreakpointValue({ base: 'md', lg: 'lg' });
  const location = useLocation();

  const match =
    ((props.urlMatch === 'exact' || props.urlMatch === undefined) &&
      location.pathname === props.href) ||
    (props.urlMatch === 'contains' && location.pathname.includes(props.href));

  return (
    <ListItem>
      <SiteLink
        _focus={{
          outline: 'none',
          backgroundColor: 'gray.100',
          textColor: 'orange.600',
        }}
        _hover={{
          backgroundColor: 'gray.100',
          textColor: 'orange.600',
        }}
        alignItems="center"
        borderRadius="md"
        borderY="2px"
        borderColor={match ? 'white' : 'transparent'}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        paddingY={2}
        paddingX={4}
        textColor="white"
        tabIndex={0}
        to={props.href}
      >
        <Icon as={props.icon} width={5} height={5} />
        <Text
          as="span"
          fontSize={fontSize}
          fontWeight="semibold"
          userSelect="none"
        >
          {props.text}
        </Text>
      </SiteLink>
    </ListItem>
  );
};

export default ToolbarLink;
