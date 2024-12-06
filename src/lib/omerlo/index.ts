import * as publisher from './publisher';
import { languageTag } from './locale-management';
import type { ApiData, ApiResponse } from '$types/core';
import { parseAssocs } from './assocs';

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

export function parseMany<T>(parser: (data: ApiData, assocs: ApiData) => T): (entries: ApiData[]) => T[] {
  return (data: ApiData[]) => (data.map(parser))
}

// TODO refactor, we don't need to return anything from here
function parseApiResponse<T>(parser: (data: ApiData, assocs: ApiData) => T): (response: ApiData) => ApiResponse<T> {
  return (response) => {
    parseAssocs(response.assocs);

    return {
      meta: response.meta,
      data: parser(response.data, response.assocs)
    };
  };
}

export const usePublisher = publisher.fetchers;

