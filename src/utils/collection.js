/**
 *
 * @param {string} keys array of object keys
 * @param {any} values array of object values
 */
export function objectFromArrays (keys, values) {
  return keys.reduce((object, key, index) => ({ ...object, [key]: values[index]}), {});
}