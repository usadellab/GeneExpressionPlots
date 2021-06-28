import iwanthue from 'iwanthue';

export function setToColors(set: Set<string>): Record<string, string> {
  const colors = iwanthue(set.size);
  const colorMap: Record<string, string> = Object.fromEntries([
    [...set.values()],
    colors,
  ]);
  return colorMap;
}
