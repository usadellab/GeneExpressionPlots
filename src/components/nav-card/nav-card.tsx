import { motion } from 'framer-motion';
import React from 'react';
import { IconType } from 'react-icons';
import { FaArrowRight } from 'react-icons/fa';
import { Box, BoxProps, Flex, FlexProps, Icon, Text } from '@chakra-ui/react';
import SiteLink, { SiteLinkProps } from '@/components/site-link';

interface NavCardProps extends SiteLinkProps {
  label: string;
  text: string;
  icon?: IconType;
}

const MotionFlex = motion<FlexProps>(Flex);
const MotionBox = motion<BoxProps>(Box);

const NavCard: React.FC<NavCardProps> = ({ label, text, icon, ...props }) => {
  return (
    <SiteLink
      {...props}
      _focus={{
        outline: 'none',
        borderLeftColor: 'orange.600',
        ...props._focus,
      }}
      _hover={{
        borderLeftColor: 'orange.600',
        boxShadow: 'md',
        textDecoration: 'none',
        ...props._hover,
      }}
      backgroundColor="white"
      borderLeft="4px"
      borderLeftColor="transparent"
      boxShadow="xs"
      display="flex"
      padding={5}
      tabIndex={0}
      width="100%"
    >
      {icon && (
        <Icon
          as={icon}
          color="gray.600"
          height="1.5rem"
          marginTop="2"
          marginRight="1rem"
          width="1.5rem"
        />
      )}

      <MotionFlex as="section" alignItems="center" whileHover="hover">
        <Box>
          <Text as="h1" fontSize="xl" fontWeight="semibold">
            {label}
          </Text>
          <Text marginTop="1.5">{text}</Text>
        </Box>

        <MotionBox
          marginX="1rem"
          variants={{
            hover: {
              x: [0, 10],
              transition: {
                duration: 0.8,
                repeat: Infinity,
                repeatType: 'mirror',
              },
            },
          }}
        >
          <Icon
            as={FaArrowRight}
            color="orange.600"
            height="1.5rem"
            width="1.5rem"
          />
        </MotionBox>
      </MotionFlex>
    </SiteLink>
  );
};

export default NavCard;
