import React from 'react';
import {
  Box,
  BoxProps,
  Flex,
  FlexProps,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion<FlexProps>(Flex);

export interface SidebarProps extends BoxProps {
  /** @type add a top border accent to the topbar */
  accent?: boolean;
}

const SidebarNav: React.FC<React.PropsWithChildren<SidebarProps>> = (props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <MotionBox
      as="header"
      backgroundColor="white"
      // Animation props
      initial={{ x: -20 }}
      animate={{ x: 0 }}
      exit={{ x: -20 }}
    >
      <Box role="region" aria-label="Sidebar actions" boxShadow="xl" {...props}>
        <Stack
          _focusWithin={{
            width: props.maxWidth ?? '15rem',
          }}
          as="section"
          onMouseEnter={onOpen}
          onMouseLeave={onClose}
          overflowX="hidden"
          paddingY="1rem"
          position="sticky"
          transitionProperty="width"
          transitionDuration="0.2s"
          transitionTimingFunction="linear forwards"
          width={isOpen ? props.maxWidth ?? '15rem' : '4.5rem'}
        >
          {props.children}
        </Stack>
      </Box>
    </MotionBox>
  );
};

export default SidebarNav;
