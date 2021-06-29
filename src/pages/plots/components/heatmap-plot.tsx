import React from 'react';
import { toJS } from 'mobx';
import { chakra, Text as ChakraText } from '@chakra-ui/react';

import { ScaleLinear, ScaleBand } from 'd3-scale';
import { AxisBottom } from '@visx/axis';
import { Group } from '@visx/group';
import { HeatmapRect } from '@visx/heatmap';
import { scaleBand, scaleLinear } from '@visx/scale';
import { getStringWidth, Text } from '@visx/text';
import { useTooltipInPortal, useTooltip } from '@visx/tooltip';

import PlotContainer from './plot-container';
import { HeatmapBins, HeatmapBin } from '@/types/plots';
import { RectCell } from '@visx/heatmap/lib/heatmaps/HeatmapRect';

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

interface HeatmapPlotProps {
  binData: HeatmapBins[];
  plotTitle?: string;
}

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
  const colorScale = scaleLinear<string>({
    range: [gradient0, gradient1],
    domain: [colorMin, colorMax],
  });

  // dimensions
  const figureRef = React.useRef<HTMLDivElement | null>(null);
  const timeoutRef = React.useRef<number>();
  const [plotDims, setPlotDims] = React.useState<{
    binWidth: number;
    binHeight: number;
    xScale: ScaleLinear<number, number>;
    yScale: ScaleLinear<number, number>;
    xMax: number;
    yMax: number;
    xAxisScale: ScaleBand<string>;
  }>();

  // title
  const titleHeight = props.plotTitle ? 30 : 0;

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

          const tickLabelHeight = props.binData
            .map((data) =>
              getStringWidth(data.bin, {
                'font-size': 14,
              })
            )
            .reduce((previous, current) =>
              previous === null
                ? current
                : current === null
                ? previous
                : previous === null && current === null
                ? 0
                : Math.max(previous, current)
            );

          const clientWidth = entries[0].target.clientWidth - clientPaddingX;
          const clientHeight =
            entries[0].target.clientHeight -
            clientPaddingY -
            (tickLabelHeight ?? 0) -
            10 - // Tick line height
            titleHeight;

          const dataLen = props.binData.length;
          const binWidth = clientWidth / dataLen;
          const binHeight = clientHeight / dataLen;

          const xScale = scaleLinear<number>({
            domain: [0, props.binData.length],
            range: [0, clientWidth],
          });

          const yScale = scaleLinear<number>({
            // domain: [0, max(props.binData, (d) => bins(d).length)],
            domain: [0, props.binData.length],
            range: [0, clientHeight],
          });

          const xAxisScale = scaleBand<string>({
            domain: props.binData.map((data) => data.bin),
            range: [0, clientWidth],
          });

          setPlotDims({
            binWidth,
            binHeight,
            xScale,
            yScale,
            xMax: clientWidth,
            yMax: clientHeight,
            xAxisScale,
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
    [props.binData, titleHeight]
  );

  return (
    <PlotContainer
      justifyContent="center"
      status={plotDims ? 'idle' : 'loading'}
      figureRef={figureRef}
      position="relative"
    >
      {plotDims && (
        <svg width="100%" height="100%" ref={containerRef}>
          <Group>
            <Text
              x={plotDims.xMax / 2}
              y={15}
              textAnchor="middle"
              fontSize={20}
            >
              {props.plotTitle}
            </Text>
          </Group>
          <Group top={titleHeight}>
            <HeatmapRect
              data={props.binData}
              xScale={(d) => (plotDims?.xScale ? plotDims.xScale(d) : 0)}
              yScale={(d) => (plotDims?.yScale ? plotDims.yScale(d) : 0)}
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
                      <chakra.rect
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
                            tooltipTop: data.y,
                            tooltipLeft: data.x,
                          });
                        }}
                        onMouseOut={hideTooltip}
                        onClick={() => {
                          const colName = toJS(props.binData[data.column].bin);
                          const rowName = toJS(
                            props.binData[data.column].bins[data.row].bin
                          );
                          console.log({
                            colName,
                            rowName,
                            bin: toJS(data.bin),
                          });
                        }}
                      />
                    );
                  })
                )
              }
            </HeatmapRect>
          </Group>
          <AxisBottom
            top={plotDims.yMax + 10 + titleHeight}
            scale={plotDims.xAxisScale}
            numTicks={props.binData.length}
            tickLabelProps={() => ({
              angle: 270,
              dx: 3,
              lengthAdjust: 'spacing',
              fill: 'black',
              fontSize: 14,
              textAnchor: 'end',
            })}
          />
        </svg>
      )}
      {tooltipOpen && tooltipData && (
        <TooltipInPortal left={tooltipLeft} top={tooltipTop}>
          <ChakraText fontWeight="semibold">
            {`Column: ${props.binData[tooltipData.column].bin}`}
          </ChakraText>
          <ChakraText fontWeight="semibold">
            {`Row: ${
              props.binData[tooltipData.column].bins[tooltipData.row].bin
            }`}
          </ChakraText>
          <ChakraText fontWeight="semibold">
            {`Distance: ${tooltipData.count?.toFixed(2)}`}
          </ChakraText>
        </TooltipInPortal>
      )}
    </PlotContainer>
  );
};

export default HeatmapPlot;
