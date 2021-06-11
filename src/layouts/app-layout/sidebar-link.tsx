import React, { ReactElement, useMemo } from 'react';
import { IconType } from 'react-icons';
import { useLocation } from 'react-router-dom';
import { Flex, Icon, Text } from '@chakra-ui/react';
import SiteLink from './site-link';

export interface SidebarLinkProps {
  href: string;
  icon: IconType;
  text: string;
  showText?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  icon,
  showText,
  text,
  href,
}: SidebarLinkProps): ReactElement => {
  const location = useLocation();

  const match = useMemo(
    () => location.pathname.split(/(?=\/)/).includes(href),
    [href, location.pathname]
  );

  return (
    <SiteLink
      to={href}
      textColor={match ? 'orange.600' : 'gray.600'}
      _hover={{
        backgroundColor: 'orange.600',
        textColor: 'white',
      }}
      _focus={{
        outline: 'none',
      }}
    >
      <Flex
        paddingX={6}
        paddingY={4}
        alignItems="center"
        overflowX="hidden"
        transitionProperty="width"
        transitionDuration="0.2s"
        transitionTimingFunction="linear forwards"
        width={showText ? '10rem' : '4.5rem'}
      >
        <Icon as={icon} width={6} height={6} />
        <Text
          fontWeight="semibold"
          textTransform="uppercase"
          marginLeft={8}
          fontSize="lg"
        >
          {text}
        </Text>
      </Flex>
    </SiteLink>
  );
};

export default SidebarLink;
