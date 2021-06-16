import React from 'react';
import {
  Modal,
  ModalProps,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';
import XTableForm, { XTableFormSubmitHandler } from './xtable-form';

import { dataTable } from '@/store/data-store';
import { plotStore } from '@/store/plot-store';
import { settings } from '@/store/settings';

import { readTable } from '@/utils/parser';
import { unescapeDelimiters } from '@/utils/string';

interface XTableModalProps extends Omit<ModalProps, 'children'> {
  finalFocusRef?: React.RefObject<FocusableElement>;
  isOpen: boolean;
  onClose: () => void;
}

const ModalXTable: React.FC<XTableModalProps> = (props) => {
  const initialRef = React.useRef<FocusableElement | null>(null);
  const modalSize = useBreakpointValue({ base: 'full', md: 'md' });

  const xTableFormSubmit: XTableFormSubmitHandler = (values, actions) => {
    plotStore.loadCountUnit(values.countUnit);

    settings.loadgxpSettings({
      unit: values.countUnit,
      expression_field_sep: values.columnSep,
      expression_header_sep: values.headerSep,
    });

    const file = values.file;

    if (file) {
      try {
        const reader = new FileReader();

        reader.onload = () => {
          // Parse the input file as a table
          const table = readTable(reader.result as string, {
            fieldSeparator: unescapeDelimiters(values.columnSep),
            rowNameColumn: 0,
          });

          // Load the store from the parsed table
          dataTable.loadFromObject(table, {
            multiHeader: values.headerSep,
          });

          // set default group and sample order in the settings
          settings.setGroupOrder(dataTable.groupsAsArray);
          settings.setSampleOrder(dataTable.samplesAsArray);
        };

        reader.onloadend = () => {
          actions.setSubmitting(false);
          props.onClose();
        };

        reader.onerror = () => {
          console.error('There was an error while reading the file');
          props.onClose();
        };

        reader.readAsText(file);
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={props.finalFocusRef}
      isOpen={props.isOpen}
      onClose={props.onClose}
      scrollBehavior="inside"
      size={modalSize}
    >
      <ModalOverlay />
      <ModalContent margin={modalSize === 'full' ? 0 : undefined}>
        <ModalHeader>Load Expression Table</ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={0}>
          <XTableForm
            initialRef={initialRef}
            onCancel={props.onClose}
            onSubmit={xTableFormSubmit}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalXTable;

{
  /* <Formik
            initialValues={{
              countUnit: 'Raw',
              headerSep: '*',
              columnSep: '\t',
            }}
            onSubmit={(values, actions) => {
              console.log({ values, actions });
              setTimeout(() => {
                actions.setSubmitting(false);
              }, 2000);
            }}
          >
            {(formProps) => (
              <Form id="load-xtable">
                <FormikField
                  name="countUnit"
                  label="Count Unit"
                  initialRef={initialRef}
                />
                <FormikField
                  name="headerSep"
                  label="Header Separator"
                  validate={validateSeparator}
                />
                <FormikField
                  name="columnSep"
                  label="Column Separator"
                  validate={validateSeparator}
                />
                <ModalFooter paddingTop={9} paddingRight={0}>
                  <Button onClick={props.onClose} variant="ghost">
                    Cancel
                  </Button>
                  <Button
                    colorScheme="orange"
                    isLoading={formProps.isSubmitting}
                    marginLeft=".5rem"
                    type="submit"
                    variant="solid"
                  >
                    Load
                  </Button>
                </ModalFooter>
              </Form>
            )} */
}
{
  /* <FormControl>
            <FormLabel>Count Unit</FormLabel>
            <Input
              ref={(ref) => (initialRef.current = ref)}
              list="count-units"
            />
            <datalist id="count-units">
              <option value="Raw" />
              <option value="TPM" />
              <option value="FPKM" />
              <option value="RPKM" />
              <option value="RPM" />
              <option value="CPM" />
              <option value="TMM" />
              <option value="DESeq" />
              <option value="GeTMM" />
              <option value="SCnorm" />
              <option value="ComBat-Seq" />
            </datalist>
          </FormControl>

          <FormControl>
            <FormLabel>Header Separator</FormLabel>
            <Input defaultValue="*" />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Column Separator</FormLabel>
            <Input defaultValue="\t" list="column-seps" />
            <datalist id="column-seps">
              <option value="\t">tab-separated</option>
              <option value=",">comma-separated</option>
            </datalist>
          </FormControl>
          */
}
