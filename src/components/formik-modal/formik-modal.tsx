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

interface FormikModalProps extends Omit<ModalProps, 'children'> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const FormikModal: React.FC<FormikModalProps> = (props) => {
  const modalSize = useBreakpointValue({ base: 'full', md: 'md' });

  return (
    <Modal
      initialFocusRef={props.initialFocusRef}
      finalFocusRef={props.finalFocusRef}
      isOpen={props.isOpen}
      onClose={props.onClose}
      scrollBehavior="inside"
      size={modalSize}
    >
      <ModalOverlay />
      <ModalContent margin={modalSize === 'full' ? 0 : undefined}>
        <ModalHeader>{props.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={0}>{props.children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FormikModal;
