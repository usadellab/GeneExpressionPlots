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
      backgroundColor="white"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      // Animation props
      initial={{ x: -20 }}
      animate={{ x: 0 }}
      exit={{ x: -20 }}
    >
      <Box aria-label="Sidebar actions" boxShadow="xl" role="region" {...props}>
        <Stack
          _focusWithin={{
            width: props.maxWidth ?? '15rem',
          }}
          as="section"
          overflowX="hidden"
          paddingX={1}
          paddingY="1rem"
          position="sticky"
          top={0}
          transitionProperty="width"
          transitionDuration="0.2s"
          transitionTimingFunction="linear forwards"
          width={
            isOpen ? props.maxWidth ?? '15rem' : props.minWidth ?? '4.5rem'
          }
        >
          {props.children}
        </Stack>
      </Box>
    </MotionBox>
  );
};

export default SidebarNav;
