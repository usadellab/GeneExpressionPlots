import { dataTable, infoTable } from '@/store/data-store';
import {
  getBlockformat,
  getCoordinates,
  getMapManBins,
  parseXmlData,
} from './mapman-xml-domparser';
import * as d3 from 'd3';

export interface GxpMapManBin {
  bincode: string;
  x: number;
  y: number;
  bformat: string;
  fnumber: number;
  geneValues: { [key: string]: number };
}

export interface GxpMapManRect {
  geneId: string;
  x: number;
  y: number;
  bin: string;
  value: number;
  xOffset: number;
  yOffset: number;
}

export interface GxpMapManStats {
  min: number;
  q1: number;
  median: number;
  mean: number;
  q3: number;
  max: number;
}

export async function createMapManArgs(
  template: string,
  infoTableColumn: string,
  infoTableColumnSep: string,
  valuesFrom: string,
  sampleGroup?: string
): Promise<{ rects: GxpMapManRect[]; stats: GxpMapManStats }> {
  const INITIALSIZE = 5;

  const [group, sample] = sampleGroup
    ? sampleGroup.split(dataTable.config.multiHeader)
    : [undefined, undefined];

  const rectValues =
    valuesFrom === 'expressionValue' && group && sample
      ? dataTable.getMapManMeanValues(group, sample)
      : infoTable.getColumn(valuesFrom);

  const xmlDocument = await parseXmlData(`mapman-templates/${template}.xml`);

  const dataAreas = xmlDocument.querySelectorAll('DataArea');

  const bins: GxpMapManBin[] = [];
  const values: number[] = [];

  const rects: GxpMapManRect[] = [];

  dataAreas.forEach((dataArea: Element) => {
    const { x, y } = getCoordinates(dataArea);
    const { bformat, fnumber } = getBlockformat(dataArea);
    const mapmanBins = getMapManBins(dataArea);
    const geneValues: { [key: string]: number } = {};

    const geneIdsArray = infoTable.getGenesForMapManBin(
      infoTableColumn,
      infoTableColumnSep,
      mapmanBins[0].id,
      mapmanBins[0].recursive
    );

    let xOffset = 0;
    let yOffset = 0;

    geneIdsArray.forEach((geneId) => {
      const value = parseFloat(rectValues[geneId] as string);
      values.push(value);
      geneValues[geneId] = value;

      const xValue =
        bformat === 'x'
          ? x + (xOffset % fnumber) * INITIALSIZE
          : x + xOffset * INITIALSIZE;
      const yValue =
        bformat === 'y'
          ? y + (yOffset % fnumber) * INITIALSIZE
          : y + yOffset * INITIALSIZE;

      rects.push({
        geneId,
        bin: mapmanBins[0].id,
        value,
        x: xValue,
        y: yValue,
        xOffset: bformat === 'x' ? xOffset % fnumber : xOffset,
        yOffset: bformat === 'y' ? yOffset % fnumber : yOffset,
      });

      bformat === 'x' ? xOffset++ : yOffset++;
      if (bformat === 'x' && xOffset != 0 && xOffset % fnumber === 0) {
        yOffset++;
      } else if (bformat === 'y' && yOffset != 0 && yOffset % fnumber === 0) {
        xOffset++;
      }
    });
    bins.push({
      bincode: mapmanBins[0].id,
      x,
      y,
      bformat,
      fnumber,
      geneValues,
    });
  });
  const min = d3.min(values) ?? 0;
  const q1 = d3.quantile(values, 0.25) ?? 0;
  const median = d3.median(values) ?? 0;
  const mean = d3.mean(values) ?? 0;
  const q3 = d3.quantile(values, 0.75) ?? 0;
  const max = d3.max(values) ?? 0;

  return {
    rects,
    stats: { min, q1, median, mean, q3, max },
  };
}
