import React, { useRef, useLayoutEffect, useState } from 'react';
import * as d3 from 'd3';

import PlotContainer from './plot-container';
import { GxpMapMan } from '@/types/plots';

import { interpolateRdBu } from 'd3-scale-chromatic';
import { scaleSequential } from 'd3-scale';
import { scaleLinear } from '@visx/scale';
import { IconButton } from '@chakra-ui/button';
import { Flex, Text } from '@chakra-ui/layout';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { Spinner } from '@chakra-ui/spinner';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
} from '@chakra-ui/react';
import ColorLegend from './color-legend';
import { nanoid } from 'nanoid';

const gradient0 = '#f33d15';
const gradient1 = '#b4fbde';

const INITIALSIZE = 5;

type MapManPlotProps = GxpMapMan;

const MapManPlot: React.FC<MapManPlotProps> = (props) => {
  const ref = useRef(null);
  const svgRef = useRef(null);

  const [rectSize, setRectSize] = useState(5);

  const [plotStatus, setPlotStatus] = useState<'loading' | 'idle'>('loading');

  // color
  let colorX = 0;
  let colorY = 0;
  switch (props.colorScale) {
    case 'diverging_-xx':
      colorX = -(props.colorScaleValueX as number);
      colorY = props.colorScaleValueX as number;
      break;
    case 'continuous_0q3':
      colorX = 0;
      colorY = props.stats.q3;
      break;
    case 'continuous_q1q3':
      colorX = props.stats.q1;
      colorY = props.stats.q3;
      break;
    case 'continuous_xy':
      colorX = props.colorScaleValueX as number;
      colorY = props.colorScaleValueY as number;
      break;
    default:
      break;
  }

  const colorScaleValues = [colorX, colorY];

  const colorScale =
    props.colorScale === 'diverging_-xx'
      ? scaleSequential(colorScaleValues.reverse(), interpolateRdBu)
      : scaleLinear<string>({
          range: [gradient1, gradient0],
          domain: colorScaleValues,
        });

  useLayoutEffect(() => {
    d3.xml(`mapman-templates/${props.template}.svg`).then((data) => {
      const viewBoxY = props.plotTitle ? props.height + 30 : props.height;

      const svg = d3
        .select(svgRef.current)
        .attr('width', '90%')
        .attr('height', '100%')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        // add space (20) for title
        .attr(
          'viewBox',
          `0 ${props.plotTitle ? -30 : 0} ${props.width + 100} ${viewBoxY}`
        )
        .classed('main-svg', true);
      (svg.node() as any).append(data.documentElement);
      const svgViz = d3
        .select(svgRef.current)
        .append('g')
        .attr('id', 'viz-layer');

      // Title
      svg
        .append('text')
        .attr('x', props.width / 2)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .style('font-size', props.height / 25)
        .text(`${props.plotTitle}`);

      const rects = svgViz
        .selectAll('rect')
        .data(props.rects)
        .enter()
        .append('rect');

      rects
        .attr('x', ({ x }) => x)
        .attr('y', ({ y }) => y)
        .attr('height', INITIALSIZE)
        .attr('width', INITIALSIZE)
        .attr('xOffset', ({ xOffset }) => xOffset)
        .attr('yOffset', ({ yOffset }) => yOffset)
        .attr('value', ({ value }) => value)
        .style('stroke', 'lightgray')
        .style('stroke-width', INITIALSIZE * 0.1)
        .style('fill', ({ value }) => colorScale(value))
        .append('title')
        .text(
          ({ geneId, bin, value }) =>
            `Gene-ID: ${geneId}\nMapMan_BINCODE: ${bin}\n${props.valuesFrom}: ${value}`
        );
      setPlotStatus('idle');
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
    rects.style('stroke-width', function () {
      return rectSize * 0.1;
    });

    rects.attr('height', rectSize).attr('width', rectSize);
  }, [rectSize]);

  return (
    <PlotContainer
      figureRef={ref}
      position="relative"
      height={800}
      plotType="heatmap"
      status={'idle'}
      id={props.id}
      overflow="auto"
    >
      <Flex
        justifyContent="center"
        height="100%"
        flexDirection="column"
        alignItems="center"
      >
        {plotStatus === 'loading' && (
          <Spinner
            position="absolute"
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          ></Spinner>
        )}
        <svg ref={svgRef}>
          <ColorLegend
            colorScale={colorScale}
            id={nanoid()}
            minVal={colorX}
            maxVal={colorY}
            width={20}
            height={250}
            x={props.width + 50}
            y={10}
            label={props.valuesFrom}
            labelOffset={-40}
            reverse={props.colorScale === 'diverging_-xx'}
          />
        </svg>
        <Flex
          marginTop="2rem"
          marginRight="8rem"
          flexDirection="row"
          justifyContent="space-around"
          width="full"
        >
          <Table variant="simple" size="sm" width="25rem">
            <TableCaption>{`Distribution of ${props.valuesFrom}`}</TableCaption>
            <Thead>
              <Tr>
                <Th isNumeric>Min</Th>
                <Th isNumeric>Q1</Th>
                <Th isNumeric>Median</Th>
                <Th isNumeric>Mean</Th>
                <Th isNumeric>Q3</Th>
                <Th isNumeric>Max</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td isNumeric>{props.stats.min.toFixed(2)}</Td>
                <Td isNumeric>{props.stats.q1.toFixed(2)}</Td>
                <Td isNumeric>{props.stats.median.toFixed(2)}</Td>
                <Td isNumeric>{props.stats.mean.toFixed(2)}</Td>
                <Td isNumeric>{props.stats.q3.toFixed(2)}</Td>
                <Td isNumeric>{props.stats.max.toFixed(2)}</Td>
              </Tr>
            </Tbody>
          </Table>

          <Flex flexDirection="column">
            <Flex justifyContent="center" alignItems="center" gridGap={2}>
              <IconButton
                aria-label="decrease rect size"
                isRound
                colorScheme="black"
                variant="outline"
                size="sm"
                icon={<AiOutlineMinus />}
                onClick={() => setRectSize(Math.max(1, rectSize - 1))}
              ></IconButton>
              <Text>{`[ ${rectSize} ]`}</Text>
              <IconButton
                aria-label="increase rect size"
                isRound
                colorScheme="black"
                variant="outline"
                size="sm"
                icon={<AiOutlinePlus />}
                onClick={() => setRectSize(rectSize + 1)}
              ></IconButton>
            </Flex>
            <Text>Adjust Box Size</Text>
          </Flex>
        </Flex>
      </Flex>
    </PlotContainer>
  );
};

export default MapManPlot;
