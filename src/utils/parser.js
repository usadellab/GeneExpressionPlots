export async function readFile(file) {
  const reader = new FileReader();
  reader.readAsText(file);

  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
  });
}

/**
 * Parse a tabular file to its in-memory object representation.
 *
 * @typedef  {Object}  ReadTableOptions Options object for the expression table parser
 * @property {string?}  headerSeparator delimiter for multi-header support
 * @property {string}    fieldSeparator delimiter for each column field
 * @property {number}     rowNameColumn column used for row names (values must be unique)
 *
 * @param {string} table table as a single string
 * @param {ReadTableOptions} options parser options
 */
export function readTable(table, options) {
  const lines = table.split(/\r?\n|\r/);

  // Extract the table header (first element of lines is removed)
  const header = lines
    .shift()
    .split(options.fieldSeparator)
    .reduce((array, field, index) => {
      if (index === options.rowNameColumn) return array;
      if (options.headerSeparator) field = field.split(options.headerSeparator);
      array.push(field);
      return array;
    }, []);

  // Parse each line as an object of unique row names
  const rows = lines.reduce((acc, line) => {
    if (!line) return acc;

    const values = line.split(options.fieldSeparator);
    const key = values.splice(options.rowNameColumn, 1);
    return Object.assign(acc, { [key]: values });
  }, {});

  return {
    header,
    rows,
  };
}
