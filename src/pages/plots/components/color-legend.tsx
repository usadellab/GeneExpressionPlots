import React, { useRef, useLayoutEffect } from 'react';
import * as d3 from 'd3';

interface colorLegendProps {
  colorScale: any;
  id: string;
  minVal: number;
  maxVal: number;
  label: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

const ColorLegend: React.FC<colorLegendProps> = ({
  colorScale,
  id,
  minVal,
  maxVal,
  label,
  width,
  height,
  x,
  y,
}: colorLegendProps) => {
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
      .attr('width', width)
      .attr('height', height)
      .attr('x', x)
      .attr('y', y)
      .style('fill', `url(#linear-gradient-${id})`);

    svg
      .append('g')
      .attr('transform', `translate(${x - 10}, ${y})`)
      .call(axis);

    svg
      .append('text')
      .attr('class', 'y label')
      .attr('text-anchor', 'end')
      .attr('transform', `translate (${x - 20},${y + 80}) rotate(-90)`)
      .text(label);
  }, []);
  return <svg ref={ref} />;
};

export default ColorLegend;
