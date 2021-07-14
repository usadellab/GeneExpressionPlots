import { makeAutoObservable, toJS } from 'mobx';
import { nanoid } from 'nanoid';
import {
  GxpHeatmap,
  GxpPlot,
  PlotlyOptions,
  GxpPlotly,
  GxpPCA,
  GxpImage,
  HeatmapBins,
  ClusterTree,
} from '@/types/plots';
import { dataTable } from '@/store/data-store';

// Workers
import HeatMapWorker from '@/workers/heatmap?worker&inline';
import PCAWorker from '@/workers/pca?worker&inline';
// import { createHeatmapPlot } from '@/utils/plots/heatmap';
import multiGeneBarData from '@/utils/plots/multi-gene-bar';
import multiGeneIndividualLinesData from '@/utils/plots/multi-gene-individual-lines';
import singleGeneIndividualLinesData from '@/utils/plots/single-gene-individual-lines';
import singleGeneBarData from '@/utils/plots/single-gene-bar';
import stackedLinesData from '@/utils/plots/stacked-lines';
// import pcaData from '@/utils/plots/pca';
import { Layout, PlotData } from 'plotly.js';

class PlotStore {
  plots: GxpPlot[] = [];
  _image: string | null = null;

  countUnit: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  /* UNIT */

  loadCountUnit(countUnit: string): void {
    this.countUnit = countUnit;
  }

  /* IMAGE */

  get hasPlots(): boolean {
    return this.plots.length > 0;
  }

  /**
   * Clear the plots array in the store.
   */
  clearPlots(): void {
    this.plots = [];
  }

  /**
   * Remove a single plot from the store.
   * @param id plot id
   */
  deletePlot(id: string): void {
    const index = this.plots.findIndex((plot) => plot.id === id);
    if (index > -1) {
      const plot = this.plots[index];
      if (plot.type === 'image') {
        const gxpImage = plot as GxpImage;
        URL.revokeObjectURL(gxpImage.src);
      }
      this.plots.splice(index, 1);
    }
  }

  /**
   * Add a new gene expression heatmap plot to the store.
   * @param replicates gene accessions to visualize
   */
  addHeatmapPlot(plotTitle?: string, replicates?: string[]): void {
    const id = nanoid();
    const pendingPlot: GxpPlot = {
      id,
      type: 'heatmap',
      isLoading: true,
    };
    const plotIndex = this.plots.push(pendingPlot) - 1;

    const worker = new HeatMapWorker();
    const data = {
      dataRows: toJS(dataTable.rows),
      srcReplicateNames: replicates?.length ? replicates : dataTable.colNames,
    };
    worker.postMessage(data);
    worker.onmessage = function (
      e: MessageEvent<{
        bins: HeatmapBins[];
        tree: ClusterTree;
      }>
    ) {
      console.log(e.data);
      const loadedPlot: GxpHeatmap = {
        ...plotStore.plots[plotIndex],
        isLoading: false,
        binData: e.data.bins,
        tree: e.data.tree,
        plotTitle,
      };

      if (plotStore.plots[plotIndex].id === id) {
        plotStore.plots[plotIndex] = loadedPlot;
      }
    };
  }

  addImagePlot(url: string, alt: string): void {
    const image: GxpImage = {
      alt,
      id: nanoid(),
      isLoading: false,
      type: 'image',
      src: url,
    };

    this.plots.push(image);
  }

  addPCAPlot(plotTitle?: string): void {
    const id = nanoid();
    const pendingPlot: GxpPlot = {
      id,
      type: 'pca',
      isLoading: true,
    };
    const plotIndex = this.plots.push(pendingPlot) - 1;

    const worker = new PCAWorker();
    const data = {
      dataRows: toJS(dataTable.rows),
      srcReplicateNames: dataTable.colNames,
      multiHeaderSep: dataTable.config.multiHeader,
      plotTitle,
    };
    worker.postMessage(data);
    worker.onmessage = function (
      e: MessageEvent<{
        data: Partial<PlotData>[];
        layout: Partial<Layout>;
      }>
    ) {
      const loadedPlot: GxpPCA = {
        ...plotStore.plots[plotIndex],
        ...e.data,
        isLoading: false,
      };

      if (plotStore.plots[plotIndex].id === id) {
        plotStore.plots[plotIndex] = loadedPlot;
      }
    };
  }

  addSingleGeneBarPlot(accessions: string[], options: PlotlyOptions): void {
    const data = singleGeneBarData(accessions[0], options);
    const singleGeneBarPlot: GxpPlotly = {
      id: nanoid(),
      type: 'plotly',
      isLoading: false,
      accessions,
      data,
      options,
    };
    this.plots.push(singleGeneBarPlot);
  }

  addMultiGeneBarPlot(accessions: string[], options: PlotlyOptions): void {
    const data = multiGeneBarData(accessions, options);
    const multiGeneBarPlot: GxpPlotly = {
      id: nanoid(),
      type: 'plotly',
      isLoading: false,
      accessions,
      data,
      options,
    };
    this.plots.push(multiGeneBarPlot);
  }

  addSingleGeneIndividualLinesPlot(
    accessions: string[],
    options: PlotlyOptions
  ): void {
    const data = singleGeneIndividualLinesData(accessions[0], options);
    const singleGeneIndividualLines: GxpPlotly = {
      id: nanoid(),
      type: 'plotly',
      isLoading: false,
      accessions,
      data,
      options,
    };
    this.plots.push(singleGeneIndividualLines);
  }

  addMultiGeneIndividualLinesPlot(
    accessions: string[],
    options: PlotlyOptions
  ): void {
    const data = multiGeneIndividualLinesData(accessions, options);
    const multiGeneIndividualLines: GxpPlotly = {
      id: nanoid(),
      type: 'plotly',
      isLoading: false,
      accessions,
      data,
      options,
    };
    this.plots.push(multiGeneIndividualLines);
  }

  addStackedLinesPlot(accessions: string[], options: PlotlyOptions): void {
    const data = stackedLinesData(accessions, options);
    const stackedLines: GxpPlotly = {
      id: nanoid(),
      type: 'plotly',
      isLoading: false,
      accessions,
      data,
      options,
    };
    this.plots.push(stackedLines);
  }
}

export const plotStore = new PlotStore();
