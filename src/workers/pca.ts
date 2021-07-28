import { DataRows } from '@/store/dataframe';
import pcaData from '@/utils/plots/pca';

onmessage = function (
  e: MessageEvent<{
    dataRows: DataRows;
    srcReplicateNames: string[];
    multiHeaderSep: string;
    plotTitle?: string;
  }>
) {
  const { dataRows, srcReplicateNames, multiHeaderSep, plotTitle } = e.data;
  const workerResult = pcaData(
    dataRows,
    srcReplicateNames,
    multiHeaderSep,
    plotTitle
  );
  postMessage(workerResult, undefined as unknown as string);
};
