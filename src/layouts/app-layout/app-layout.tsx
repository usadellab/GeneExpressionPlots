import React from 'react';
import {
  FaChartBar,
  FaHome,
  FaInfo,
  FaDatabase,
  FaTools,
} from 'react-icons/fa';
import { Flex } from '@chakra-ui/react';
import TopbarNav from '@/components/nav-topbar';

const AppLayout: React.FC<React.PropsWithChildren<{}>> = (
  props
): React.ReactElement => {
  return (
    <Flex flexDirection="column" minHeight="100vh" backgroundColor="gray.100">
      <TopbarNav
        accent
        links={[
          {
            href: '/',
            icon: FaHome,
            text: 'Home',
            urlMatch: 'exact',
          },
          {
            href: '/data',
            icon: FaDatabase,
            text: 'Data',
            urlMatch: 'contains',
          },
          {
            href: '/plots',
            icon: FaChartBar,
            text: 'Plots',
            urlMatch: 'contains',
          },
          {
            href: '/tools',
            icon: FaTools,
            text: 'Tools',
            urlMatch: 'contains',
          },
          {
            href: '/docs',
            icon: FaInfo,
            text: 'Docs',
            urlMatch: 'contains',
          },
        ]}
      />

      {props.children}
    </Flex>
  );
};

export default AppLayout;
