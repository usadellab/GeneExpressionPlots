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
}

const SidebarLink: React.FC<SidebarLinkProps> = (props) => {
  const location = useLocation();

  const match = React.useMemo(
    () => location.pathname.split(/(?=\/)/).includes(props.href),
    [props.href, location.pathname]
  );

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
        <Text
          fontWeight="semibold"
          textTransform="uppercase"
          marginLeft={8}
          fontSize="lg"
        >
          {props.text}
        </Text>
      </Flex>
    </SiteLink>
  );
};

export default SidebarLink;
