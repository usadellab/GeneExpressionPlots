import React from 'react';
import { Box, BoxProps, UnorderedList } from '@chakra-ui/react';

const TopbarNav: React.FC<BoxProps> = (props): React.ReactElement => {
  return (
    <Box
      as="nav"
      paddingY={2}
      paddingX={5}
      backgroundColor="orange.600"
      boxShadow="xl"
      {...props}
    >
      <UnorderedList
        display="flex"
        justifyContent="space-around"
        listStyleType="none"
      >
        {props.children}
      </UnorderedList>
    </Box>
  );
};

export default TopbarNav;
