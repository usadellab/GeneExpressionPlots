import React from 'react';

import { Layout, PlotData } from 'plotly.js';
import PlotContainer from './plot-container';
import Plot from 'react-plotly.js';
import { observer } from 'mobx-react';

interface PCAPlotProps {
  data: Partial<PlotData>[];
  layout: Partial<Layout>;
}

const PCAPlot: React.FC<PCAPlotProps> = (props) => {
  const plotRef = React.useRef<Plot | null>(null);
  const figureRef = React.useRef<HTMLDivElement | null>(null);
  const timeoutRef = React.useRef<number>();

  const [layout, setLayout] = React.useState<Partial<Layout>>(props.layout);
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
    <PlotContainer status="idle" figureRef={figureRef}>
      <Plot
        ref={(ref) => (plotRef.current = ref)}
        data={props.data}
        layout={layout}
        style={{ width: '100%', height: '100%' }}
      />
    </PlotContainer>
  );
};

export default observer(PCAPlot);
