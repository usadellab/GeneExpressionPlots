import iwanthue from 'iwanthue';

export function setToColors(set: Set<string>): Record<string, string> {
  const colors = getColors(set.size);
  const values = Array.from(set.values());
  const valueColorZip = values.map((value, index) => [value, colors[index]]);
  const colorMap: Record<string, string> = Object.fromEntries(valueColorZip);
  return colorMap;
}

/**
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
export function getSubheaderColors(
  n: number,
  colNames: string[],
  multiHeader: string
): string[] {
  // Get the subheader combinations of `n` chunks length
  const subHeaders = colNames.map((colName) => {
    const chunks = colName.split(multiHeader);
    return chunks.slice(0, n).join(multiHeader);
  });

  // Get a object of unique chunk to color pairs
  const colorsMap = setToColors(new Set<string>(subHeaders));

  // Assign subheader colors
  const colors = subHeaders.map((head) => colorsMap[head]);

  return colors;
}

/**
 * Get an array of n colors
 * @param n number of colors
 * @returns array of n distinct colors
 */
export function getColors(n: number): string[] {
  const colors = n === 1 ? [iwanthue(2)[0]] : iwanthue(n);
  return colors;
}
