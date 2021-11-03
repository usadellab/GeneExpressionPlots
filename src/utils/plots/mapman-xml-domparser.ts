/**
 * DOMparser functions for xml filem types.
 *
 * Loads an xml file and to the DOMParser
 *
 */

export async function parseXmlData(xmlFile: string): Promise<Document> {
  const parser = new DOMParser();
  let xmlContent = '';
  const areaFile = await fetch(xmlFile);
  const areaText = await areaFile.text();
  return parser.parseFromString(areaText, 'application/xml');
}

export function getXmlBins(xmlParsedDoc: Document): any {
  let xmlBins: string[] = [];
  var i = 0;
  xmlParsedDoc.forEach((xmlNode) => {
    xmlBins[i] =
      xmlNode.getElementsByTagName('Identifier')[0].attributes[0].nodeValue;
    i++;
  });
  return xmlBins;
}

export function getXml_x_yCords(xmlFile: string): string[] {
  let x_y_Cords: any[] = Array.of();

  dataAreaXml.forEach((xmlNode) => {
    let x_cord = xmlNode.attributes[0].nodeValue;
    let y_cord = xmlNode.attributes[1].nodeValue;
    x_y_Cords.push({ x: x_cord, y: y_cord });
  });
  return x_y_Cords;
}

export function getXmlRecursive(xmlFile: string): any {
  let xmlContent = '';
  let xmlRecursive: boolean | string[] = Array.of();

  dataAreaXml.forEach((xmlNode) => {
    let recur =
      xmlNode.getElementsByTagName('Identifier')[0].attributes[1].nodeValue;
    xmlRecursive.push(recur);
  });
  return xmlRecursive;
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
