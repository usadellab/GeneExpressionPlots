import React from 'react';
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  ThemingProps,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';

import GeneCard from './gene-browser-card';
import GeneDetails from './gene-details';
import { dataTable, infoTable } from '@/store/data-store';

import { escapeRegExp } from '@/utils/string';
import GeneBrowserForm, { BrowserFormSubmitHandler } from './gene-browser-form';

interface GeneCard {
  accession: string;
  geneInfo: Map<string, string>;
}

interface PageView {
  geneCards: GeneCard[];
  pageMax: number;
}

const GeneBrowser: React.FC = () => {
  /* GENE DETAILS TABLE */

  const modalSize = useBreakpointValue<ThemingProps<'Modal'>['size']>({
    base: 'full',
    lg: '6xl',
  });

  const {
    isOpen: isGeneDetailsOpen,
    onOpen: onGeneDetailsOpen,
    onClose: onGeneDetailsClose,
  } = useDisclosure();

  const refGeneDetailsAccession = React.useRef<string>('');

  const showGeneDetails = (accessionId: string) => () => {
    refGeneDetailsAccession.current = accessionId;
    onGeneDetailsOpen();
  };

  /* GENE BROWSER VIEW */

  const [pageView, setPageView] = React.useState<PageView>({
    geneCards: [],
    pageMax: 1,
  });

  const [pageLoading, setPageLoading] = React.useState(true);

  const computePageView = React.useCallback(
    (accessionId: string, countView: number, pageNum: number): PageView => {
      // Retrieve gene information matching the search parameters (empty search matches all)
      const regexp = new RegExp(escapeRegExp(accessionId), 'i');
      const matchingResults = dataTable.rowNames.reduce(
        (matches, accession) => {
          // Match text in the accessions ids
          const accessionMatch = accession.search(regexp) > -1;

          // Match text in the info fields
          const geneInfo = infoTable.getRowAsMap(accession) ?? new Map();
          const infoMatch = geneInfo
            ? Array.from(geneInfo.values()).some(
                (field) => field.search(regexp) > -1
              )
            : false;

          // Include in the results if any matches are found
          if (accessionMatch || infoMatch)
            matches.push({
              accession,
              geneInfo,
            });

          return matches;
        },
        [] as Array<{ accession: string; geneInfo: Map<string, string> }>
      );

      // Calculate the current page view
      const start = (pageNum - 1) * countView;
      const end = pageNum * countView;
      const geneCards = matchingResults.slice(start, end);

      // Calculate the number of pages according to the current display options
      const pageMax = Math.ceil(matchingResults.length / countView) || 1;

      return { geneCards, pageMax };
    },
    []
  );

  React.useEffect(
    function loadInitialGeneView() {
      setPageLoading(true);
      const pageView = computePageView('', 20, 1);
      setPageView(pageView);
      setPageLoading(false);
    },
    [computePageView]
  );

  const onBrowserFormSubmit: BrowserFormSubmitHandler = (values, actions) => {
    setPageLoading(true);

    setTimeout(() => {
      const pageView = computePageView(
        values.searchText,
        values.countView,
        values.pageNum
      );
      setPageView(pageView);

      actions.setSubmitting(false);
      setPageLoading(false);
    }, 10);
  };

  return (
    <Flex
      flexDirection="column"
      backgroundColor="white"
      flexGrow={1}
      padding={6}
    >
      <GeneBrowserForm
        alignItems="start"
        flexDirection={{ base: 'column', md: 'row' }}
        justifyContent="space-around"
        onSubmit={onBrowserFormSubmit}
        pageMax={pageView.pageMax}
      />

      {pageLoading ? (
        <Flex
          width="100%"
          flexGrow={1}
          justifyContent="center"
          alignItems="center"
        >
          <Spinner size="xl" />
        </Flex>
      ) : (
        pageView.geneCards.map(({ accession, geneInfo }) => (
          <GeneCard
            _first={{
              marginTop: 5,
            }}
            _even={{
              backgroundColor: 'orange.50',
            }}
            _hover={{
              backgroundColor: 'orange.100',
              cursor: 'pointer',
            }}
            _focus={{
              outline: 'none',
              border: '1px solid',
              borderColor: 'orange.600',
              backgroundColor: 'orange.100',
            }}
            accession={accession}
            border="1px solid"
            borderColor="transparent"
            geneInfo={geneInfo}
            key={accession}
            padding={5}
            tabIndex={0}
            onDoubleClick={showGeneDetails(accession)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                showGeneDetails(accession)();
              }
            }}
          />
        ))
      )}

      <Modal
        isOpen={isGeneDetailsOpen}
        onClose={onGeneDetailsClose}
        size={modalSize}
      >
        <ModalOverlay />
        <ModalContent
          margin={modalSize === 'full' ? 0 : undefined}
          overflow="auto"
          rounded="none"
        >
          <ModalHeader color="orange.600">
            {refGeneDetailsAccession.current}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <GeneDetails accessionId={refGeneDetailsAccession.current} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="orange" mr={3} onClick={onGeneDetailsClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default GeneBrowser;
