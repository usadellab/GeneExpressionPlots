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

  const [selectedReplicates, setSelectedReplicates] = React.useState<string[]>(
    []
  );

  const replCardWidth = useBreakpointValue({
    base: '100%',
    lg: '45%',
    xl: '30%',
  });

  const bulkRemoveReplicates = (): void => {
    if (selectedReplicates.length > 0) {
      selectedReplicates.forEach((repl) => dataTable.removeColumn(repl));
      setSelectedReplicates([]);
    } else {
      dataTable.clearData();
    }
  };

  const updateSelectedReplicates = (name: string, checked: boolean): void => {
    if (checked) {
      setSelectedReplicates([...selectedReplicates, name]);
    } else {
      setSelectedReplicates(selectedReplicates.filter((repl) => repl !== name));
    }
  };

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
            <SidebarButton
              text={
                selectedReplicates.length > 0
                  ? 'Remove selected'
                  : 'Remove All Data'
              }
              icon={FaTrashAlt}
              onClick={bulkRemoveReplicates}
            />
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
              <ReplCard
                name={replicateName}
                onSelect={updateSelectedReplicates}
              />
            </WrapItem>
          ))}
        </Wrap>
      </Flex>
      <XTableModal isOpen={xTableOpen} onClose={onXTableClose} />
    </Flex>
  );
};

export default observer(FilesPage);
