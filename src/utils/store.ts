import { DataRow } from '@/store/dataframe';
import { isNumeric } from '@/utils/validation';

/**
 * Get the dataframe rows as a two-dimensional array of numeric
 * row values
 * @param filterByColumn optional subset of columns to retrieve
 * @returns the two-dimensional array of gene expression counts
 */
export function toArrayOfRows(
  rows: DataRow,
  filterByColumn: string[] = []
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

  const array2d = Object.entries(rows).map(toCountsArray);

  return array2d;
}

/**
 * Get the dataframe columns as a two-dimensional array of numeric
 * column values.
 * @param filterByColumn optional subset of columns to retrieve
 * @return the two dimensional array of column expression counts
 */
export function toArrayOfColumns(
  rows: DataRow,
  filterByColumn: string[] = []
): number[][] {
  const arrayOfRows = toArrayOfRows(rows, filterByColumn);
  const arrayOfCols = arrayOfRows[0].map((_, colIndex) =>
    arrayOfRows.map((row) => row[colIndex])
  );
  return arrayOfCols;
}
