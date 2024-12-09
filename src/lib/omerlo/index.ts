import * as Api from './api';
import { languageTag } from './locale-management';
import type { ApiData, ApiResponse } from '$types/core';
import { parseAssocs, type ApiAssocs } from './assocs';
import type { ApiParams } from './fetcher-params';

type FetchOptions<T> = {
  parser?: (data: ApiData, assocs: ApiAssocs) => T;
  params?: Partial<ApiParams>
}

export async function omerloFetch<T>(f: typeof fetch, url: string, opts: FetchOptions<T>): Promise<ApiResponse<T>> {
  const locale = languageTag();
  const parsedUrl = new URL(url);
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

export function parseMany<T>(parser: (data: ApiData, assocs: ApiAssocs) => T): (response: ApiData[], assocs: ApiAssocs) => T[] {
  return (response: ApiData[], assocs: ApiAssocs) => {
    return response.map((data) => parser(data, assocs));
  };
}

function parseApiResponse<T>(parser: (data: ApiData, assocs: ApiAssocs) => T): (response: ApiData) => ApiResponse<T> {
  return (response) => {
    parseAssocs(response.assocs);

    return {
      meta: response.meta,
      data: parser(response.data, response.assocs)
    };
  };
}

export const useOmerlo = Api.fetchers;

