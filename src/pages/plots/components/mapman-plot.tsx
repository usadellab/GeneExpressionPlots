import React, { useRef, useLayoutEffect, useState } from 'react';
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
import { IconButton } from '@chakra-ui/button';
import { Flex, Text } from '@chakra-ui/layout';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

const gradient0 = '#f33d15';
const gradient1 = '#b4fbde';

const INITIALSIZE = 5;

type MapManPlotProps = GxpMapMan;

const MapManPlot: React.FC<MapManPlotProps> = (props) => {
  const ref = useRef(null);
  const svgRef = useRef(null);
  props.template;

  const [rectSize, setRectSize] = useState(5);

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
    console.log({ INITIALSIZE });
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
                  ? x + (xOffset % fnumber) * INITIALSIZE
                  : x + xOffset * INITIALSIZE;
              const yValue =
                bformat === 'y'
                  ? y + (yOffset % fnumber) * INITIALSIZE
                  : y + yOffset * INITIALSIZE;

              svgViz
                .append('rect')
                .attr('x', xValue)
                .attr('y', yValue)
                .attr('height', INITIALSIZE)
                .attr('width', INITIALSIZE)
                .attr('xOffset', xOffset % fnumber)
                .attr('yOffset', yOffset % fnumber)
                .style('stroke', 'lightgray')
                .style('fill', colorScale(parseFloat(rectValue as string)))
                .append('title')
                .text(
                  `Gene-ID: ${geneId}\nMapMan_BINCODE: ${bins[0].id}\n${props.valuesFrom}: ${rectValue}`
                );

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

  useLayoutEffect(() => {
    const rects = d3
      .select(svgRef.current)
      .select('#viz-layer')
      .selectAll('rect');

    rects.attr('x', function () {
      const x = parseInt(d3.select(this).attr('x'));
      const xOffset = parseInt(d3.select(this).attr('xOffset'));
      const sizeDiff = rectSize - parseInt(d3.select(this).attr('width'));
      return x + xOffset * sizeDiff;
    });
    rects.attr('y', function () {
      const y = parseInt(d3.select(this).attr('y'));
      const yOffset = parseInt(d3.select(this).attr('yOffset'));
      const sizeDiff = rectSize - parseInt(d3.select(this).attr('width'));
      return y + yOffset * sizeDiff;
    });
    rects.attr('height', rectSize).attr('width', rectSize);
  }, [rectSize]);

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
      <Flex
        justifyContent="center"
        height="100%"
        flexDirection="column"
        alignItems="center"
      >
        <svg ref={svgRef} />
        <Flex justifyContent="center" alignItems="center" gridGap={2}>
          <IconButton
            aria-label="increase rect size"
            isRound
            colorScheme="black"
            variant="outline"
            size="sm"
            icon={<AiOutlinePlus />}
            onClick={() => setRectSize(rectSize + 1)}
          ></IconButton>
          <Text>{`[ ${rectSize} ]`}</Text>
          <IconButton
            aria-label="decrease rect size"
            isRound
            colorScheme="black"
            variant="outline"
            size="sm"
            icon={<AiOutlineMinus />}
            onClick={() => setRectSize(rectSize - 1)}
          ></IconButton>
        </Flex>
        <Text>Adjust Size</Text>
      </Flex>
    </PlotContainer>
  );
};

export default MapManPlot;
