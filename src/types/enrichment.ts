export type TEFSelectorOption = '<=' | '>=' | '<' | '>' | '==' | 'regexp';
export type TEISelectorOption = TEFSelectorOption | 'delimiter';
export type TEISelectorType = 'binary' | 'multinomial';

export interface EnrichmentAnalysisOptions {
  title: string;
  TEFcolumn: string;
  TEFselector: TEFSelectorOption;
  TEFselectorValue: string;
  TEIcolumn: string;
  TEIselector: TEISelectorOption;
  TEIselectorType: TEISelectorType;
  TEIselectorValue: string;
}

export interface EnrichmentAnalysis extends EnrichmentAnalysisOptions {
  id: string;
  data: (string | number)[][];
}

export type SelectorFunction = (
  rows: (string | number)[][]
) => (string | number)[][];
