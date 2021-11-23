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

export function isNumeric(x: unknown): x is number {
  return typeof x === 'number' && !isNaN(x);
}

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
