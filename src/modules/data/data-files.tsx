import React from 'react';
import {
  FaFile,
  FaFileAlt,
  FaFileExport,
  FaFileImport,
  FaTrashAlt,
} from 'react-icons/fa';
import { Flex, SlideFade, useDisclosure } from '@chakra-ui/react';
import Sidebar, { SidebarButton, SidebarFile } from '@/components/nav-sidebar';
import XTableModal from './components/xtable-modal';

const FilesPage: React.FC = () => {
  const {
    isOpen: xTableOpen,
    onOpen: onXTableOpen,
    onClose: onXTableClose,
  } = useDisclosure();

  return (
    <Flex flexGrow={1}>
      <SlideFade initial={{ x: -20 }} animate={{ x: 0 }} exit={{ x: -20 }}>
        <Sidebar boxShadow="xl" height="100%" maxWidth="17rem" paddingY="1rem">
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
      </SlideFade>
      <main></main>
      <XTableModal isOpen={xTableOpen} onClose={onXTableClose} />
    </Flex>
  );
};

export default FilesPage;
