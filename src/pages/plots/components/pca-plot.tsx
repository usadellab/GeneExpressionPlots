import React from 'react';

import { Config, Layout } from 'plotly.js';
import PlotContainer from './plot-container';
import Plot from 'react-plotly.js';
import { observer } from 'mobx-react';
import { plotStore } from '@/store/plot-store';
import { GxpPCA } from '@/types/plots';

const PCAPlot: React.FC<GxpPCA> = (props) => {
  const plotRef = React.useRef<Plot | null>(null);
  const figureRef = React.useRef<HTMLDivElement | null>(null);
  const timeoutRef = React.useRef<number>();

  const [layout, setLayout] = React.useState<Partial<Layout>>(props.layout);

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

  return (
    <PlotContainer status="idle" figureRef={figureRef} id={props.id}>
      <Plot
        ref={(ref) => (plotRef.current = ref)}
        data={props.data}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%' }}
      />
    </PlotContainer>
  );
};

export default observer(PCAPlot);
