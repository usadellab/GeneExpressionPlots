import iwanthue from 'iwanthue';

export function setToColors(set: Set<string>): Record<string, string> {
  const colors = iwanthue(set.size);
  const values = Array.from(set.values());
  const valueColorZip = values.map((value, index) => [value, colors[index]]);
  const colorMap: Record<string, string> = Object.fromEntries(valueColorZip);
  return colorMap;
}
