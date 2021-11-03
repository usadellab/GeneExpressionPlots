import React, { useRef, useLayoutEffect, useState } from 'react';
import * as d3 from 'd3';

import PlotContainer from './plot-container';
import { GxpMapMan } from '@/types/plots';
import { dataTable, infoTable } from '@/store/data-store';
import {
  getCoordinates,
  getMapManBins,
  getXmlBins,
  getXmlRecursive,
  getXml_x_yCords,
  parseXmlData,
} from '@/utils/plots/mapman-xml-domparser';
import { BiAlignMiddle } from 'react-icons/bi';
import { removeObserver } from 'mobx/dist/internal';
import { readFile } from '@/utils/parser';

import { interpolateRdBu } from 'd3-scale-chromatic';
import { scaleSequential } from 'd3-scale';

// import { getDataAreaXml } from '@/utils/plots/mapman-xml-domparser';

// interface dataArea {
//   x: number;
//   y: number;
//   identifiers: identifier[];
// }
const SIZE = 5;

interface identifier {
  id: string;
  recursive: boolean;
}

const colorScale = scaleSequential([-1, 1], interpolateRdBu);

const MapManPlot: React.FC<GxpMapMan> = (props) => {
  const ref = useRef(null);
  const svgRef = useRef(null);
  props.template;
  console.log(
    infoTable.getGenesForMapManBin('MapMan-Bins', ',', '1.3.4', true)
  );

  const [xmlDocument, setxmlDocument] = useState<Document>();
  useLayoutEffect(() => {
    const svgMaster = d3.select(ref.current);
    console.log({ svgMaster });
    const svg = d3
      .select(svgRef.current)
      .attr('width', '1024')
      .attr('height', '800');

    d3.xml(`mapman-templates/${props.template}`).then((data) => {
      // console.log({ data });
      svg.node()?.append(data.documentElement);

      parseXmlData('mapman-templates/X4.3_Metabolism_overview_R3.0.xml').then(
        (xmlDocument) => {
          const svgViz = d3
            .select(svgRef.current)
            .append('g')
            .attr('id', 'Viz layer');
          const bins = xmlDocument.getElementsByTagName('Identifier');
          // console.log({ xmlDocument, bins });

          const dataAreas = xmlDocument.querySelectorAll('DataArea');
          // console.log({ dataAreas });

          dataAreas.forEach((dataArea) => {
            // console.log(dataArea.getElementsByTagName('Identifier'));
            const { x, y } = getCoordinates(dataArea);
            const bins = getMapManBins(dataArea);
            // console.log({ x, y, bins });

            const geneIds = infoTable.getGenesForMapManBin(
              'MapMan-Bins',
              ',',
              bins[0].id,
              bins[0].recursive
            );

            let xOffset = 0;
            let yOffset = 0;

            geneIds.forEach((geneId) => {
              const rectValue = infoTable.getColumnValue(
                geneId,
                'log-fold change'
              );

              console.log({ rectValue });
              // console.log(colorScale(rectValue));

              svgViz
                .append('rect')
                .attr('x', x + (xOffset % 5) * SIZE)
                .attr('y', y + yOffset * SIZE)
                .attr('height', SIZE)
                .attr('width', SIZE)
                .style('stroke', 'lightgray')
                .style('fill', colorScale(parseFloat(rectValue)))
                .append('title')
                .text(bins[0].id + ': ' + geneId + ' - ' + rectValue);

              xOffset++;
              if (xOffset != 0 && xOffset % 5 === 0) {
                yOffset++;
              }
            });
          });
        }
      );
    });
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
      <svg ref={svgRef} />
    </PlotContainer>
  );
};

export default MapManPlot;
