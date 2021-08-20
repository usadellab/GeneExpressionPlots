import React from 'react';
import { dataTable } from '@/store/data-store';
import { RequireExactlyOne } from 'type-fest';
interface UseMatchReplicateOptions {
  replicate?: string;
  maxSize?: number;
}

type MatchReplicate = (replicate: string) => string[];

function useMatchReplicate(): MatchReplicate;
function useMatchReplicate(
  options: RequireExactlyOne<UseMatchReplicateOptions, 'replicate'>
): string[];
function useMatchReplicate(
  options?: UseMatchReplicateOptions
): string[] | MatchReplicate {
  const matchToStoreReplicates = React.useCallback((replicate: string) => {
    const colNamesSnapshot = dataTable.colNames;
    const maxSize = 10;

    // Update the search window with the accession matching ids
    const replicatesView: string[] = [];

    for (let i = 0; i < colNamesSnapshot.length; i++) {
      if (colNamesSnapshot[i].includes(replicate))
        replicatesView.push(colNamesSnapshot[i]);
      if (replicatesView.length >= maxSize) break;
    }

    return replicatesView;
  }, []);

  const matches = React.useMemo(() => {
    if (options?.replicate !== undefined)
      return matchToStoreReplicates(options?.replicate);
  }, [matchToStoreReplicates, options?.replicate]);

  return matches ?? matchToStoreReplicates;
}

export default useMatchReplicate;
