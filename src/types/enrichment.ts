export type TEFSelectorOption =
  | '<='
  | '>='
  | '<'
  | '>'
  | 'abs <='
  | 'abs >='
  | 'abs <'
  | 'abs >'
  | '=='
  | 'regexp';
export type TEISelectorOption = TEFSelectorOption | 'delimiter';
export type TEISelectorType = 'binary' | 'multinomial';

export interface EnrichmentAnalysisOptions {
  title: string;
  TEFcolumn: string;
  TEFselector?: TEFSelectorOption;
  TEFselectorValue?: string;
  TEIcolumn: string;
  TEIselector: TEISelectorOption;
  TEIselectorType: TEISelectorType;
  TEIselectorValue: string;
  descriptionColumn: string;
  filterGeneIds?: string[];
}

export interface EnrichmentAnalysis {
  id: string;
  data?: (string | number)[][];
  isLoading: boolean;
  options: EnrichmentAnalysisOptions;
}

export interface EnrichmentExport extends EnrichmentAnalysisOptions {
  rawData: string;
}

export type SelectorFunction = (rows: { [key: string]: string }) => string[];
