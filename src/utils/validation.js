/**
 * Check whether the unknown object is:
 * - empty object
 * - empty array
 * - empty string
 * - NaN
 * @param {unknown} x unknown object
 */
export function isEmptyObject (x) {
  return typeof x === 'object' && Object.keys(x).length === 0;
}

/**
 * Check wether the array object is empty.
 * @param {any[]} array array of values
 */
export function isEmptyArray (array) {
  return array.length === 0;
}
