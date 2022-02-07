import { DataRows } from '@/store/dataframe';
import { isNumeric } from '@/utils/validation';
import { deviation, mean, transpose } from 'd3';

/**
 * Get the dataframe rows as a two-dimensional array of numeric
 * row values
 * @param filterByColumn optional subset of columns to retrieve
 * @returns the two-dimensional array of gene expression counts
 */
export function toArrayOfRows(
  rows: DataRows,
  filterByColumn: string[] = [],
  filterByRow: string[] = []
): number[][] {
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

  const filteredRowEntries: [string, string[]][] = filterByRow.map((key) => [
    key,
    rows[key],
  ]);
  const array2d = filteredRowEntries.map(toCountsArray);

  return array2d;
}

/**
 * Get the dataframe columns as a two-dimensional array of numeric
 * column values.
 * @param filterByColumn optional subset of columns to retrieve
 * @return the two dimensional array of column expression counts
 */
export function toArrayOfColumns(
  rows: DataRows,
  filterByColumn: string[] = [],
  filterByRow: string[] = []
): number[][] {
  const arrayOfRows = toArrayOfRows(rows, filterByColumn, filterByRow);
  const arrayOfCols = transpose<number>(arrayOfRows);
  return arrayOfCols;
}

/**
 * Center matrix row-wise using z-transformation: (x - mean(x)) / sd
 * @param matrix matrix to be transformed
 * @returns z-transformed matrix
 */
export function zTransformMatrix(matrix: number[][]): number[][] {
  return matrix.map((row) => {
    const rowMean = mean(row) as number;
    const rowSd = deviation(row) as number;
    if (rowSd === 0) return row;
    const zScores = row.map((val) => (val - rowMean) / rowSd);
    return zScores;
  });
}
