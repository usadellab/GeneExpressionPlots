/**
 * Fetch a statically served resource and parse it a Blob.
 * @param file public resource to fetch
 * @param type resource conversion type
 * @param init request options
 * @returns the fetched resource
 */
export async function fetchResource(
  file: string,
  type: 'blob'
): Promise<Blob | undefined>;

/**
 * Fetch a statically served resource and parse it as JSON.
 * @param file public resource to fetch
 * @param type resource conversion type
 * @param init request options
 * @returns the fetched resource
 */
export async function fetchResource(
  file: string,
  type: 'json'
): Promise<Record<string, unknown> | undefined>;

/**
 * Fetch a statically served resource and parse it as text or url.
 * @param file public resource to fetch
 * @param type resource conversion type
 * @param init request options
 * @returns the fetched resource
 */
export async function fetchResource(
  file: string,
  type: 'text' | 'url'
): Promise<string | undefined>;

export async function fetchResource(
  file: string,
  type: 'blob' | 'json' | 'text' | 'url',
  init?: RequestInit
): Promise<Blob | Record<string, unknown> | string | undefined> {
  const response = await fetch(file, init);

  if (!response || !response.ok) {
    console.error(`Failed loading ${file}`);
    return;
  }

  switch (type) {
    case 'blob':
      return (await response.blob()) as Blob;

    case 'json':
      return (await response.json()) as Record<string, unknown>;

    case 'text':
      return (await response.text()) as string;

    case 'url':
      return response.url;

    default:
      throw new Error(`Unsupported read method for ${file}`);
  }
}
