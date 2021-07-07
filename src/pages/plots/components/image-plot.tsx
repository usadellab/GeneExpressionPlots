import React from 'react';
import { Image, ImageProps } from '@chakra-ui/react';
import PlotContainer from './plot-container';
import { GxpImage } from '@/types/plots';

type ImagePlotProps = Pick<GxpImage, 'alt' | 'id' | 'src'> & ImageProps;

const ImagePlot: React.FC<ImagePlotProps> = ({ alt, src, id, ...props }) => {
  return (
    <PlotContainer aria-label={alt} id={id} plotType="image" status="idle">
      <Image
        alt={alt}
        backgroundColor="white"
        objectFit="scale-down"
        src={src}
        width="100%"
        {...props}
      />
    </PlotContainer>
  );
};

export default ImagePlot;
