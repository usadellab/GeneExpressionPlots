import { CreatePCAargs } from '@/types/plots';
import { createPCAplot } from '@/utils/plots/pca';

onmessage = function (e: MessageEvent<CreatePCAargs>) {
  const {
    dataRows,
    srcReplicateNames,
    srcAccessionIds,
    multiHeaderSep,
    transpose,
    plotTitle,
  } = e.data;
  const workerResult = createPCAplot(
    dataRows,
    srcReplicateNames,
    srcAccessionIds,
    multiHeaderSep,
    plotTitle,
    transpose
  );
  postMessage(workerResult, undefined as unknown as string);
};
