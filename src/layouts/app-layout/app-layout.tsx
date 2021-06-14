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
        links={[
          {
            href: '/',
            icon: FaHome,
            text: 'Home',
          },
          {
            href: '/data',
            icon: FaDatabase,
            text: 'Data',
          },
          {
            href: '/plots',
            icon: FaChartBar,
            text: 'Plots',
          },
          {
            href: '/tools',
            icon: FaTools,
            text: 'Tools',
          },
          {
            href: '/docs',
            icon: FaInfo,
            text: 'Docs',
          },
        ]}
      />

      {props.children}
    </Flex>
  );
};

export default AppLayout;
