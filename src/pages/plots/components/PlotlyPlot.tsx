import { PlotlyOptions } from '@/types/plots';
import { Box, Flex } from '@chakra-ui/layout';
import { Config, Layout, PlotData, PlotMouseEvent } from 'plotly.js';
import React, { createContext } from 'react';
import Plot from 'react-plotly.js';
import { settings } from '@/store/settings';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';

export interface PlotlyPlotProps {
  data: Partial<PlotData>[];
  accessions: string[];
  options: PlotlyOptions;
}

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

const PlotlyPlot: React.FC<PlotlyPlotProps> = (props) => {
  const [name, setName] = React.useState('');
  const plotRef = React.useRef<Plot | null>(null);
  const figureRef = React.useRef<HTMLDivElement | null>(null);
  const timeoutRef = React.useRef<number>();

  const [layout, setLayout] = React.useState<Partial<Layout>>({
    title: {
      text: props.options.plotTitle,
      font: {
        family: 'ABeeZee',
        size: 24,
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
    // xaxis: {
    //   tickangle: ,
    // },
    colorway: colors,
  });
  console.log({ PPdata: toJS(props.data) });
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
    if (points.length !== 1 || props.accessions?.length <= 1) return;
    const name = points[0].data.name;
    setName(name);
  };

  const onPlotUnhover = (): void => {
    setName('');
  };

  console.log({ pp: toJS(props.data) });

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
          data={toJS(props.data)}
          layout={layout}
          onHover={onPlotHover}
          onUnhover={onPlotUnhover}
        />
        <div className="mx-12">{props.children}</div>
      </Flex>
    </PlotContext.Provider>
  );
};

export default observer(PlotlyPlot);
