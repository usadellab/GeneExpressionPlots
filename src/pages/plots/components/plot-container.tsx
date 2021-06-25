import React from 'react';
import { Flex, FlexProps, Spinner } from '@chakra-ui/react';

interface PlotContainerProps extends FlexProps {
  status: 'idle' | 'loading';
  figureRef?: React.MutableRefObject<HTMLDivElement | null>;
  title?: string;
}

const PlotContainer: React.FC<PlotContainerProps> = ({
  status,
  figureRef,
  title,
  ...props
}) => {
  return (
    <Flex
      as="figure"
      alignItems="center"
      backgroundColor="white"
      boxShadow="lg"
      justifyContent="center"
      margin={3}
      overflow="hidden"
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
      {title && <h1>{title}</h1>}
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
