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
import XTableForm from './xtable-form';

interface XTableModalProps extends Omit<ModalProps, 'children'> {
  finalFocusRef?: React.RefObject<FocusableElement>;
  isOpen: boolean;
  onClose: () => void;
}

const ModalXTable: React.FC<XTableModalProps> = (props) => {
  const initialRef = React.useRef<FocusableElement | null>(null);
  const modalSize = useBreakpointValue({ base: 'full', md: 'md' });

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
            onSubmit={(values, actions) => {
              console.log({ values, actions });
              setTimeout(() => {
                actions.setSubmitting(false);
              }, 2000);
            }}
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
