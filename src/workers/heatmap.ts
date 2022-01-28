import { CreateHeatmapArgs } from '@/types/plots';
import { createHeatmapPlot } from '@/utils/plots/heatmap';

onmessage = function (e: MessageEvent<CreateHeatmapArgs>) {
  const {
    dataRows,
    distanceMethod,
    srcReplicateNames,
    srcAccessionIds,
    zTransform,
    transpose,
  } = e.data;
  const workerResult = createHeatmapPlot(
    dataRows,
    distanceMethod,
    srcReplicateNames,
    srcAccessionIds,
    zTransform,
    transpose
  );
  postMessage(workerResult, undefined as unknown as string);
};
