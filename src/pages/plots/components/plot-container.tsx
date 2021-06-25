import React from 'react';
import { Flex, FlexProps, Spinner } from '@chakra-ui/react';

interface PlotContainerProps extends FlexProps {
  status: 'idle' | 'loading';
  figureRef?: React.MutableRefObject<HTMLDivElement | null>;
}

const PlotContainer: React.FC<PlotContainerProps> = ({
  status,
  figureRef,
  ...props
}) => {
  return (
    <Flex
      as="figure"
      alignItems="center"
      backgroundColor="white"
      boxShadow="sm"
      flexDirection="column"
      justifyContent="center"
      margin={3}
      overflow="hidden"
      height={800}
      padding={6}
      ref={(ref) => (figureRef ? (figureRef.current = ref) : ref)}
      resize="horizontal"
      sx={{
        '&::-webkit-resizer': {
          border: '1px',
          background: 'gray.400',
        },
      }}
      width="100%"
      {...props}
    >
      {status === 'idle' ? (
        props.children
      ) : (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      )}
    </Flex>
  );
};

export default PlotContainer;
