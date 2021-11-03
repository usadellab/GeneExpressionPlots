import { DataTable } from '@/store/dataframe';

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
  /* IMPLEMENTATION */
  // See for example FileReader (https://developer.mozilla.org/de/docs/Web/API/FileReader)
  // and e.g. onXTableFormSubmit() function in src/pages/data/data-files.tsx.
  // For now we are not processing files in a stream, if you find a good way to do so
  // do it.
  // Have a look at the readTable function in the parser utility that returns
  // the same object
  return {
    header: [],
    rows: {},
  };
}
