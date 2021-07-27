import { makeAutoObservable, toJS } from 'mobx';
import {
  EnrichmentAnalysis,
  EnrichmentAnalysisOptions,
  EnrichmentExport,
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

  addRawEnrichmentAnalysis(analysis: EnrichmentAnalysis): void {
    this.analyses.push(analysis);
  }

  toJSON(): EnrichmentExport[] | undefined {
    return this.analyses.length > 0
      ? this.analyses.map((analysis) => {
          const { options } = analysis;
          return {
            ...options,
            raw_data: `${options.title.replace(/\s+/g, '_')}.txt`,
          };
        })
      : undefined;
  }

  dataToCSV(analysis: EnrichmentAnalysis, delimiter: string): string {
    const header = `Test Entry${delimiter}p_Value${delimiter}adjusted p_Value\n`;
    const data = analysis.data?.map((row) => row.join(delimiter));
    return header + data?.join('\n');
  }

  addEnrichmentAnalysis(options: EnrichmentAnalysisOptions): void {
    if (
      this.analyses.findIndex(
        (analysis) => analysis.options.title === options.title
      ) != -1
    ) {
      throw new Error(
        `Analysis with title ${options.title} already exists. Please select a unique name.`
      );
    }

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
