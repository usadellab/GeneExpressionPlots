import { CreateHeatmapArgs } from '@/types/plots';
import { createHeatmapPlot } from '@/utils/plots/heatmap';

onmessage = function (e: MessageEvent<CreateHeatmapArgs>) {
  const { dataRows, srcReplicateNames, srcAccessionIds, transpose } = e.data;
  const workerResult = createHeatmapPlot(
    dataRows,
    srcReplicateNames,
    srcAccessionIds,
    transpose
  );
  postMessage(workerResult, undefined as unknown as string);
};
