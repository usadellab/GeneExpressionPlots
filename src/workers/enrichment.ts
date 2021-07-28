// import { createHeatmapPlot } from '@/utils/plots/heatmap';
import { DataRow } from '@/store/dataframe';
import { EnrichmentAnalysisOptions } from '@/types/enrichment';
import { runEnrichmentAnalysis } from '@/utils/enrichment_analysis';

onmessage = async function (
  e: MessageEvent<{
    dataRows: DataRow;
    options: EnrichmentAnalysisOptions;
    TEFcolIndex: number;
    TEIcolIndex: number;
  }>
) {
  const { dataRows, TEFcolIndex, TEIcolIndex, options } = e.data;
  const workerResult = await runEnrichmentAnalysis(
    dataRows,
    options,
    TEFcolIndex,
    TEIcolIndex
  );
  postMessage(workerResult, undefined as unknown as string);
};
