import { observer } from 'mobx-react';
import React from 'react';
import {
  FaFile,
  FaFileAlt,
  FaFileExport,
  FaFileImport,
  FaTrashAlt,
} from 'react-icons/fa';
import {
  chakra,
  Flex,
  SlideFade,
  useDisclosure,
  Wrap,
  WrapItem,
  useBreakpointValue,
} from '@chakra-ui/react';
import Sidebar, { SidebarButton, SidebarFile } from '@/components/nav-sidebar';
import XTableModal from './components/xtable-modal';
import ReplCard from './components/repl-card';
import { dataTable } from '@/store/data-store';

const FilesPage: React.FC = () => {
  const {
    isOpen: xTableOpen,
    onOpen: onXTableOpen,
    onClose: onXTableClose,
  } = useDisclosure();

  const replCardWidth = useBreakpointValue({
    base: '100%',
    lg: '45%',
    xl: '30%',
  });

  return (
    <Flex flexGrow={1}>
      <SlideFade initial={{ x: -20 }} animate={{ x: 0 }} exit={{ x: -20 }}>
        <chakra.div boxShadow="xl" height="100%" backgroundColor="white">
          <Sidebar position="sticky" top={0} maxWidth="17rem" paddingY="1rem">
            <SidebarButton
              text="Load Expression Table"
              icon={FaFile}
              onClick={onXTableOpen}
            />
            <SidebarButton text="Load Gene Info Table" icon={FaFileAlt} />
            <SidebarFile text="Import GXP Database" icon={FaFileImport} />
            <SidebarButton text="Export GXP Database" icon={FaFileExport} />
            <SidebarButton text="Remove All Data" icon={FaTrashAlt} />
          </Sidebar>
        </chakra.div>
      </SlideFade>
      <Flex
        as="main"
        alignItems="center"
        flexDirection="column"
        padding="2rem"
        width="100%"
      >
        <Wrap spacing="1rem" justify="center">
          {dataTable.colNames.map((replicateName) => (
            <WrapItem key={replicateName} width={replCardWidth}>
              <ReplCard name={replicateName} />
            </WrapItem>
          ))}
        </Wrap>
      </Flex>
      <XTableModal isOpen={xTableOpen} onClose={onXTableClose} />
    </Flex>
  );
};

export default observer(FilesPage);
