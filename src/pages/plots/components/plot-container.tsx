import React from 'react';
import { Flex, FlexProps, Spinner } from '@chakra-ui/react';
import * as d3 from 'd3';
import { getSVGString, svgString2Image } from '@/utils/download';
interface PlotContainerProps extends FlexProps {
  status: 'idle' | 'loading';
  figureRef?: React.MutableRefObject<HTMLDivElement | null>;
}

const PlotContainer: React.FC<PlotContainerProps> = ({
  status,
  figureRef,
  ...props
}) => {
  const handleDownloadSVG = () => {
    // const svg = d3.select('#heatmap');
    const svg = figureRef?.current?.getElementsByClassName('main-svg')[1];
    // console.log({ node: svg.node() });
    // console.log({ svg });
    // const svgString = getSVGString(svg.node());
    const svgString = getSVGString(svg);
    // console.log({ svgString });
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    saveAs(blob, 'test.svg');

    // svgString2Image(svgString, 600, 600, 'png', save);
    // function save(dataBlob, filesize) {
    //   saveAs(dataBlob, 'D3 vis exported to PNG.png'); // FileSaver.js function
    // }
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
