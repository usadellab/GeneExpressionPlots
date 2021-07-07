/**
 * Fetch a statically served resource and parse it a Blob.
 * @param resource resource to fetch
 * @param type resource conversion type
 * @param init request options
 * @returns the fetched resource
 */
export async function fetchResource(
  resource: string,
  type: 'blob',
  init?: RequestInit
): Promise<Blob>;

/**
 * Fetch a statically served resource and parse it as JSON.
 * @param resource resource to fetch
 * @param type resource conversion type
 * @param init request options
 * @returns the fetched resource
 */
export async function fetchResource<T = Record<string, unknown>>(
  resource: string,
  type: 'json',
  init?: RequestInit
): Promise<T>;

/**
 * Fetch a statically served resource and parse it as text or url.
 * @param resource resource to fetch
 * @param type resource conversion type
 * @param init request options
 * @returns the fetched resource
 */
export async function fetchResource(
  resource: string,
  type: 'text' | 'url',
  init?: RequestInit
): Promise<string>;

export async function fetchResource<T = Record<string, unknown>>(
  resource: string,
  type: 'blob' | 'json' | 'text' | 'url',
  init?: RequestInit
): Promise<Blob | T | string> {
  const response = await fetch(resource, init);

  if (!response || !response.ok) {
    throw new Error(
      `Fetching resource "${resource}" failed` +
        ` with status "${response.status}: ${response.statusText}"`
    );
  }

  switch (type) {
    case 'blob':
      return (await response.blob()) as Blob;

    case 'json':
      return (await response.json()) as T;

    case 'text':
      return (await response.text()) as string;

    case 'url':
      return response.url;

    default:
      throw new Error(`Unsupported read method for ${resource}`);
  }
}
