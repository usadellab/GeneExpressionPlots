import React, { useRef, useLayoutEffect } from 'react';
import * as d3 from 'd3';

interface HeatmapLegendProps {
  colorScale: any;
  id: string;
  minVal: number;
  maxVal: number;
  label: string;
}

const HeatmapLegend: React.FC<HeatmapLegendProps> = ({
  colorScale,
  id,
  minVal,
  maxVal,
  label,
}: HeatmapLegendProps) => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const scale = d3.scaleLinear().domain([minVal, maxVal]).range([250, 0]);
    const axis = d3.axisLeft(scale).scale(scale).tickValues([minVal, maxVal]);

    const svg = d3.select(ref.current);

    //Append a defs (for definition) element to your SVG
    const defs = svg.append('defs');

    //Append a linearGradient element to the defs and give it a unique id
    const linearGradient = defs
      .append('linearGradient')
      .attr('id', `linear-gradient-${id}`);

    linearGradient
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '0%')
      .attr('y2', '0%');

    linearGradient
      .selectAll('stop')
      .data(
        colorScale.ticks().map((t: number, i: number, n: number[]) => ({
          offset: `${(100 * i) / n.length}%`,
          color: colorScale(t),
        }))
      )
      .enter()
      .append('stop')
      .attr('offset', (d: any) => d.offset)
      .attr('stop-color', (d: any) => d.color);

    svg
      .append('rect')
      .attr('width', 20)
      .attr('height', 250)
      .attr('x', 120)
      .attr('y', 60)
      .style('fill', `url(#linear-gradient-${id})`);

    svg.append('g').attr('transform', 'translate(110, 60)').call(axis);

    svg
      .append('text')
      .attr('class', 'y label')
      .attr('text-anchor', 'end')
      .attr('transform', 'translate (100,110) rotate(-90)')
      .text(label);
  }, []);
  return <svg ref={ref} />;
};

export default HeatmapLegend;
