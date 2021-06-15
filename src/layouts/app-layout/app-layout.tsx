import React from 'react';
import {
  FaChartBar,
  FaHome,
  FaInfo,
  FaDatabase,
  FaTools,
} from 'react-icons/fa';
import { Flex } from '@chakra-ui/react';
import TopbarNav, { TopbarLink } from '@/components/nav-topbar';

const AppLayout: React.FC<React.PropsWithChildren<{}>> = (
  props
): React.ReactElement => {
  return (
    <Flex flexDirection="column" minHeight="100vh" backgroundColor="gray.100">
      <TopbarNav>
        <TopbarLink href="/" icon={FaHome} text="Home" urlMatch="exact" />
        <TopbarLink
          href="/data"
          icon={FaDatabase}
          text="Data"
          urlMatch="contains"
        />
        <TopbarLink
          href="/plots"
          icon={FaChartBar}
          text="Plots"
          urlMatch="contains"
        />
        <TopbarLink
          href="/tools"
          icon={FaTools}
          text="Tools"
          urlMatch="contains"
        />
        <TopbarLink
          href="/docs"
          icon={FaInfo}
          text="Docs"
          urlMatch="contains"
        />
      </TopbarNav>

      {props.children}
    </Flex>
  );
};

export default AppLayout;
