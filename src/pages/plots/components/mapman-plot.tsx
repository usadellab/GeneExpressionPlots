import React, { useRef, useLayoutEffect } from 'react';
import * as d3 from 'd3';

import PlotContainer from './plot-container';
import { GxpMapMan } from '@/types/plots';

interface DataPoint {
  x: number;
  y: number;
  offset: number;
  format: string;
  formatnumber: number;
}

const MapManPlot: React.FC<GxpMapMan> = (props) => {
  const ref = useRef(null);
  props.template;

  useLayoutEffect(() => {
    const binCoords: { [key: string]: DataPoint } = {};
    const svg = d3.select(ref.current);

    d3.xml(`mapman-templates/${props.template}`).then((data) => {
      console.log({ data });
      svg.node()?.append(data.documentElement);
    });

    d3.xml('mapman-templates/X4.3_Metabolism_overview_R3.0.xml').then(
      (data) => {
        console.log({ data });

        [].map.call(data.querySelectorAll('DataArea'), (dataArea: any) => {
          const id: string =
            dataArea.firstElementChild.attributes.getNamedItem('id').value;
          const { x: xPoint, y: yPoint } = dataArea.attributes;
          binCoords[id] = {
            x: xPoint.value,
            y: yPoint.value,
            offset: 0,
            format: 'x',
            formatnumber: 5,
          };
        });
        console.log({ binCoords });
      }
    );
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
