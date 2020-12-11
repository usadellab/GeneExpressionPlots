/**
 * Asynchronously fetch a file from the /static assets folder.
 * @typedef  {Object} FetchResource
 * @property {string} type the body method that should be used to read the file
 *
 * @param {string} file path to static file
 * @param {RequestInit & FetchResource} options options object
 */
export async function fetchResource (file, options) {

  const logError = (error) => console.error(error);

  const response = await fetch(file, options).catch(logError);
  if (!response || !response.ok) {
    console.error(`Failed loading ${file}`);
    return;
  }

  let payload = null;
  try {
    if      (options.type === 'blob') payload = await response.blob();
    else if (options.type === 'json') payload = await response.json();
    else if (options.type === 'text') payload = await response.text();
    else    throw new Error(`Unsupported read method for ${file}`);
  } catch (error) {
    console.error(error);
  }

  if (!payload)
    console.error(`Failed reading ${file}`);

  return payload;
}
