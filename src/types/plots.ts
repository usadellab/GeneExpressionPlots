import { Bins } from '@visx/mock-data/lib/generators/genBins';

export type PlotType = 'heatmap';

export interface GxpPlot {
  key: string;
  type: PlotType;
  isLoading: boolean;
}

export interface GxpHeatmap extends GxpPlot {
  binData: Bins[];
}
