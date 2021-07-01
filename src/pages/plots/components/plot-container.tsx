import React from 'react';
import { Flex, FlexProps, Spinner } from '@chakra-ui/react';
import { getSVGString } from '@/utils/svg';
import { PlotType } from '@/types/plots';
interface PlotContainerProps extends FlexProps {
  status: 'idle' | 'loading';
  figureRef?: React.MutableRefObject<HTMLDivElement | null>;
  plotType?: PlotType;
}

const PlotContainer: React.FC<PlotContainerProps> = ({
  status,
  figureRef,
  plotType,
  ...props
}) => {
  const handleDownloadSVG = (): void => {
    if (plotType === 'heatmap') {
      const svg = figureRef?.current?.getElementsByClassName('main-svg')[0];
      const svgString = svg ? getSVGString(svg) : '';
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      saveAs(blob, 'plot.svg');
    }
  };

  return (
    <>
      <button onClick={handleDownloadSVG}>DOWNLAOD</button>
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
    </>
  );
};

export default PlotContainer;
