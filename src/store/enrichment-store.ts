import { makeAutoObservable, toJS } from 'mobx';
import {
  EnrichmentAnalysis,
  EnrichmentAnalysisOptions,
} from '@/types/enrichment';
import { nanoid } from 'nanoid';
import { infoTable } from './data-store';

// Workers
import EnrichmentWorker from '@/workers/enrichment?worker&inline';

class EnrichmentStore {
  analyses: EnrichmentAnalysis[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  getAnalysisById(id: string): EnrichmentAnalysis | undefined {
    return this.analyses.find((analysis) => analysis.id === id);
  }

  /**
   * Clear the analyses array in the store.
   */
  clearAnalyses(): void {
    this.analyses = [];
  }

  /**
   * Remove a single anaylsis from the store.
   * @param id analysis id
   */
  deleteAnalysis(id: string): void {
    const index = this.analyses.findIndex((analysis) => analysis.id === id);
    if (index > -1) {
      this.analyses.splice(index, 1);
    }
  }

  addAnalysis(analysis: EnrichmentAnalysis): void {
    this.analyses.push(analysis);
  }

  addEnrichmentAnalysis(options: EnrichmentAnalysisOptions): void {
    const id = nanoid();
    const pendingEnrichment: EnrichmentAnalysis = {
      id,
      isLoading: true,
      options,
    };

    const enrichmentIndex = this.analyses.push(pendingEnrichment) - 1;

    const TEFcolIndex =
      infoTable.colNames.findIndex((col) => col === options.TEFcolumn) + 1;
    const TEIcolIndex =
      infoTable.colNames.findIndex((col) => col === options.TEIcolumn) + 1;

    const data = {
      dataRows: toJS(infoTable.rows),
      TEFcolIndex,
      TEIcolIndex,
      options,
    };
    const worker = new EnrichmentWorker();
    worker.postMessage(data);

    worker.onmessage = function (e: MessageEvent<(string | number)[][]>) {
      const loadedEnrichment: EnrichmentAnalysis = {
        ...enrichmentStore.analyses[enrichmentIndex],
        isLoading: false,
        data: e.data,
      };

      if (enrichmentStore.analyses[enrichmentIndex].id === id) {
        enrichmentStore.analyses[enrichmentIndex] = loadedEnrichment;
      }
    };
  }
}

export const enrichmentStore = new EnrichmentStore();
