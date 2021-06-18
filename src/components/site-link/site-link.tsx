import React from 'react';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';
import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from '@chakra-ui/react';

export type SiteLinkProps = RouterLinkProps & ChakraLinkProps;

const SiteLink: React.FC<SiteLinkProps> = (props): React.ReactElement => {
  return (
    <ChakraLink {...props} as={RouterLink}>
      {props.children}
    </ChakraLink>
  );
};

export default SiteLink;
