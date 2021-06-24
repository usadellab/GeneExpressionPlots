export type PlotType = 'heatmap';

export interface GxpPlot {
  key: string;
  type: PlotType;
  isLoading: boolean;
}

/**
 * Interface describing the expected properties of the HeatmapPlot component.
 * - `binData`: the rows of the heatmap matrix
 */
export interface GxpHeatmap extends GxpPlot {
  // binData: Bins[];
  binData: HeatmapBins[];
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
