/**
 * Check whether an unknown object is:
 * - empty object
 * - empty array
 * - empty string
 * - NaN
 * @param {unknown} x unknown object
 * @returns whether the object evaluates as `empty`.
 */
export function isEmpty(x: unknown): boolean {
  return (
    typeof x === 'object' &&
    Object.keys(x as Record<string, unknown> | unknown[] | string).length === 0
  );
}

/**
 * Check whether an unknown object is null or undefined.
 * @param x unknown object
 * @returns whether the object is null or undefined
 */
export function isNullOrUndefined(x: unknown): x is null | undefined {
  return x === null || x === undefined;
}

/**
 * Check whether an unknown object is numeric
 * @param x unknown object
 * @returns whether the object is numeric
 */
export function isNumeric(x: unknown): x is number {
  return typeof x === 'number' && !isNaN(x);
}

/**
 * Check whether a string is parseable as numeric or missing data
 * @param x string
 * @returns whether the string can be parsed as numeric or missing data
 */
export function isParsableAsNumeric(x: string): boolean {
  const naValues = [
    'na',
    'NA',
    'N/A',
    'n/a',
    null,
    NaN,
    'NaN',
    'nan',
    'null',
    '',
  ];
  return isNumeric(Number(x)) || naValues.includes(x);
}

/**
 * Checks whether a column (string[]) can be parsed as numeric
 * @param column
 * @returns whether a column can be parsed as numeric
 */
export function isNumericColumn(column: string[]): boolean {
  return column.every((x) => isParsableAsNumeric(x));
}
