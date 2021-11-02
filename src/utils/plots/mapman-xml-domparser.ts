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
