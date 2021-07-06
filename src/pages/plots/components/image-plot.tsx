import React from 'react';
import { Flex, Image, ImageProps } from '@chakra-ui/react';

type ImagePlotProps = ImageProps;

const ImagePlot: React.FC<ImagePlotProps> = ({ alt, src, ...props }) => {
  return (
    <Flex
      boxShadow="sm"
      height={800}
      margin={3}
      overflow="hidden"
      resize="horizontal"
      // width="100%"
    >
      <Image
        alt={alt}
        backgroundColor="white"
        objectFit="contain"
        src={src}
        {...props}
      />
    </Flex>
  );
};

export default ImagePlot;
