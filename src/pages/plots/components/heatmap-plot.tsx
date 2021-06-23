import React from 'react';
import { chakra } from '@chakra-ui/react';

import { HeatmapRect } from '@visx/heatmap';
import { Bin, Bins } from '@visx/mock-data/lib/generators/genBins';
import { scaleLinear } from '@visx/scale';
import { ScaleLinear } from 'd3-scale';

import PlotContainer from './plot-container';

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
const bins = (d: Bins): Bin[] => d.bins;
const count = (d: Bin): number => d.count;

const HeatmapPlot: React.FC<{ binData: Bins[] }> = (props) => {
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
  }>();

  React.useEffect(
    function resizePlot() {
      let timeoutId: number;
      const internalRef = figureRef.current;

      const resizeObserver = new ResizeObserver((entries) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        setPlotDims(undefined);
        timeoutId = window.setTimeout(() => {
          const figureStyle = window.getComputedStyle(entries[0].target, null);

          const clientPadding =
            parseFloat(figureStyle.getPropertyValue('padding')) * 2;

          // const clientWidth =
          //   parseFloat(figureStyle.getPropertyValue('width')) - clientPadding;
          // const clientHeight =
          //   parseFloat(figureStyle.getPropertyValue('height')) - clientPadding;

          const clientWidth = entries[0].target.clientWidth - clientPadding;
          const clientHeight = entries[0].target.clientHeight - clientPadding;

          const dataLen = props.binData.length;
          const binWidth = clientWidth / dataLen;
          const binHeight = clientHeight / dataLen;

          const xScale = scaleLinear<number>({
            domain: [0, props.binData.length],
          }).range([0, clientWidth]);

          const yScale = scaleLinear<number>({
            domain: [0, props.binData.length],
            // domain: [0, max(props.binData, (d) => bins(d).length)],
          }).range([0, clientHeight]);

          setPlotDims({
            binWidth,
            binHeight,
            xScale,
            yScale,
          });
        }, 100);

        timeoutRef.current = timeoutId;
      });

      // if (figureRef.current) {
      if (internalRef) {
        resizeObserver.observe(internalRef);
      }

      return () => {
        if (internalRef) resizeObserver.unobserve(internalRef);
        if (timeoutId) clearTimeout(timeoutId);
      };
    },
    [props.binData.length]
  );

  return (
    <PlotContainer status={plotDims ? 'idle' : 'loading'} figureRef={figureRef}>
      <svg width="100%" height="100%">
        <HeatmapRect
          data={props.binData}
          xScale={(d) => (plotDims?.xScale ? plotDims.xScale(d) : 0)}
          yScale={(d) => (plotDims?.yScale ? plotDims.yScale(d) : 0)}
          colorScale={colorScale}
          // opacityScale={opacityScale}
          binWidth={plotDims?.binWidth}
          binHeight={plotDims?.binHeight}
          gap={1}
        >
          {(heatmap) =>
            heatmap.map((heatmapData) =>
              heatmapData.map((data) => {
                return (
                  <chakra.rect
                    sx={{
                      '&:hover': {
                        stroke: 'black',
                      },
                    }}
                    key={`heatmap-rect-${data.row}-${data.column}`}
                    width={data.width}
                    height={data.height}
                    x={data.x}
                    y={data.y}
                    fill={data.color}
                    fillOpacity={data.opacity}
                    onClick={() => {
                      const fromData = props.binData
                        ? props.binData[data.column].bins[data.row]
                        : undefined;
                      const fromBin = data.bin;
                      console.log({ fromData, fromBin });
                    }}
                  />
                );
              })
            )
          }
        </HeatmapRect>
      </svg>
      )
    </PlotContainer>
  );
};

export default HeatmapPlot;
