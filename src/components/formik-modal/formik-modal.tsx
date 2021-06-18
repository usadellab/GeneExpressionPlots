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

const FormikModal: React.FC<FormikModalProps> = ({ title, ...props }) => {
  const modalSize = useBreakpointValue({ base: 'full', md: 'md' });

  return (
    <Modal scrollBehavior="inside" size={modalSize} {...props}>
      <ModalOverlay />
      <ModalContent margin={modalSize === 'full' ? 0 : undefined}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={0}>{props.children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FormikModal;
