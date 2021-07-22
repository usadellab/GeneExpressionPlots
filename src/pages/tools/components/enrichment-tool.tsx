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

import { motion } from 'framer-motion';
import { observer } from 'mobx-react';

import { FaPlus } from 'react-icons/fa';

import { infoTable } from '@/store/data-store';
import { enrichmentStore } from '@/store/enrichment-store';
import {
  EnrichmentAnalysis,
  EnrichmentAnalysisOptions,
} from '@/types/enrichment';

import EnrichmentDetails from './enrichment-details';
import EnrichmentForm, { EnrichmentFormSubmitHandler } from './enrichment-form';
import FormikModal from '@/components/formik-modal';

const CardRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
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

  const [pageLoading, setPageLoading] = React.useState(false);
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
    // setTimeout(() => enrichmentStore.addAnalysis(data), 10);
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

  // const handleAddbuttonClick = (): void => {
  //   enrichmentStore.addAnalysis(data);
  // };

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
      ) : pageLoading ? (
        <Flex
          width="100%"
          flexGrow={1}
          justifyContent="center"
          alignItems="center"
        >
          <Spinner size="xl" />
        </Flex>
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
            boxShadow="xs"
            display="flex"
            padding={5}
            tabIndex={0}
            width="100%"
            alignItems="center"
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
            <Box width="100%">
              <Text
                as="h1"
                fontSize="xl"
                fontWeight="semibold"
                marginBottom={2}
                textColor="orange.600"
              >
                {analysis.title}
              </Text>
              <CardRow
                label="Enrichment type"
                value={analysis.TEIselectorType}
              />
              <CardRow
                label="Tested Enrichment for"
                value={analysis.TEFcolumn}
              />
              <CardRow
                label="Selector"
                value={`"${analysis.TEFselector}" : "${analysis.TEFselectorValue}"`}
              />
              <CardRow
                label="Tested Enrichment in"
                value={analysis.TEIcolumn}
              />
              <CardRow
                label="Selector"
                value={`"${analysis.TEIselector}" : "${analysis.TEIselectorValue}"`}
              />
            </Box>
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
        // color="orange.400"
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
                ?.title
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
