import React, { useRef, useLayoutEffect } from 'react';
import * as d3 from 'd3';

import PlotContainer from './plot-container';
import { GxpMapMan } from '@/types/plots';

const MapManPlot: React.FC<GxpMapMan> = (props) => {
  const ref = useRef(null);
  props.template;

  useLayoutEffect(() => {
    const svg = d3.select(ref.current);
    // d3.xml(`mapman-template/${props.template}`)
    // d3.xml('mapman-templates/X4.3_Amino_acid_metabolism_R3.0.svg').then(
    d3.xml(`mapman-templates/${props.template}`).then((data) => {
      console.log({ data });
      svg.node()?.append(data.documentElement);
    });
    // svg.append('circle').attr('cx', 150).attr('cy', 70).attr('r', 50);
  }, []);
  return (
    <PlotContainer
      justifyContent="center"
      figureRef={ref}
      position="relative"
      height={1200}
      plotType="heatmap"
      status="idle"
      id={props.id}
    >
      <svg ref={ref} />
    </PlotContainer>
  );
};

export default MapManPlot;
