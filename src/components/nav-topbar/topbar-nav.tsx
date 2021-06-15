import React from 'react';
import { Flex, FlexProps } from '@chakra-ui/react';
import TopbarLink, { TopbarLinkProps } from './topbar-link';

interface TopbarNavProps extends FlexProps {
  /** @type object with items to be rendered as links */
  links: Omit<TopbarLinkProps, 'showText'>[];
}

const TopbarNav: React.FC<TopbarNavProps> = ({
  links,
  ...props
}): React.ReactElement => {
  return (
    <Flex
      justifyContent="space-around"
      width="100%"
      paddingY={2}
      paddingX={5}
      backgroundColor="orange.600"
      boxShadow="xl"
      {...props}
    >
      {links?.map((link) => (
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
