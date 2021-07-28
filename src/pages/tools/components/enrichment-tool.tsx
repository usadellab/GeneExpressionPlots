import React from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  FlexProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  IconButton,
  Spinner,
  Text,
  useDisclosure,
  useBreakpointValue,
  ThemingProps,
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';

import { observer } from 'mobx-react';

import { FaPlus, FaTrashAlt } from 'react-icons/fa';

import { infoTable } from '@/store/data-store';
import { enrichmentStore } from '@/store/enrichment-store';
import { EnrichmentAnalysisOptions } from '@/types/enrichment';

import EnrichmentDetails from './enrichment-details';
import EnrichmentForm, { EnrichmentFormSubmitHandler } from './enrichment-form';
import FormikModal from '@/components/formik-modal';

interface CardRowProps extends FlexProps {
  label: string;
  value: string;
}

const CardRow: React.FC<CardRowProps> = ({ label, value, ...props }) => {
  return (
    <Flex paddingY={0.5} width="full">
      <Flex
        flexShrink={0}
        marginLeft={2}
        maxWidth="12rem"
        fontWeight="semibold"
        textColor="gray.600"
        // textTransform="uppercase"
        width="12rem"
        wordBreak="break-all"
        {...props}
      >
        {label}
      </Flex>
      <Flex marginLeft={5} wordBreak="break-word">
        {value}
      </Flex>
    </Flex>
  );
};

const EnrichmentTool: React.FC = () => {
  const modalSize = useBreakpointValue<ThemingProps<'Modal'>['size']>({
    base: 'full',
    lg: '6xl',
  });

  const dataAvailable = infoTable.hasData;

  /* FORM */
  const refEnrichmentFormInitialFocus = React.useRef<FocusableElement | null>(
    null
  );

  const {
    isOpen: isEnrichmentFormOpen,
    onOpen: onEnrichmentFormOpen,
    onClose: onEnrichmentFormClose,
  } = useDisclosure();

  const onEnrichmentFormSubmit: EnrichmentFormSubmitHandler = (
    values,
    actions
  ) => {
    actions.setSubmitting(false);
    onEnrichmentFormClose();

    const enrichmentInput: EnrichmentAnalysisOptions = {
      TEFcolumn: values.TEFcolumn,
      TEFselector: values.TEFselector,
      TEFselectorValue: values.TEFselectorValue,
      TEIcolumn: values.TEIcolumn,
      TEIselectorType: values.TEIselectorType,
      TEIselector:
        values.TEIselectorType === 'binary'
          ? values.TEIselectorBinary
          : values.TEIselectorMulti,
      TEIselectorValue: values.TEIselectorValue,
      title: values.title,
    };

    setTimeout(
      () => enrichmentStore.addEnrichmentAnalysis(enrichmentInput),
      10
    );
  };

  /* DETAILS */
  const refEnrichmentDetailsId = React.useRef<string>('');
  const {
    isOpen: isEnrichmentDetailsOpen,
    onOpen: onEnrichmentDetailsOpen,
    onClose: onEnrichmentDetailsClose,
  } = useDisclosure();

  const showEnrichmentDetails = (id: string) => () => {
    refEnrichmentDetailsId.current = id;
    onEnrichmentDetailsOpen();
  };

  const handleDeletePlot =
    (id: string): React.MouseEventHandler<HTMLButtonElement> =>
    (event): void => {
      enrichmentStore.deleteAnalysis(id);
      event.stopPropagation();
    };

  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      padding="2rem"
      width="100%"
      paddingRight="6rem"
    >
      {!dataAvailable ? (
        <Alert
          alignItems="center"
          flexDirection="column"
          minHeight="16rem"
          maxHeight="20rem"
          justifyContent="center"
          marginLeft={3}
          marginTop={3}
          status="warning"
          textAlign="center"
          variant="subtle"
        >
          <AlertIcon boxSize="3rem" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            No data has been loaded
          </AlertTitle>
          <AlertDescription maxWidth="xl">
            It seems no gene info data has been loaded into the application yet.
            You can load data from various formats in the Data section of the
            toolbar above.
          </AlertDescription>
        </Alert>
      ) : enrichmentStore.analyses.length === 0 ? (
        <Alert
          alignItems="center"
          flexDirection="column"
          minHeight="16rem"
          maxHeight="20rem"
          justifyContent="center"
          marginLeft={3}
          marginTop={3}
          status="info"
          textAlign="center"
          variant="subtle"
          colorScheme="orange"
        >
          <AlertIcon boxSize="3rem" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Run your enrichment analysis
          </AlertTitle>
          <AlertDescription maxWidth="xl">
            To run an enrichment analysis on the data supplied by your meta
            information table, click the Button in the bottom right corner and
            fill out the Form. For more Information see [Documentation]
          </AlertDescription>
        </Alert>
      ) : (
        enrichmentStore.analyses.map((analysis, index) => (
          <Flex
            key={index}
            _focus={{
              outline: 'none',
              borderLeftColor: 'orange.600',
            }}
            _hover={{
              borderLeftColor: 'orange.600',
              boxShadow: 'md',
              textDecoration: 'none',
            }}
            cursor="pointer"
            backgroundColor="white"
            borderLeft="4px"
            borderLeftColor="transparent"
            boxShadow="sm"
            padding={5}
            tabIndex={0}
            width="100%"
            alignItems="center"
            justifyContent="center"
            as="section"
            flexGrow={1}
            marginTop={4}
            onClick={showEnrichmentDetails(analysis.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                showEnrichmentDetails(analysis.id)();
              }
            }}
          >
            {analysis.isLoading ? (
              <Spinner
                display="flex"
                key={`${analysis.id}-loading`}
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="md"
              />
            ) : (
              <Box width="100%">
                <Text
                  as="h1"
                  fontSize="xl"
                  fontWeight="semibold"
                  marginBottom={2}
                  textColor="orange.600"
                >
                  {analysis.options.title}
                </Text>
                <CardRow
                  label="Enrichment type"
                  value={analysis.options.TEIselectorType}
                />
                <CardRow
                  label="Tested Enrichment for"
                  value={analysis.options.TEFcolumn}
                  marginTop="0.4rem"
                />
                <CardRow
                  label="Selector"
                  value={`"${analysis.options.TEFselector}" : "${analysis.options.TEFselectorValue}"`}
                />
                <CardRow
                  label="Tested Enrichment in"
                  value={analysis.options.TEIcolumn}
                  marginTop="0.4rem"
                />
                <CardRow
                  label="Selector"
                  value={`"${analysis.options.TEIselector}" : "${analysis.options.TEIselectorValue}"`}
                />
              </Box>
            )}
            {!analysis.isLoading && (
              <IconButton
                _hover={{
                  color: 'orange.600',
                }}
                alignSelf="flex-start"
                aria-label="Delete enrichment analysis"
                color="gray.600"
                icon={<FaTrashAlt />}
                marginLeft={2}
                size="lg"
                variant="ghost"
                onClick={handleDeletePlot(analysis.id)}
                zIndex="modal"
              />
            )}
          </Flex>
        ))
      )}

      <IconButton
        aria-label="add new enrichment analysis"
        icon={<FaPlus size="1rem" color="white" />}
        position="fixed"
        height="4rem"
        width="4rem"
        variant="solid"
        right="1rem"
        bottom="1rem"
        backgroundColor="orange.400"
        borderRadius="full"
        shadow="xl"
        _hover={{
          backgroundColor: 'orange.300',
        }}
        onClick={onEnrichmentFormOpen}
        disabled={!dataAvailable}
      ></IconButton>

      <FormikModal
        initialFocusRef={refEnrichmentFormInitialFocus}
        isOpen={isEnrichmentFormOpen}
        onClose={onEnrichmentFormClose}
        size="xl"
        title="New Enrichment Analysis"
        scrollBehavior="outside"
      >
        <EnrichmentForm
          initialFocusRef={refEnrichmentFormInitialFocus}
          onCancel={onEnrichmentFormClose}
          onSubmit={onEnrichmentFormSubmit}
        />
      </FormikModal>

      <Modal
        isOpen={isEnrichmentDetailsOpen}
        onClose={onEnrichmentDetailsClose}
        size={modalSize}
      >
        <ModalOverlay />
        <ModalContent
          margin={modalSize === 'full' ? 0 : undefined}
          overflow="auto"
          rounded="none"
        >
          <ModalHeader color="orange.600">
            {
              enrichmentStore.getAnalysisById(refEnrichmentDetailsId.current)
                ?.options.title
            }
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <EnrichmentDetails id={refEnrichmentDetailsId.current} />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="orange"
              mr={3}
              onClick={onEnrichmentDetailsClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default observer(EnrichmentTool);
