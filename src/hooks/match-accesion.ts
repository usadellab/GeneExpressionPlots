import React from 'react';
import { dataTable } from '@/store/data-store';
import { RequireExactlyOne } from 'type-fest';
interface UseMatchAccessionOptions {
  accession?: string;
  maxSize?: number;
}

type MatchAccession = (accession: string) => string[];

function useMatchAccession(): MatchAccession;
function useMatchAccession(
  options: RequireExactlyOne<UseMatchAccessionOptions, 'accession'>
): string[];
function useMatchAccession(
  options?: UseMatchAccessionOptions
): string[] | MatchAccession {
  const matchToStoreAccessions = React.useCallback((accession: string) => {
    const rowNamesSnapshot = dataTable.rowNames;
    const maxSize = 10;

    // Update the search window with the accession matching ids
    const accessionIdsView: string[] = [];

    for (let i = 0; i < rowNamesSnapshot.length; i++) {
      if (rowNamesSnapshot[i].includes(accession))
        accessionIdsView.push(rowNamesSnapshot[i]);
      if (accessionIdsView.length >= maxSize) break;
    }

    return accessionIdsView;
  }, []);

  const matches = React.useMemo(() => {
    if (options?.accession !== undefined)
      return matchToStoreAccessions(options?.accession);
  }, [matchToStoreAccessions, options?.accession]);

  return matches ?? matchToStoreAccessions;
}

export default useMatchAccession;
