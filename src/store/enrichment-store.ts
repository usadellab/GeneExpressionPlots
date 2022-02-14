import { makeAutoObservable, runInAction, toJS } from 'mobx';
import {
  EnrichmentAnalysis,
  EnrichmentAnalysisOptions,
  EnrichmentExport,
} from '@/types/enrichment';
import { nanoid } from 'nanoid';
import { infoTable } from './data-store';
import { getSelectorFunction } from '@/utils/enrichment_analysis';

// Workers
import EnrichmentWorker from '@/workers/enrichment?worker';

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

  metadataToJSON(): EnrichmentExport[] | undefined {
    return this.analyses.length > 0
      ? this.analyses.map((analysis) => {
          const { options } = analysis;
          return {
            ...options,
            rawData: `enrichment_analyses/${options.title.replace(
              /\s+/g,
              '_'
            )}.txt`,
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

    // PLACEHOLDER
    const id = nanoid();
    const pendingEnrichment: EnrichmentAnalysis = {
      id,
      isLoading: true,
      options,
    };
    const enrichmentIndex = this.analyses.push(pendingEnrichment) - 1;

    // TEST ENRICHMENT FOR
    let geneIdsTEFpos = new Set<string>();
    let geneIdsTEFneg = new Set<string>();

    if (options.filterGeneIds) geneIdsTEFpos = new Set(options.filterGeneIds);
    else if (options.TEFselector && options.TEFselectorValue) {
      const TEFselectorFunction = getSelectorFunction(
        options.TEFselector,
        options.TEFselectorValue
      );
      const TEFcolumn = infoTable.getColumn(options.TEFcolumn);
      geneIdsTEFpos = new Set(TEFselectorFunction(TEFcolumn));
    }

    geneIdsTEFneg = new Set(
      Object.keys(infoTable.rows).filter((id) => !geneIdsTEFpos.has(id))
    );

    // TEST ENRICHMENT IN
    const TEIcolumn = infoTable.getColumn(options.TEIcolumn);

    const TEIdescriptions =
      options.descriptionColumn !== 'None'
        ? infoTable.getUniqueABColumnValues(
            options.TEIcolumn,
            options.descriptionColumn,
            ','
          )
        : undefined;

    // START THE WORKER THREAD
    const worker = new EnrichmentWorker();
    worker.postMessage({
      geneIdsTEFpos,
      geneIdsTEFneg,
      TEIpayload: TEIcolumn,
      TEIdescriptions,
      options,
    });

    worker.onmessage = function (e: MessageEvent<(string | number)[][]>) {
      runInAction(() => {
        const loadedEnrichment: EnrichmentAnalysis = {
          ...enrichmentStore.analyses[enrichmentIndex],
          isLoading: false,
          data: e.data,
        };

        if (enrichmentStore.analyses[enrichmentIndex].id === id) {
          enrichmentStore.analyses[enrichmentIndex] = loadedEnrichment;
        }
      });
    };
  }
}

export const enrichmentStore = new EnrichmentStore();
