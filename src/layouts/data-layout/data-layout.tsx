import React from 'react';
import { FaFileAlt, FaLayerGroup } from 'react-icons/fa';
import { Flex, SlideFade } from '@chakra-ui/react';
import SidebarNav from '@/components/nav-sidebar';

const AppLayout: React.FC<React.PropsWithChildren<{}>> = (
  props
): React.ReactElement => {
  return (
    <Flex flexGrow={1} backgroundColor="gray.100">
      <SlideFade initial={{ x: -20 }} animate={{ x: 0 }} exit={{ x: -20 }}>
        <SidebarNav
          boxShadow="xl"
          height="100%"
          links={[
            {
              href: '/data/files',
              icon: FaFileAlt,
              text: 'Files',
            },
            {
              href: 'data/factors',
              icon: FaLayerGroup,
              text: 'Factors',
            },
          ]}
          maxWidth="12rem"
        />
      </SlideFade>
      {props.children}
    </Flex>
  );
};

export default AppLayout;
