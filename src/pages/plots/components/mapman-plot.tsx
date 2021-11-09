import React, { useRef, useLayoutEffect } from 'react';
import * as d3 from 'd3';

import PlotContainer from './plot-container';
import { GxpMapMan } from '@/types/plots';
import { dataTable, infoTable } from '@/store/data-store';
import {
  getBlockformat,
  getCoordinates,
  getMapManBins,
  parseXmlData,
} from '@/utils/plots/mapman-xml-domparser';

import { interpolateRdBu } from 'd3-scale-chromatic';
import { scaleSequential } from 'd3-scale';
import { scaleLinear } from '@visx/scale';

const gradient0 = '#f33d15';
const gradient1 = '#b4fbde';

const SIZE = 5;

type MapManPlotProps = GxpMapMan;

const MapManPlot: React.FC<MapManPlotProps> = (props) => {
  const ref = useRef(null);
  const svgRef = useRef(null);
  props.template;

  const [group, sample] = props.sample
    ? props.sample.split(dataTable.config.multiHeader)
    : [undefined, undefined];

  const rectValues =
    props.valuesFrom === 'expressionValue' && group && sample
      ? dataTable.getMapManMeanValues(group, sample)
      : infoTable.getColumn(props.valuesFrom);

  const maxValue = d3.max(Object.values(rectValues));
  const minValue = d3.min(Object.values(rectValues));

  const colorScale =
    props.colorScale === 'sequential'
      ? scaleSequential([-1, 1], interpolateRdBu)
      : scaleLinear<string>({
          range: [gradient1, gradient0],
          domain: [minValue, maxValue],
        });

  useLayoutEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 1024 800')
      .classed('main-svg', true);

    d3.xml(`mapman-templates/${props.template}.svg`).then((data) => {
      (svg.node() as any).append(data.documentElement);

      parseXmlData(`mapman-templates/${props.template}.xml`).then(
        (xmlDocument) => {
          const svgViz = d3
            .select(svgRef.current)
            .append('g')
            .attr('id', 'viz-layer');

          const dataAreas = xmlDocument.querySelectorAll('DataArea');

          dataAreas.forEach((dataArea: Element) => {
            const { x, y } = getCoordinates(dataArea);
            const { bformat, fnumber } = getBlockformat(dataArea);
            const bins = getMapManBins(dataArea);

            const geneIds = infoTable.getGenesForMapManBin(
              props.infoTableColumn,
              props.infoTableColumnSep,
              bins[0].id,
              bins[0].recursive
            );

            let xOffset = 0;
            let yOffset = 0;

            geneIds.forEach((geneId) => {
              const rectValue = rectValues[geneId];

              const xValue =
                bformat === 'x'
                  ? x + (xOffset % fnumber) * SIZE
                  : x + xOffset * SIZE;
              const yValue =
                bformat === 'y'
                  ? y + (yOffset % fnumber) * SIZE
                  : y + yOffset * SIZE;

              svgViz
                .append('rect')
                .attr('x', xValue)
                .attr('y', yValue)
                .attr('height', SIZE)
                .attr('width', SIZE)
                .style('stroke', 'lightgray')
                .style('fill', colorScale(parseFloat(rectValue as string)))
                .append('title')
                .text(bins[0].id + ': ' + geneId + ' - ' + rectValue);

              bformat === 'x' ? xOffset++ : yOffset++;
              if (bformat === 'x' && xOffset != 0 && xOffset % fnumber === 0) {
                yOffset++;
              } else if (
                bformat === 'y' &&
                yOffset != 0 &&
                yOffset % fnumber === 0
              ) {
                xOffset++;
              }
            });
          });
        }
      );
    });
  }, []);
  return (
    <PlotContainer
      figureRef={ref}
      position="relative"
      height={800}
      plotType="heatmap"
      status="idle"
      id={props.id}
      overflow="auto"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <svg ref={svgRef} />
      </div>
    </PlotContainer>
  );
};

export default MapManPlot;
