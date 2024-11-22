import { languageTag } from '$lib/locales';
import usePublisher from '$lib/omerlo/publisher';
import type { ApiData, ApiResponse } from '$types/core';

type FetchOptions<T> = {
  parser?: (data: ApiData) => T;
  params?: Record<string, string | number | boolean>;
}

export async function omerloFetch<T>(f: typeof fetch, url: string, opts: FetchOptions<T>): Promise<ApiResponse<T>> {
  const locale = languageTag();
  const parsedUrl = new URL(url)
  parsedUrl.searchParams.append("locale", locale);

  if (opts.params) {
    Object.entries(opts.params).forEach(([key, value]) => {
      parsedUrl.searchParams.append(key, String(value));
    });
  }

  const parser = opts.parser || ((data) => data)

  const req = await f(parsedUrl.toString());
  return req.json().then(parseApiResponse(parser));
}

export function parseMany<T>(parser: (data: ApiData) => T): (entries: ApiData[]) => T[] {
  return (entries: ApiData[]) => (entries.map(parser))
}

function parseApiResponse<T>(parser: (data: ApiData) => T): (response: ApiData) => ApiResponse<T> {
  return (response) => ({
    assocs: response.assocs,
    meta: response.meta,
    entries: parser(response.data)
  });
}

export { usePublisher }

