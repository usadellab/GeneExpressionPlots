import { Layout, PlotMouseEvent } from 'plotly.js';
import React, { createContext } from 'react';
import Plot from 'react-plotly.js';
import { PlotData } from 'plotly.js';
import { settings } from '@/store/settings';
import { observer } from 'mobx-react';
import { GxpPlotly, PlotlyOptions } from '@/types/plots';
import PlotContainer from './plot-container';
import { Box } from '@chakra-ui/react';

export const colors = [
  '#c7566f',
  '#57bf67',
  '#845ec9',
  '#90b83d',
  '#d3a333',
  '#c363ab',
  '#4a7c38',
  '#adab63',
  '#698ccc',
  '#c94f32',
  '#826627',
  '#52b8a4',
  '#d88e61',
];

export const PlotContext = createContext({ hoveredGene: '' });

export interface PlotlyPlotProps {
  data: Partial<PlotData>[];
  accessions: string[];
  options: PlotlyOptions;
}

const PlotlyPlot: React.FC<GxpPlotly> = (props) => {
  const [name, setName] = React.useState('');
  const plotRef = React.useRef<Plot | null>(null);
  const figureRef = React.useRef<HTMLDivElement | null>(null);
  const timeoutRef = React.useRef<number>();

  const [layout, setLayout] = React.useState<Partial<Layout>>({
    showlegend: props.options.showlegend,
    legend: {
      orientation: 'h',
      x: 0,
      y: -0.3,
    },
    yaxis: {
      title: {
        text: `count [${settings.unit}]`, // access to the unit needs to be variable
      },
      hoverformat: '.2f',
    },
    colorway: colors,
  });
  React.useEffect(function resizePlot() {
    let id: number;
    let figureRefValue: HTMLDivElement | null = null;
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
      figureRefValue = figureRef.current;
    }

    return () => {
      if (figureRefValue) resizeObserver.unobserve(figureRefValue);
      if (id) clearTimeout(id);
    };
  }, []);

  const onPlotHover = (plotObject: Readonly<PlotMouseEvent>): void => {
    const { points } = plotObject;
    if (points.length !== 1 || props.accessions?.length <= 1) return;
    const name = points[0].data.name;
    setName(name);
  };

  const onPlotUnhover = (): void => {
    setName('');
  };

  return (
    <PlotContext.Provider value={{ hoveredGene: name }}>
      <PlotContainer
        status="idle"
        figureRef={figureRef}
        title={props.options.plotTitle}
      >
        <Plot
          ref={(ref) => (plotRef.current = ref)}
          data={props.data}
          layout={layout}
          onHover={onPlotHover}
          onUnhover={onPlotUnhover}
        />
        <Box marginX="12" width="full">
          {props.children}
        </Box>
      </PlotContainer>
    </PlotContext.Provider>
  );
};

export default observer(PlotlyPlot);
