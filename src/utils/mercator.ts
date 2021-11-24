import { dataTable, infoTable } from '@/store/data-store';

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

/**
 * @param validRowName valid existing identifier of a row in the info/data table
 * @param columns array of columns to add
 * @param colIndex column index to start appending from
 */
function addMercatorColumns(
  validRowName: string,
  columns: string[],
  colIndex: number
): void {
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

/**
 *
 * @param table mercator table parsed as string
 * @param options options which columns to parse and add to the info table
 */
export function parseMercatorAndAddToInfoTable(
  table: string, // The File to be parsed as string. infoTable will be passed from the frontend
  options: { addName: boolean; addDescription: boolean } // options to add columns
): void {
  const lines = table.split('\n').map(function (line) {
    // reader.results of the read file can be parsed at infoTable point
    return line.split('\t');
  });
  const colIndex = infoTable.header.length;

  const fillLength: number =
    1 + (options.addName ? 1 : 0) + (options.addDescription ? 1 : 0);

  const geneIDIndex: { [key: string]: number } = {};
  infoTable.hasData
    ? infoTable.rowNames.forEach((row, i) => {
        geneIDIndex[row.toLowerCase()] = i;
      })
    : dataTable.rowNames.forEach((row, i) => {
        geneIDIndex[row.toLowerCase()] = i;
      });
  const rowNames = infoTable.rowNames.slice();

  infoTable.addMercatorHeaderAndPrepareColumns(
    options.addName,
    options.addDescription
  );

  lines.forEach((mcLine, i) => {
    // skip the first line
    if (i === 0) return;

    if (mcLine[0].length !== 0 && mcLine[2].length !== 0) {
      // Skip lines without a defined BINCODE
      const mcBin: string = mcLine[0].replace(/[']+/g, ''); // remove extra quotation marks
      const mcName: string = mcLine[1].replace(/[']+/g, '');
      const mcGeneId: string = mcLine[2].replace(/[']+/g, ''); // remove extra quotation marks
      const mcDescription: string = mcLine[3].replace(/[']+/g, '');
      if (mcGeneId.length !== 0) {
        const mcColumns = [mcBin];
        const validGeneIndex = geneIDIndex[mcGeneId];
        const validRowName = rowNames[validGeneIndex];

        if (options?.addName) {
          mcColumns.push(mcName);
        }
        if (options?.addDescription) {
          mcColumns.push(mcDescription);
        }
        addMercatorColumns(validRowName, mcColumns, colIndex);
      }
    }
  });

  if (infoTable.hasData) {
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
