import { DataRows } from '@/store/dataframe';
import { GXPDistanceMethod } from '@/utils/plots/heatmap';
import { Layout, PlotData } from 'plotly.js';

export type PlotType = 'heatmap' | 'pca' | 'plotly' | 'image' | 'mapman';

export interface GxpPlot {
  id: string;
  type: PlotType;
  isLoading: boolean;
}

//#region MapMan

export type GxpMapManColorScale =
  | 'continuous_0q3'
  | 'continuous_q1q3'
  | 'continuous_xy'
  | 'diverging_-xx';
export interface GxpMapMan extends GxpPlot {
  template: string;
  infoTableColumn: string;
  infoTableColumnSep: string;
  valuesFrom: string;
  colorScale: GxpMapManColorScale;
  colorScaleValueX?: number;
  colorScaleValueY?: number;
  sample?: string;
}
//#endregion

//#region Heatmap

/**
 * Interface describing the expected properties of the HeatmapPlot component.
 * - `binData`: the rows of the heatmap matrix
 */
export interface GxpHeatmap extends GxpPlot {
  tree: ClusterTree;
  binData: HeatmapBins[];
  distanceMethod: GXPDistanceMethod;
  plotTitle?: string;
}

export interface ClusterTree {
  name: string;
  children?: ClusterTree[];
}

/**
 * Interface describing a row in the heatmap matrix.
 * - `bin`: the row name (e.g. replicate name, accession id)
 * - `bins`: the matrix row of cell values
 */
export interface HeatmapBins {
  bin: string;
  bins: HeatmapBin[];
}

/**
 * Interface describing a cell in a the heatmap matrix
 * - `bin`: the column name (e.g. replicate name, accession id)
 * - `count`: the cell value to use for the heat scale
 */
export interface HeatmapBin {
  bin: string;
  count: number;
}

export interface CreateHeatmapArgs {
  dataRows: DataRows;
  distanceMethod: GXPDistanceMethod;
  srcReplicateNames: string[];
  srcAccessionIds: string[];
  transpose: boolean;
}

//#endregion

//#region Plotly Plots

export interface PlotlyOptions {
  showlegend: boolean;
  showCaption: boolean;
  plotType?: 'bar' | 'scatter';
  colorBy?: string;
  plotTitle: string;
}

export interface GxpPlotly extends GxpPlot {
  data: Partial<PlotData>[];
  accessions: string[];
  options: PlotlyOptions;
}

export interface GxpPCA extends GxpPlot {
  data: Partial<PlotData>[];
  layout: Partial<Layout>;
}

export interface CreatePCAargs {
  dataRows: DataRows;
  srcReplicateNames: string[];
  srcAccessionIds: string[];
  transpose: boolean;
  plotTitle?: string;
  multiHeaderSep: string;
}
//#endregion

//#region Images

export interface GxpImage extends GxpPlot {
  src: string;
  alt: string;
}

//#endregion
