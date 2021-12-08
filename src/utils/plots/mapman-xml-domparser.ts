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
  const bformat = blockFormat?.substr(0, 1);
  const fnumber = blockFormat?.substr(1);

  if (bformat && bformat !== 'x' && bformat !== 'y') {
    throw new Error(`unallowed blockFormat type ${bformat}`);
  } else if (bformat && bformat === 'x' && fnumber) {
    return { bformat: 'x', fnumber: parseInt(fnumber) };
  } else if (bformat && bformat === 'y' && fnumber) {
    return { bformat: 'y', fnumber: parseInt(fnumber) };
  }
  return { bformat: 'x', fnumber: 5 };
}
