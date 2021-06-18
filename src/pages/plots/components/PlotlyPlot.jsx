import React, { createContext } from 'react';
import Plot from 'react-plotly.js';

export const PlotContext = createContext({ hoveredGene: '' });

export default function PlotlyPlot(props) {
  const [name, setName] = React.useState('');
  const plotRef = React.useRef(null);
  const figureRef = React.useRef(null);
  const timeoutRef = React.useRef(undefined);

  const [layout, setLayout] = React.useState(props.plot.layout);

  React.useEffect(function resizePlot() {
    let id;

    const resizeObserver = new ResizeObserver((entries) => {
      clearTimeout(timeoutRef.current);
      id = setTimeout(() => {
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

  const onPlotHover = (plotObject) => {
    const { points } = plotObject;
    if (points.length !== 1 || props.plot.accessions?.length <= 1) return;
    const name = points[0].fullData.name;
    setName(name);
  };

  const onPlotUnhover = () => {
    setName('');
  };

  return (
    <PlotContext.Provider value={{ hoveredGene: name }}>
      <figure
        ref={(ref) => (figureRef.current = ref)}
        className={props.className}
      >
        <Plot
          ref={(ref) => (plotRef.current = ref)}
          {...props.plot}
          layout={layout}
          onHover={onPlotHover}
          onUnhover={onPlotUnhover}
        />
        <div className="mx-12">{props.children}</div>
      </figure>
    </PlotContext.Provider>
  );
}
