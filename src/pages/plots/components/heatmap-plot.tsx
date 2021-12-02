import React, { useMemo } from 'react';
import { Text as ChakraText } from '@chakra-ui/react';

import { ScaleLinear, ScaleBand, scaleSequential } from 'd3-scale';
import { interpolateRdBu } from 'd3-scale-chromatic';
import { AxisLeft } from '@visx/axis';
import { Group } from '@visx/group';
import { HeatmapRect } from '@visx/heatmap';
import { Cluster, hierarchy } from '@visx/hierarchy';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Text } from '@visx/text';
import { useTooltipInPortal, useTooltip } from '@visx/tooltip';
import { LinkVerticalStep } from '@visx/shape';

import PlotContainer from './plot-container';
import {
  HeatmapBins,
  HeatmapBin,
  GxpHeatmap,
  ClusterTree,
} from '@/types/plots';
import { RectCell } from '@visx/heatmap/lib/heatmaps/HeatmapRect';
import {
  HierarchyPointLink,
  HierarchyPointNode,
} from '@visx/hierarchy/lib/types';

import ColorLegend from '@/pages/plots/components/color-legend';

import { nanoid } from 'nanoid';

const gradient0 = '#b4fbde';
const gradient1 = '#f33d15';
// const gradient0 = '#77312f';
// const gradient1 = '#f33d15';
// const cool1 = '#122549';
// const cool2 = '#b4fbde';
export const background = '#28272c';

function max<Datum>(data: Datum[], value: (d: Datum) => number): number {
  return Math.max(...data.map(value));
}

function min<Datum>(data: Datum[], value: (d: Datum) => number): number {
  return Math.min(...data.map(value));
}

// accessors
const bins = (d: HeatmapBins): HeatmapBin[] => d.bins;
const count = (d: HeatmapBin): number => d.count;

type HeatmapPlotProps = GxpHeatmap;

const HeatmapPlot: React.FC<HeatmapPlotProps> = (props) => {
  // tooltip
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip<RectCell<HeatmapBins, HeatmapBin>>();
  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    // use TooltipWithBounds
    detectBounds: true,
    // when tooltip containers are scrolled, this will correctly update the Tooltip position
    scroll: true,
  });

  // color
  const colorMin = min(props.binData, (d) => min(bins(d), count));
  const colorMax = max(props.binData, (d) => max(bins(d), count));
  const colorScale =
    props.distanceMethod === 'correlation'
      ? scaleSequential([1, -1], interpolateRdBu)
      : scaleLinear<string>({
          range: [gradient0, gradient1],
          domain: [colorMin, colorMax],
        });

  // dimensions
  const figureRef = React.useRef<HTMLDivElement | null>(null);
  const timeoutRef = React.useRef<number>();
  const [plotDims, setPlotDims] = React.useState<{
    binWidth: number;
    binHeight: number;
    xScalePlot: ScaleLinear<number, number>;
    yScalePlot: ScaleLinear<number, number>;
    yScaleAxis: ScaleBand<string>;
    xMax: number;
    yMax: number;
    xScaleAxis: ScaleBand<string>;
    titleHeight: number;
    tickLineSize: number;
    tickLabelSize: number;
    treeBoundsY: number;
    heatmapBoundsY: number;
  }>();

  const treeData = useMemo(
    () => hierarchy<ClusterTree>(props.tree),
    [props.tree]
  );

  React.useEffect(
    function resizePlot() {
      let timeoutId: number;
      const internalRef = figureRef.current;

      const resizeObserver = new ResizeObserver((entries) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        setPlotDims(undefined);
        timeoutId = window.setTimeout(() => {
          const figureStyle = window.getComputedStyle(entries[0].target, null);

          const clientPaddingTop = parseFloat(
            figureStyle.getPropertyValue('padding-top')
          );
          const clientPaddingBottom = parseFloat(
            figureStyle.getPropertyValue('padding-bottom')
          );
          const clientPaddingLeft = parseFloat(
            figureStyle.getPropertyValue('padding-left')
          );
          const clientPaddingRight = parseFloat(
            figureStyle.getPropertyValue('padding-right')
          );
          const clientPaddingX = clientPaddingRight + clientPaddingLeft;
          const clientPaddingY = clientPaddingTop + clientPaddingBottom;

          // title
          const titleHeight = props.plotTitle ? 30 : 0;

          // ticks
          const tickLineSize = 20; // 10 for tick + 10 for marginLeft to plot

          // This is a approximate workaround for calculating the size needed for the labels.
          // Optimally we would get the actual width of the text in pixels using e.g
          // https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/dimension/getTextDimension.ts
          const tickLabelSize =
            Math.max(
              ...props.binData.map((data) => data.bin.length) // get the length of the longest label
            ) *
              6 + // multiply by a sensible amount to get a cross browser consisten value in pixels
            5; // add a min margin

          // plot
          const plotBoundsX =
            entries[0].target.clientWidth -
            clientPaddingX -
            tickLineSize -
            (tickLabelSize ?? 0);

          const plotBoundsY =
            entries[0].target.clientHeight -
            clientPaddingY -
            (tickLabelSize ?? 0) -
            titleHeight * 2;

          const treeBoundsY = plotBoundsY / 6;
          const heatmapBoundsY = plotBoundsY - treeBoundsY;

          const dataLen = props.binData.length;
          const binWidth = plotBoundsX / dataLen;
          const binHeight = heatmapBoundsY / dataLen;

          const xScalePlot = scaleLinear<number>({
            domain: [0, props.binData.length],
            range: [0, plotBoundsX],
          });

          const yScalePlot = scaleLinear<number>({
            // domain: [0, max(props.binData, (d) => bins(d).length)],
            domain: [0, props.binData.length],
            range: [0, heatmapBoundsY],
          });

          const xScaleAxis = scaleBand<string>({
            domain: props.binData.map((data) => data.bin),
            range: [0, plotBoundsX],
          });

          const yScaleAxis = scaleBand<string>({
            domain: props.binData[0].bins.map((data) => data.bin),
            range: [0, heatmapBoundsY],
          });

          setPlotDims({
            binWidth,
            binHeight,
            tickLineSize,
            titleHeight,
            tickLabelSize,
            xScaleAxis,
            xScalePlot,
            yScaleAxis,
            yScalePlot,
            xMax: plotBoundsX,
            yMax: plotBoundsY,
            treeBoundsY,
            heatmapBoundsY,
          });
        }, 100);

        timeoutRef.current = timeoutId;
      });

      if (internalRef) {
        resizeObserver.observe(internalRef);
      }

      return () => {
        if (internalRef) resizeObserver.unobserve(internalRef);
        if (timeoutId) clearTimeout(timeoutId);
      };
    },
    [props.binData, props.plotTitle]
  );

  return (
    <PlotContainer
      justifyContent="center"
      status={plotDims ? 'idle' : 'loading'}
      figureRef={figureRef}
      position="relative"
      height={1200}
      plotType="heatmap"
      id={props.id}
    >
      {plotDims && (
        <>
          <svg
            className="main-svg"
            width="100%"
            height="100%"
            ref={containerRef}
          >
            <ColorLegend
              colorScale={colorScale}
              id={nanoid()}
              minVal={props.distanceMethod === 'euclidean' ? colorMin : -1}
              maxVal={props.distanceMethod === 'euclidean' ? colorMax : 1}
              width={20}
              height={225}
              x={60}
              y={10}
              labelOffset={30}
              reverse={props.distanceMethod === 'correlation'}
              label={
                props.distanceMethod === 'euclidean'
                  ? 'euclidean distance'
                  : 'correlation coefficient'
              }
            />
            <Group>
              <Text
                x={plotDims.xMax / 2 + plotDims.tickLabelSize}
                y={15}
                textAnchor="middle"
                fontSize={20}
              >
                {props.plotTitle}
              </Text>
            </Group>
            <Group
              top={plotDims.titleHeight}
              left={plotDims.tickLabelSize + plotDims.tickLineSize}
            >
              <Cluster<ClusterTree>
                root={treeData}
                size={[plotDims.xMax, plotDims.treeBoundsY]}
                separation={() => {
                  return 5;
                }}
              >
                {(cluster) => (
                  <Group>
                    {cluster.links().map((link, i) => (
                      <LinkVerticalStep<
                        HierarchyPointLink<ClusterTree>,
                        HierarchyPointNode<ClusterTree>
                      >
                        key={`cluster-link-${i}`}
                        data={link}
                        stroke="black"
                        strokeWidth="1"
                        fill="none"
                        percent={0}
                      />
                    ))}
                    {cluster.descendants().map((node, i) => (
                      <Group
                        top={node.y}
                        left={node.x}
                        key={`cluster-node-${i}`}
                      >
                        {!node.children && (
                          <Text
                            dy={3}
                            fontSize={10}
                            fontFamily="Arial"
                            textAnchor="end"
                            angle={270}
                            dx={4}
                          >
                            {node.data.name}
                          </Text>
                        )}
                      </Group>
                    ))}
                  </Group>
                )}
              </Cluster>
            </Group>
            <Group
              top={
                plotDims.titleHeight +
                plotDims.treeBoundsY +
                plotDims.tickLabelSize
              }
              left={plotDims.tickLabelSize + plotDims.tickLineSize}
            >
              <HeatmapRect
                data={props.binData}
                xScale={(d) =>
                  plotDims?.xScalePlot ? plotDims.xScalePlot(d) : 0
                }
                yScale={(d) =>
                  plotDims?.yScalePlot ? plotDims.yScalePlot(d) : 0
                }
                colorScale={colorScale}
                // opacityScale={opacityScale}
                binWidth={plotDims?.binWidth}
                binHeight={plotDims?.binHeight}
                bins={(d: HeatmapBins) => d && d.bins}
                count={(d: HeatmapBin) => d && d.count}
                gap={1}
              >
                {(heatmap) =>
                  heatmap.map((heatmapData) =>
                    heatmapData.map((data) => {
                      return (
                        <rect
                          key={`heatmap-rect-${data.row}-${data.column}`}
                          width={data.width}
                          height={data.height}
                          x={data.x}
                          y={data.y}
                          fill={data.color}
                          fillOpacity={data.opacity}
                          onMouseOver={() => {
                            showTooltip({
                              tooltipData: data,
                              tooltipTop:
                                data.y +
                                plotDims.titleHeight +
                                plotDims.treeBoundsY +
                                plotDims.tickLabelSize,
                              tooltipLeft: data.x,
                            });
                          }}
                          onMouseOut={hideTooltip}
                        />
                      );
                    })
                  )
                }
              </HeatmapRect>
              <AxisLeft
                left={-10}
                numTicks={props.binData.length}
                tickLabelProps={() => ({
                  lengthAdjust: 'spacing',
                  fontSize: 10,
                  textAnchor: 'end',
                  dy: 3,
                  dx: -3,
                })}
                scale={plotDims.yScaleAxis}
              />
            </Group>
          </svg>
        </>
      )}

      {tooltipOpen && tooltipData && (
        <TooltipInPortal left={tooltipLeft} top={tooltipTop}>
          <p>
            <ChakraText as="span" fontWeight="semibold">
              Column
            </ChakraText>
            <ChakraText as="span" ml={1}>
              {props.binData[tooltipData.column].bin}
            </ChakraText>
          </p>
          <p>
            <ChakraText as="span" fontWeight="semibold">
              Row
            </ChakraText>
            <ChakraText as="span" ml={1}>
              {props.binData[tooltipData.column].bins[tooltipData.row].bin}
            </ChakraText>
          </p>
          <p>
            <ChakraText as="span" fontWeight="semibold">
              {props.distanceMethod.charAt(0).toUpperCase() +
                props.distanceMethod.slice(1)}
            </ChakraText>
            <ChakraText as="span" ml={1}>
              {tooltipData.count?.toFixed(4)}
            </ChakraText>
          </p>
        </TooltipInPortal>
      )}
    </PlotContainer>
  );
};

export default HeatmapPlot;
