import { DataTable } from '@/store/dataframe';
import { ArrowModifier } from '@popperjs/core/lib/modifiers/arrow';
import { values } from 'mobx';
import { unescapeDelimiters } from './string';

export async function readFile(
  file: Blob
): Promise<string | ArrayBuffer | null> {
  const reader = new FileReader();
  reader.readAsText(file);

  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
  });
}

interface ParserOptions {
  fieldSeparator: string;
  rowNameColumn: number;
}

export function readTable(
  table: string,
  options: ParserOptions
): {
  header: string[];
  rows: { [key: string]: string[] };
} {
  const lines = table.split(/\r?\n|\r/);

  // Extract the table header (first element of lines is removed)
  const headerLine = lines.splice(0, 1)[0];
  const header = headerLine
    .split(options.fieldSeparator)
    .reduce((array, field, index) => {
      if (index === options.rowNameColumn) return array;
      array.push(field);
      return array;
    }, [] as string[]);

  // Parse each line as an object of unique row names
  const rows = lines.reduce<{ [key: string]: string[] }>((acc, line) => {
    // Skip empty lines
    if (!line) return acc;

    // Split the line into separate cell values
    const cellValues = line.split(options.fieldSeparator);

    // Extract the value that will serve as the row header
    const rowHeader = cellValues.splice(options.rowNameColumn, 1)[0];

    // Map the row header to its cell values
    return Object.assign(acc, { [rowHeader]: cellValues });
  }, {});

  return {
    header,
    rows,
  };
}

export function parseEnrichmentData(
  table: string,
  fieldSeparator: string
): (string | number)[][] {
  const lines = table.split(/\r?\n|\r/);
  // remove header line
  lines.splice(0, 1)[0];

  return lines.reduce<(string | number)[][]>((acc, line: string) => {
    if (!line) return acc;
    const cellValues = line.split(fieldSeparator);
    acc.push(cellValues);
    return acc;
  }, []);
}

export function parseMercator(
  table: string, // The File to be parsed as string. This will be passed from the frontend
  options?: { addName: boolean; addDescription: boolean } // options to add columns
): DataTable {
  const mercator_data: any = {};
  const header: any = [];
  const lines = table.split('\n').map(function (line) {
    // reader.results of the read file can be parsed at this point
    return line.split('\t');
  });

  lines.forEach((line) => {
    if (line[0] === 'BINCODE') {
      header.push(line[0]);
    } else {
      if (line[0].length !== 0) {
        let bins: string = line[0].replace(/[']+/g, ''); // remove extra quotation marks
        let ids: string = line[2].replace(/[']+/g, ''); // remove extra quotation marks

        if (!(ids in mercator_data)) {
          mercator_data[ids] = [];
        }
        mercator_data[ids].push(bins);
      }
    }
  });
  delete mercator_data['']; // remove bins that don't have gene identification

  return {
    header: header,
    rows: mercator_data,
  };
}
