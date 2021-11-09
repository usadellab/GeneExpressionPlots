/**
 * DOMparser functions for xml filem types.
 */

export async function parseXmlData(xmlFile: string): Promise<Document> {
  const parser = new DOMParser();
  const areaFile = await fetch(xmlFile);
  const areaText = await areaFile.text();
  return parser.parseFromString(areaText, 'application/xml');
}

export function getCoordinates(dataArea: Element): {
  x: number;
  y: number;
} {
  const x = dataArea.attributes.getNamedItem('x')?.nodeValue;
  const y = dataArea.attributes.getNamedItem('y')?.nodeValue;

  if (!x || !y) {
    throw new Error('Missing coordinates in DataArea');
  }

  return { x: parseInt(x), y: parseInt(y) };
}

export function getMapManBins(
  dataArea: Element
): { id: string; recursive: boolean }[] {
  const bins = [];

  const xmlBins = dataArea.getElementsByTagName('Identifier');

  for (let i = 0; i < xmlBins.length; i++) {
    const id = xmlBins[i].attributes.getNamedItem('id')?.nodeValue;
    const recursive =
      xmlBins[i].attributes.getNamedItem('recursive')?.nodeValue;

    if (!id || !recursive) {
      throw new Error('Missing attribues in Identifier');
    }
    bins.push({ id, recursive: JSON.parse(recursive) });
  }
  return bins;
}

export function getBlockformat(dataArea: Element): {
  bformat: 'x' | 'y';
  fnumber: number;
} {
  const blockFormat =
    dataArea.attributes.getNamedItem('blockFormat')?.nodeValue;
  const formatSplit = blockFormat?.split('');

  if (formatSplit && formatSplit[0] !== 'x' && formatSplit[0] !== 'y') {
    throw new Error(`unallowed blockFormat type ${formatSplit[0]}`);
  } else if (formatSplit && formatSplit[0] === 'x') {
    return { bformat: 'x', fnumber: parseInt(formatSplit[1]) };
  } else if (formatSplit && formatSplit[0] === 'y') {
    return { bformat: 'y', fnumber: parseInt(formatSplit[1]) };
  }
  return { bformat: 'x', fnumber: 5 };
}
