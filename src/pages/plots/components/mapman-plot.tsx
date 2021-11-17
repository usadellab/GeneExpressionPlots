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

  const [plotStatus, setPlotStatus] = useState<'loading' | 'idle'>('loading');

  const [stats, setStats] = useState({
    minValue: 0,
    quartile1: 0,
    median: 0,
    mean: 0,
    quartile3: 0,
    maxValue: 0,
  });

  console.log({ stats });

  useLayoutEffect(() => {
    const valuesAsArray: number[] = [];

    const rectValues =
      props.valuesFrom === 'expressionValue' && group && sample
        ? dataTable.getMapManMeanValues(group, sample)
        : infoTable.getColumn(props.valuesFrom);

    let svgWidth = '1024';
    let svgHeight = '800';

    parseXmlData(`mapman-templates/${props.template}.svg`).then((xmlDoc) => {
      svgWidth =
        xmlDoc.firstElementChild?.attributes.getNamedItem('width')?.nodeValue ??
        svgWidth;
      svgHeight =
        xmlDoc.firstElementChild?.attributes.getNamedItem('height')
          ?.nodeValue ?? svgHeight;
    });

    d3.xml(`mapman-templates/${props.template}.svg`).then((data) => {
      const svg = d3
        .select(svgRef.current)
        .attr('width', '90%')
        .attr('height', '100%')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
        .classed('main-svg', true);
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
              const rectValue = parseFloat(rectValues[geneId] as string);
              valuesAsArray.push(rectValue);

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
                .attr('xOffset', bformat === 'x' ? xOffset % fnumber : xOffset)
                .attr('yOffset', bformat === 'y' ? yOffset % fnumber : yOffset)
                .attr('value', rectValue)
                .style('stroke', 'lightgray')
                .style('stroke-width', INITIALSIZE * 0.1)
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

          const minValue = d3.min(valuesAsArray) ?? 0;
          const quartile1 = d3.quantile(valuesAsArray, 0.25) ?? 0;
          const median = d3.median(valuesAsArray) ?? 0;
          const mean = d3.mean(valuesAsArray) ?? 0;
          const quartile3 = d3.quantile(valuesAsArray, 0.75) ?? 0;
          const maxValue = d3.max(valuesAsArray) ?? 0;

          setStats({
            minValue,
            quartile1,
            median,
            mean,
            quartile3,
            maxValue,
          });
          console.log({
            minValue,
            quartile1,
            median,
            mean,
            quartile3,
            maxValue,
          });

          let colorX = 0;
          let colorY = 0;
          switch (props.colorScale) {
            case 'diverging_-xx':
              colorX = -(props.colorScaleValueX as number);
              colorY = props.colorScaleValueX as number;
              break;
            case 'continuous_0q3':
              colorX = 0;
              colorY = quartile3;
              break;
            case 'continuous_q1q3':
              colorX = quartile1;
              colorY = quartile3;
              break;
            case 'continuous_xy':
              colorX = props.colorScaleValueX as number;
              colorY = props.colorScaleValueY as number;
              break;
            default:
              break;
          }

          const colorScaleValues = [colorX, colorY];
          console.log({ colorX, colorY, colorScale: props.colorScale });

          const colorScale =
            props.colorScale === 'diverging_-xx'
              ? scaleSequential(colorScaleValues.reverse(), interpolateRdBu)
              : scaleLinear<string>({
                  range: [gradient1, gradient0],
                  domain: colorScaleValues,
                });

          const rects = d3
            .select(svgRef.current)
            .select('#viz-layer')
            .selectAll('rect');
          rects.style('fill', function () {
            const value = parseFloat(d3.select(this).attr('value'));
            return colorScale(value);
          });
          setPlotStatus('idle');
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
        <svg ref={svgRef} />
        <Flex
          marginTop="2rem"
          flexDirection="row"
          justifyContent="space-around"
          width="full"
        >
          <Table variant="simple" size="sm" width="25rem">
            <TableCaption>{`Distribution of ${props.valuesFrom}`}</TableCaption>
            <Thead>
              <Th isNumeric>Min</Th>
              <Th isNumeric>Q1</Th>
              <Th isNumeric>Median</Th>
              <Th isNumeric>Mean</Th>
              <Th isNumeric>Q3</Th>
              <Th isNumeric>Max</Th>
            </Thead>
            <Tbody>
              <Tr>
                <Td isNumeric>{stats.minValue.toFixed(2)}</Td>
                <Td isNumeric>{stats.quartile1.toFixed(2)}</Td>
                <Td isNumeric>{stats.median.toFixed(2)}</Td>
                <Td isNumeric>{stats.mean.toFixed(2)}</Td>
                <Td isNumeric>{stats.quartile3.toFixed(2)}</Td>
                <Td isNumeric>{stats.maxValue.toFixed(2)}</Td>
              </Tr>
            </Tbody>
          </Table>

          <Flex flexDirection="column">
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
                onClick={() => setRectSize(Math.max(1, rectSize - 1))}
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
