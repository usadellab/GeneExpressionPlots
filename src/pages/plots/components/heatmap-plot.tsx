import React from 'react';
import { chakra, Flex } from '@chakra-ui/react';

import { HeatmapRect } from '@visx/heatmap';
import { Bin, Bins } from '@visx/mock-data/lib/generators/genBins';
import { ParentSize } from '@visx/responsive';
import { scaleLinear } from '@visx/scale';

import { GxpHeatmap } from '@/types/plots';

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

// export type HeatmapProps = {
//   width: number;
//   height: number;
//   margin?: { top: number; right: number; bottom: number; left: number };
//   separation?: number;
//   events?: boolean;
// };

const defaultMargin = { top: 10, left: 20, right: 20, bottom: 110 };

const HeatmapPlot: React.FC<GxpHeatmap> = (props) => {
  const width = 1000;
  const height = 1000;
  const margin = defaultMargin;
  const separation = 20;

  // color
  const colorMin = min(props.binData, (d) => min(bins(d), count));
  const colorMax = max(props.binData, (d) => max(bins(d), count));

  const colorScale = scaleLinear<string>({
    range: [gradient0, gradient1],
    domain: [colorMin, colorMax],
  });

  const opacityScale = scaleLinear<number>({
    range: [0.1, 1],
    domain: [colorMin, colorMax],
  });

  // bounds
  const size =
    width > margin.left + margin.right
      ? width - margin.left - margin.right - separation
      : width;
  const xMax = size / 2;
  const yMax = height - margin.bottom - margin.top;

  const binWidth = xMax / props.binData.length;

  // position
  const xScale = scaleLinear<number>({
    domain: [0, props.binData.length],
  }).range([0, xMax]);

  const yScale = scaleLinear<number>({
    domain: [0, max(props.binData, (d) => bins(d).length)],
  }).range([yMax, 0]);

  return (
    <Flex as={ParentSize} flexGrow={1}>
      {({ width, height }: { width: number; height: number }) => (
        <svg width={width} height={height}>
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            // rx={14}
            fill={background}
            // fill="#ffffff00"
          />

          <HeatmapRect
            data={props.binData}
            xScale={(d) => (xScale ? xScale(d) : 0)}
            yScale={(d) => (yScale ? yScale(d) : 0)}
            colorScale={colorScale}
            opacityScale={opacityScale}
            binWidth={binWidth}
            binHeight={binWidth}
            gap={1}
          >
            {(heatmap) =>
              heatmap.map((heatmapData) =>
                heatmapData.map((data) => (
                  <chakra.rect
                    sx={{
                      '&:hover': {
                        stroke: 'white',
                      },
                    }}
                    key={`heatmap-rect-${data.row}-${data.column}`}
                    className="visx-heatmap-rect"
                    width={data.width}
                    height={data.height}
                    x={data.x}
                    y={data.y}
                    fill={data.color}
                    fillOpacity={data.opacity}
                    onClick={() => {
                      const fromData =
                        props.binData[data.column].bins[data.row];
                      const fromBin = data.bin;
                      console.log({ fromData, fromBin });
                    }}
                  />
                ))
              )
            }
          </HeatmapRect>
        </svg>
      )}
    </Flex>
  );
};

export default HeatmapPlot;
