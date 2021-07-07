import React from 'react';
import {
  FaChartBar,
  // FaHome,
  FaInfo,
  FaDatabase,
  FaTools,
} from 'react-icons/fa';
import { Flex, FlexProps } from '@chakra-ui/react';
import TopbarNav, { TopbarLink } from '@/components/nav-topbar';

type AppLayoutProps = FlexProps;

const AppLayout: React.FC<AppLayoutProps> = (props) => {
  return (
    <Flex
      flexDirection="column"
      minHeight="100vh"
      backgroundColor="gray.100"
      {...props}
    >
      <TopbarNav>
        {/* <TopbarLink href="/" icon={FaHome} text="Home" urlMatch="exact" /> */}
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
