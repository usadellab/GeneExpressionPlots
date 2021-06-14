import React from 'react';
import { Flex } from '@chakra-ui/react';
import TopbarLink, { TopbarLinkProps } from './topbar-link';

interface TopbarNavProps {
  /** @type add a top border accent to the topbar */
  accent?: boolean;
  /** @type object with items to be rendered as links */
  links: Omit<TopbarLinkProps, 'showText'>[];
}

const TopbarNav: React.FC<TopbarNavProps> = (props): React.ReactElement => {
  return (
    <Flex
      justifyContent="space-around"
      width="100%"
      paddingY={2}
      paddingX={5}
      borderTop={props.accent ? '8px' : 'none'}
      borderColor="orange.600"
      backgroundColor="white"
      shadow="lg"
    >
      {props.links?.map((link) => (
        <TopbarLink
          key={link.href}
          href={link.href}
          icon={link.icon}
          text={link.text}
          urlMatch={link.urlMatch}
        />
      ))}
      {props.children}
    </Flex>
  );
};

export default TopbarNav;
