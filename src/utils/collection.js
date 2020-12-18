/**
 *
 * @param {string} keys array of object keys
 * @param {any} values array of object values
 * @return {Map<string, string>|Map<string[],string>}
 */
export function mapFromArrays (keys, values) {
  return keys.reduce((map, key, index) => map.set(key, values[index]), new Map());
}

/**
 * Returns a new array range
 * @param {number} start  Number where the range should start
 * @param {number} length Amount of numbers to create (sign determines direction)
 */
export function range (start, length) {
  const sign = Math.sign(length);
  return Array.from({ length: Math.abs(length) }, (_, i) => start + (i * sign));
}
