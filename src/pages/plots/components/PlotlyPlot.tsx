import { Box, Flex } from '@chakra-ui/layout';
import { Config, Layout, PlotData, PlotMouseEvent } from 'plotly.js';
import React, { createContext } from 'react';
import Plot from 'react-plotly.js';

interface PlotlyPlotProps {
  plot: {
    data: Partial<PlotData>[];
    layout: Partial<Layout>;
    config?: Partial<Config>;
  };
  options: {
    accessions: string[];
  };
}

export const PlotContext = createContext({ hoveredGene: '' });

export const PlotlyPlot: React.FC<PlotlyPlotProps> = (props) => {
  const [name, setName] = React.useState('');
  const plotRef = React.useRef<Plot | null>(null);
  const figureRef = React.useRef<HTMLDivElement | null>(null);
  const timeoutRef = React.useRef<number>();

  const [layout, setLayout] = React.useState(props.plot.layout);

  console.log({ props });
  React.useEffect(function resizePlot() {
    let id: number;

    const resizeObserver = new ResizeObserver((entries) => {
      clearTimeout(timeoutRef.current);
      id = window.setTimeout(() => {
        setLayout((snapshot) => ({
          ...snapshot,
          width: entries[0].target.clientWidth,
        }));
      }, 250);

      timeoutRef.current = id;
    });

    if (figureRef.current) {
      resizeObserver.observe(figureRef.current);
    }

    return () => {
      if (figureRef.current) resizeObserver.unobserve(figureRef.current);
      if (id) clearTimeout(id);
    };
  }, []);

  const onPlotHover = (plotObject: Readonly<PlotMouseEvent>): void => {
    const { points } = plotObject;
    if (points.length !== 1 || props.options.accessions?.length <= 1) return;
    const name = points[0].data.name;
    setName(name);
  };

  const onPlotUnhover = (): void => {
    setName('');
  };

  return (
    <PlotContext.Provider value={{ hoveredGene: name }}>
      <Flex
        as="figure"
        ref={(ref) => (figureRef.current = ref)}
        position="relative"
        direction="column"
        boxShadow="lg"
        bg="white"
        overflow="auto"
        resize="horizontal"
        width="full"
        m="3"
        py="6"
      >
        <Plot
          ref={(ref) => (plotRef.current = ref)}
          {...props.plot}
          layout={layout}
          onHover={onPlotHover}
          onUnhover={onPlotUnhover}
        />
        <div className="mx-12">{props.children}</div>
      </Flex>
    </PlotContext.Provider>
  );
};
