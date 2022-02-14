import { EnrichmentAnalysisOptions } from '@/types/enrichment';
import {
  getContingencyTables,
  runEnrichment,
} from '@/utils/enrichment_analysis';

onmessage = async function (
  e: MessageEvent<{
    geneIdsTEFpos: Set<string>;
    geneIdsTEFneg: Set<string>;
    TEIpayload: { [key: string]: string };
    TEIdescriptions?: { [key: string]: string };
    options: EnrichmentAnalysisOptions;
  }>
) {
  const { geneIdsTEFpos, geneIdsTEFneg, TEIpayload, TEIdescriptions, options } =
    e.data;
  const universe = [...geneIdsTEFpos, ...geneIdsTEFneg];
  const contingencyTables = getContingencyTables(
    universe,
    geneIdsTEFpos,
    geneIdsTEFneg,
    TEIpayload,
    options
  );
  const workerResult = await runEnrichment(contingencyTables, TEIdescriptions);
  postMessage(workerResult.sort(), undefined as unknown as string);
};
