import React from 'react';
import { useLocation } from 'react-router-dom';
import { Icon, Text, useBreakpointValue } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import SiteLink from '@/components/site-link';

export interface TopbarLinkProps {
  href: string;
  icon: IconType;
  text: string;
}

const ToolbarLink: React.FC<TopbarLinkProps> = (props): React.ReactElement => {
  const location = useLocation();
  const fontSize = useBreakpointValue({ base: 'md', lg: 'lg' });

  return (
    <SiteLink
      to={props.href}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      paddingY={2}
      paddingX={4}
      borderRadius="md"
      textColor={location.pathname === props.href ? 'orange.600' : 'gray.600'}
      _hover={{
        backgroundColor: 'orange.600',
        textColor: 'white',
      }}
      _focus={{
        outline: 'none',
      }}
    >
      <Icon as={props.icon} width={5} height={5} />
      <Text as="span" fontSize={fontSize} fontWeight="semibold">
        {props.text}
      </Text>
    </SiteLink>
  );
};

export default ToolbarLink;
