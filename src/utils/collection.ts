/**
 * Create a new type map from a given set of keys and values.
 * @param keys indexing type of the map object
 * @param values string values to map
 * @returns a map object indexed by a given object type
 */
export function mapFromArrays<T>(keys: T[], values: string[]): Map<T, string> {
  const typeMap = keys.reduce((map, key, index) => {
    map.set(key, values[index]);
    return map;
  }, new Map<T, string>());

  return typeMap;
}

/* Non-zero type validation for "length" argument */
type NotZero<T extends number> = T extends 0 ? never : number;

/**
 * Returns a new array range
 * @param start  Number where the range should start
 * @param length Amount of numbers to create (sign determines direction)
 */
export function range<
  T extends number,
  U extends NotZero<P>,
  P extends number = U
>(start: T, length: U): number[] {
  const sign = Math.sign(length);
  return Array.from({ length: Math.abs(length) }, (_, i) => start + i * sign);
}
