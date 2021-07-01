import { Config, Layout, PlotMouseEvent } from 'plotly.js';
import React, { createContext } from 'react';
import Plot from 'react-plotly.js';
import { PlotData } from 'plotly.js';
import { settings } from '@/store/settings';
import { observer } from 'mobx-react';
import { GxpPlotly, PlotlyOptions } from '@/types/plots';
import PlotContainer from './plot-container';
import { Box } from '@chakra-ui/react';
import { plotStore } from '@/store/plot-store';

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
    title: {
      text: props.options.plotTitle,
      font: {
        size: 20,
      },
      y: 0.9,
    },
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
    autosize: true,
    colorway: colors,
  });

  const config: Partial<Config> = {
    // responsive: true,
    toImageButtonOptions: {
      format: 'svg',
      filename: 'plot',
    },
    displaylogo: false,
    modeBarButtonsToAdd: [
      {
        title: 'Delete plot',
        name: 'Delete plot',
        icon: {
          width: 21,
          height: 21,
          path: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
        },
        click: () => {
          plotStore.deletePlot(props.id);
        },
      },
    ],
  };

  React.useEffect(function resizePlot() {
    let id: number;
    const internalRef = figureRef.current;
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

    if (internalRef) {
      resizeObserver.observe(internalRef);
    }

    return () => {
      if (internalRef) resizeObserver.unobserve(internalRef);
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
      <PlotContainer status="idle" figureRef={figureRef}>
        <Plot
          ref={(ref) => (plotRef.current = ref)}
          data={props.data}
          layout={layout}
          config={config}
          onHover={onPlotHover}
          onUnhover={onPlotUnhover}
          style={{ width: '100%', height: '100%' }}
        />
        <Box marginX="12" width="full" overflow="auto" flexShrink={1.3}>
          {props.children}
        </Box>
      </PlotContainer>
    </PlotContext.Provider>
  );
};

export default observer(PlotlyPlot);
