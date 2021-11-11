import React from 'react';
import { FaDownload, FaTrashAlt } from 'react-icons/fa';
import { Box, Flex, FlexProps, IconButton, Spinner } from '@chakra-ui/react';
import { getSVGString } from '@/utils/svg';
import { PlotType } from '@/types/plots';
import { plotStore } from '@/store/plot-store';

interface PlotContainerProps extends FlexProps {
  status: 'idle' | 'loading';
  figureRef?: React.MutableRefObject<HTMLDivElement | null>;
  plotType?: PlotType;
  id: string;
}

const PlotContainer: React.FC<PlotContainerProps> = ({
  status,
  figureRef,
  plotType,
  ...props
}) => {
  const handleDownloadSVG: React.MouseEventHandler<HTMLButtonElement> = () => {
    const svg = figureRef?.current?.getElementsByClassName('main-svg')[0];
    const svgString = svg ? getSVGString(svg) : '';
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    saveAs(blob, 'plot.svg');
  };

  const handleDeletePlot: React.MouseEventHandler<HTMLButtonElement> = () => {
    plotStore.deletePlot(props.id);
  };

  return (
    <Flex
      _focus={{
        outline: 'none',
        border: '1px solid',
        borderColor: 'orange.600',
      }}
      as="figure"
      alignItems="center"
      backgroundColor="white"
      border="1px solid"
      borderColor="transparent"
      boxShadow="sm"
      flexDirection="column"
      justifyContent="center"
      margin={3}
      overflow="hidden"
      height={800}
      padding={6}
      position="relative"
      ref={(ref) => (figureRef ? (figureRef.current = ref) : ref)}
      resize="horizontal"
      role="group"
      // sx={{
      //   '&::-webkit-resizer': {
      //     border: '1px',
      //     background: 'gray.400',
      //   },
      // }}
      tabIndex={0}
      width="100%"
      {...props}
    >
      {status === 'idle' ? (
        <>
          {(plotType === 'heatmap' || plotType === 'image') && (
            <Box
              _focusWithin={{
                '& button': {
                  visibility: 'visible',
                },
              }}
              aria-label="Plot actions"
              as="section"
              left={5}
              position="absolute"
              top={5}
            >
              {plotType === 'heatmap' && (
                <IconButton
                  _focus={{
                    border: '1px solid',
                    borderColor: 'orange.600',
                    color: 'orange.600',
                    outline: 'none',
                    visibility: 'visible',
                  }}
                  _groupFocus={{
                    visibility: 'visible',
                  }}
                  _groupHover={{
                    visibility: 'visible',
                  }}
                  _hover={{
                    color: 'orange.600',
                  }}
                  aria-label="Download plot"
                  color="gray.600"
                  icon={<FaDownload />}
                  variant="outline"
                  size="lg"
                  onClick={handleDownloadSVG}
                  visibility="hidden"
                  zIndex="modal"
                />
              )}

              <IconButton
                _focus={{
                  border: '1px solid',
                  borderColor: 'orange.600',
                  color: 'orange.600',
                  outline: 'none',
                  visibility: 'visible',
                }}
                _groupFocus={{
                  visibility: 'visible',
                }}
                _groupHover={{
                  visibility: 'visible',
                }}
                _hover={{
                  color: 'orange.600',
                }}
                aria-label="Delete plot"
                color="gray.600"
                icon={<FaTrashAlt />}
                marginLeft={2}
                size="lg"
                variant="outline"
                onClick={handleDeletePlot}
                visibility="hidden"
                zIndex="overlay"
              />
            </Box>
          )}
          {props.children}
        </>
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
