export type PlotType = 'plotly';

export interface GxpPlot<T> {
  key: string;
  type: PlotType;
  props: T;
}

export interface PlotlyOptions {
  showlegend: boolean;
  showCaption: boolean;
  plotType?: 'bar' | 'scatter';
  colorBy?: string;
  plotTitle: string;
}
