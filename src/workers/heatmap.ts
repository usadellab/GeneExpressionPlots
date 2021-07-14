import { DataRow } from '@/store/dataframe';
import { createHeatmapPlot } from '@/utils/plots/heatmap';

onmessage = function (
  e: MessageEvent<{ dataRows: DataRow; srcReplicateNames: string[] }>
) {
  const { dataRows, srcReplicateNames } = e.data;
  const workerResult = createHeatmapPlot(dataRows, srcReplicateNames);
  postMessage(workerResult, undefined as unknown as string);
};
