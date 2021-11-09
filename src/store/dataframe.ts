import { makeAutoObservable } from 'mobx';
import { mapFromArrays } from '@/utils/collection';
import { buildTreeBranches, ArrayTree } from '@/utils/reducers';
import { isNumeric } from '@/utils/validation';
import { setToColors } from '@/utils/color';
import { mean } from 'd3';

interface DataFrameConfig {
  multiHeader: string;
}

export interface DataTable {
  header: string[];
  rows: DataRows;
}

export interface DataRows {
  [key: string]: string[];
}

interface DataRowTree {
  [key: string]: string[] | DataRowTree;
}

interface DataFrameBins {
  bin: string;
  bins: {
    bin: string;
    count: number;
  }[];
}

export class Dataframe {
  header: string[] = [];
  rows: DataRows = {};
  config: DataFrameConfig = {
    multiHeader: '',
  };

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Load the dataframe data from a `DataTable` object.
   * @param table object containing the dataframe header and rows properties
   * @param config configuration options
   */
  loadFromObject(table: DataTable, config?: DataFrameConfig): void {
    Object.assign(this.config, config);
    this.header = table.header;
    this.rows = table.rows;
  }

  /* COMPUTED PROPS */

  /**
   * Get an array of column names.
   */
  get colNames(): string[] {
    return [...this.header];
  }

  /**
   * Get an array of group names.
   */
  get groupsAsArray(): string[] {
    return Object.keys(this.headerObject);
  }

  /**
   * Get whether the dataframe contains data.
   */
  get hasData(): boolean {
    return this.colNames.length > 0;
  }

  /**
   * Get the header as a tree-like object.
   */
  get headerObject(): ArrayTree {
    const branches = Array.from(
      this.colNames.map((name) => name.split(this.config.multiHeader))
    );
    return branches.reduce(buildTreeBranches, {});
  }

  /**
   * Get an array of row names.
   */
  get rowNames(): string[] {
    return Object.keys(this.rows);
  }

  /**
   * Get an array of sample names.
   */
  get samplesAsArray(): string[] {
    const sampleSet: string[] = [];
    Object.values(this.headerObject).forEach((samples) => {
      sampleSet.push(...Object.keys(samples));
    });
    return [...new Set(sampleSet)];
  }

  get sampleGroupsAsArray(): string[] {
    const sampleSet: string[] = [];
    Object.entries(this.headerObject).forEach((entry) =>
      Object.keys(entry[1]).forEach((sample) => {
        sampleSet.push(`${entry[0]}${this.config.multiHeader}${sample}`);
      })
    );
    return [...new Set(sampleSet)];
  }

  /* ACTION QUERIES */

  /**
   * Get a single dataframe row as an array of values.
   * @param rowName unique row name
   */
  getRow(rowName: string): string[] {
    return this.rows[rowName];
  }

  getColumnValue(rowName: string, colName: string): string {
    const colIndex = this.colNames.findIndex((col) => col === colName);
    return this.rows[rowName][colIndex];
  }

  getColumn(colName: string): { [key: string]: string } {
    const colIndex = this.colNames.findIndex((col) => col === colName);
    const column: { [key: string]: string } = {};

    this.rowNames.forEach((row) => {
      column[row] = this.rows[row][colIndex];
    });
    return column;
  }
  /**
   * Get a single row as an object of key-value pairs.
   * - Each key represents the column header for a single cell value.
   * - Each value represents the value of the cell.
   *
   * @param rowName unique row name
   */
  getRowAsMap(rowName: string): Map<string, string> {
    return mapFromArrays(this.colNames, this.getRow(rowName));
  }

  /**
   * Get a row as a tree-like object where each trunk node is a multi-header
   * chunk, and the final leaf node is the row values.
   * @param rowName unique row key
   * @returns a tree-like object mapping the row to its subheaders
   */
  getRowAsTree(rowName: string): DataRowTree {
    const row = this.rows[rowName];
    return this.header.reduce((tree, column, i) => {
      const split = column.split(this.config.multiHeader);
      const group = split[0];
      const sample = split[1];
      tree[group]
        ? tree[group][sample]
          ? (tree[group][sample] as string[]).push(row[i])
          : (tree[group][sample] = [row[i]])
        : (tree[group] = { [sample]: [row[i]] });
      return tree;
    }, {} as Record<string, DataRowTree>);
  }

  /**
   * Get multiple rows from the dataframe.
   * @param {array} rowNames unique row name
   * @returns {object} returns the specified rows.
   */
  getRows(rowNames: string[]): Record<string, string[]> {
    const zipRows = (rowName: string): [string, string[]] => [
      rowName,
      this.getRow(rowName),
    ];

    const zippedRows: Record<string, string[]> = Object.fromEntries(
      rowNames.map(zipRows)
    );

    return zippedRows;
  }

  /**
   * @deprecated moved to utils/colors
   * Get an array of colors for each unique dataframe subheader.
   * - A subheader is a partial column name composed of `n` chunks.
   * - Each chunk is the corresponding part of a multiheader column name.
   *
   * Because subheaders cannot be guaranteed to be unique, matching subheaders
   * will also have matching colors.
   *
   * @param n number of chunks to use when parsing multi-headers
   * @returns an array of hexadecimal color codes
   */
  getSubheaderColors(n: number): string[] {
    // Get the subheader combinations of `n` chunks length
    const subHeaders = this.colNames.map((colName) => {
      const chunks = colName.split(this.config.multiHeader);
      return chunks.slice(0, n).join(this.config.multiHeader);
    });

    // Get a object of unique chunk to color pairs
    const colorsMap = setToColors(new Set<string>(subHeaders));

    // Assign subheader colors
    const colors = subHeaders.map((head) => colorsMap[head]);

    return colors;
  }

  /**
   * @deprecated moved to utils/store
   * Get the dataframe rows as a two-dimensional array of numeric
   * row values
   * @param filterByColumn optional subset of columns to retrieve
   * @returns the two-dimensional array of gene expression counts
   */
  toArrayOfRows(filterByColumn: string[] = []): number[][] {
    /**
     * Reduce the dataframe header to a subset of its column names.
     * @param colName name of the column
     * @param colIndex index of the column name
     * @returns a subset of the dataframe header
     */
    const filterColumns = (
      colName: string,
      colIndex: number
    ): number | undefined =>
      filterByColumn.includes(colName) ? colIndex : undefined;

    let colIndexes: number[] = [];

    if (filterByColumn.length > 0) {
      colIndexes = filterByColumn.map(filterColumns).filter(isNumeric);
    }

    /**
     * Filter count cells from a row by the computed colIndexes
     * @param count count value in a row cell
     * @param index count index in the row
     * @returns whether the cell should be included in the result
     */
    const filterCells = (count: string, index: number): boolean =>
      colIndexes.includes(index);

    /**
     * Cast the count value of a cell as a float.
     * @param count count value from the row cell in string form
     * @returns the count value casted as a float
     */
    const castToNumber = (count: string): number => parseFloat(count);

    /**
     * Convert a dataframe entry to an array of floating point numbers.
     * @param row entry to return as an array of count floats
     * @returns the row as an array of floating point numbers
     */
    const toCountsArray = (row: [string, string[]]): number[] => {
      const [, rowCounts] = row;
      let counts: string[] = rowCounts;
      if (filterByColumn && colIndexes.length > 0) {
        counts = rowCounts.filter(filterCells);
      }
      return counts.map(castToNumber);
    };

    const array2d = Object.entries(this.rows).map(toCountsArray);

    return array2d;
  }

  /**
   * @deprecated moved to utils/store
   * Get the dataframe columns as a two-dimensional array of numeric
   * column values.
   * @param filterByColumn optional subset of columns to retrieve
   * @return the two dimensional array of column expression counts
   */
  toArrayOfColumns(filterByColumn: string[] = []): number[][] {
    const arrayOfRows = this.toArrayOfRows(filterByColumn);
    const arrayOfCols = arrayOfRows[0].map((_, colIndex) =>
      arrayOfRows.map((row) => row[colIndex])
    );
    return arrayOfCols;
  }

  /**
   * Parse the dataframe as an array of either gene accession or replicate bins.
   *
   * A bin is a structure in which each gene accession (or replicate) is mapped
   * to an array of replicates (or gene accessions) and the expression count
   * for that replicate (or accession).
   *
   * Without arguments, the function returns a collection of accessions mapped
   * to replicate bins.
   *
   * If the dataframe is transposed, the resulting structure will be mapping
   * replicates to accession bins.
   *
   * - The `bin` property of each element is always the name of the accession or
   * replicate item.
   * - The `count` property always corresponds to the gene expression count for
   *   a given accession and replicate combination.
   *
   * @param transpose create replicate bins
   * @returns the gene accession or replicate bins.
   */
  toBins(transpose = false): DataFrameBins[] {
    let bins: DataFrameBins[];

    const getAccessionBins = (entry: [string, string[]]): DataFrameBins => {
      const [accessionId, replCounts] = entry;
      return {
        bin: accessionId,
        bins: replCounts.map((count, index) => ({
          bin: this.colNames[index],
          count: parseFloat(count),
        })),
      };
    };

    const getReplicateBins = (
      colName: string,
      colIndex: number
    ): DataFrameBins => {
      const accessionBins = bins.map(({ bin, bins }) => ({
        bin: bin,
        count: bins[colIndex].count,
      }));

      return {
        bin: colName,
        bins: accessionBins,
      };
    };

    bins = Object.entries(this.rows).map(getAccessionBins);
    if (transpose) bins = this.colNames.map(getReplicateBins);

    return bins;
  }

  /**
   * Get the dataframe as a string.
   * @param colSep column separator character
   * @returns the dataframe as a string
   */
  toString(colSep: string): string {
    let dataframeAsString = 'Gene-ID' + colSep;

    dataframeAsString += this.header.join(colSep);
    dataframeAsString += '\n';

    Object.keys(this.rows).forEach((rowName) => {
      dataframeAsString += rowName + colSep;
      dataframeAsString += this.rows[rowName].join(colSep);
      dataframeAsString += '\n';
    });

    return dataframeAsString;
  }

  /* ACTION MUTATIONS */

  /**
   * Add a new column to the dataframe.
   * @param colName name of the column to add
   * @param rows array of row entries
   */
  addColumn(colName: string, rows: [string, string[]]): void {
    // Append new column header
    this.header.push(colName);

    // Append cell values to each row
    rows.forEach(([rowName, cellValue]) => {
      if (!this.rows[rowName]) {
        console.warn(`${rowName} is not a known gene accession`);
        return;
      }

      this.rows[rowName].push(cellValue);
    });
  }

  /**
   * Add a new row to the dataframe.
   * @param rowName name of the row to add
   * @param row row values
   */
  addRow(rowName: string, row: string[]): void {
    this.rows[rowName] = row;
  }

  /**
   * Clear all data from the dataframe.
   */
  clearData(): void {
    this.header = [];
    this.rows = {};
  }

  /**
   * Remove columns from the dataframe.
   * @param colNames names of the columns to remove
   */
  removeColumns(...colNames: string[]): void {
    // Compose a new header array, without the matching columns
    const newCols = this.colNames.filter((name) => !colNames.includes(name));

    // Retrieve all column indexes to remove
    const colIndexes = new Set(
      this.colNames
        .map((colName, colIndex) =>
          colNames.includes(colName) ? colIndex : undefined
        )
        .filter((colIndex): colIndex is number => colIndex !== undefined)
    );

    // Compose a new rows object, without the matching columns
    const newRows = Object.fromEntries(
      Object.entries(this.rows).map(([rowName, rowValues]) => [
        rowName,
        rowValues.filter((value, index) => !colIndexes.has(index)),
      ])
    );

    this.header = newCols;
    this.rows = newRows;
  }

  /**
   *
   * @param colName name of the column that hold the MapMan Bins
   * @param separator internal column separator for the MapMan Bin column
   * @param mapmanBin Bin to filter
   * @param recursive filter bins recursivley: every child of the given bin is also true
   * @returns array of gene identifiers that are assigned to the given MapMan bin
   */
  getGenesForMapManBin(
    colName: string,
    separator: string,
    mapmanBin: string,
    recursive: boolean
  ): string[] {
    const colIndex = this.colNames.findIndex((col) => col === colName);
    return this.rowNames.filter((geneId) => {
      const bins = this.rows[geneId][colIndex].split(separator);
      const pattern = recursive
        ? new RegExp(`^${mapmanBin}`)
        : new RegExp(`^${mapmanBin}$`);

      return bins.some((bin) => pattern.test(bin));
    });
  }

  /**
   *
   * @param group group
   * @param sample sample
   * @returns The mean values for the given group*sample for every gene Id.
   */
  getMapManMeanValues(
    group: string,
    sample: string
  ): {
    [key: string]: number;
  } {
    const values: { [key: string]: number } = {};
    this.rowNames.forEach((rowName) => {
      const tree = this.getRowAsTree(rowName) as any;
      const meanVal = mean(
        tree[group][sample].map((val: string) => parseFloat(val))
      ) as number;
      values[rowName] = meanVal;
    });
    return values;
  }
}
