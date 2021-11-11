import { infoTable, dataTable } from '@/store/data-store';

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

/**
 * Sanity check to validate if the expected Mercator headers are present
 * @param table
 */
export function validateMercator(headerLine: string): boolean {
  const header = headerLine.split('\t');
  if (
    header[0] === 'BINCODE' &&
    header[1] === 'NAME' &&
    header[2] === 'IDENTIFIER' &&
    header[3] === 'DESCRIPTION' &&
    header[4] === 'TYPE'
  )
    return true;

  return false;
}

function addMercatorColumns(
  rowName: string,
  columns: string[],
  colIndex: number,
  isEmptyInfoTable: boolean
): void {
  // check if infoTable has data and find the matching gene
  const validRowName = isEmptyInfoTable
    ? infoTable.rowNames.find((row) => row.toLowerCase() === rowName)
    : dataTable.rowNames.find((row) => row.toLowerCase() === rowName);

  if (validRowName) {
    if (!Array.isArray(infoTable.rows[validRowName]))
      infoTable.rows[validRowName] = [];
    if (infoTable.rows[validRowName].length <= colIndex)
      infoTable.rows[validRowName].push(...columns);
    else {
      for (let i = colIndex; i < columns.length + colIndex; i++) {
        infoTable.rows[validRowName][i] += `,${columns[i - colIndex]}`;
      }
    }
  }
}

export function parseMercatorAndAddToInfoTable(
  table: string, // The File to be parsed as string. infoTable will be passed from the frontend
  options: { addName: boolean; addDescription: boolean } // options to add columns
): void {
  const lines = table.split('\n').map(function (line) {
    // reader.results of the read file can be parsed at infoTable point
    return line.split('\t');
  });
  const colIndex = infoTable.header.length;

  const infoTableHasData = infoTable.hasData;
  const fillLength: number =
    1 + (options.addName ? 1 : 0) + (options.addDescription ? 1 : 0);

  infoTable.addMercatorHeaderAndPrepareColumns(
    options.addName,
    options.addDescription
  );

  lines.forEach((mcLine, i) => {
    // skip the first line
    if (i === 0) return;

    if (mcLine[0].length !== 0) {
      // Skip lines without a defined BINCODE
      const mcBin: string = mcLine[0].replace(/[']+/g, ''); // remove extra quotation marks
      const mcName: string = mcLine[1].replace(/[']+/g, '');
      const mcGeneId: string = mcLine[2].replace(/[']+/g, ''); // remove extra quotation marks
      const mcDescription: string = mcLine[3].replace(/[']+/g, '');
      if (mcGeneId.length !== 0) {
        const mcColumns = [mcBin];

        if (options?.addName) {
          mcColumns.push(mcName);
        }
        if (options?.addDescription) {
          mcColumns.push(mcDescription);
        }
        addMercatorColumns(mcGeneId, mcColumns, colIndex, infoTableHasData);
      }
    }
  });

  if (infoTableHasData) {
    infoTable.rowNames.forEach((rowName) => {
      if (infoTable.rows[rowName].length < infoTable.header.length) {
        const lengthDiff =
          infoTable.header.length - infoTable.rows[rowName].length;
        infoTable.rows[rowName].push(...Array(lengthDiff).fill(''));
      }
    });
  } else {
    dataTable.rowNames.forEach((rowName) => {
      if (!infoTable.rows[rowName]) {
        infoTable.rows[rowName] = Array(fillLength).fill('');
      }
    });
  }
}
