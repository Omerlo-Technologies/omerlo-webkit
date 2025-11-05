import type { ApiAssocs, ApiData, ApiParams } from '$reader/utils/api';
import { requestOmerlo } from '../utils/request';

export const integrationFetchers = (f: typeof fetch) => {
  return {
    getReference: getReference(f)
  };
};

export function getReference(f: typeof fetch) {
  return async (key: string, params?: Partial<ApiParams>) => {
    const opts = { parser: parseReference, queryParams: params };
    return requestOmerlo(f, `/core/v2/references/${key}`, opts);
  };
}

export interface Reference {
  id: string;
  provider: string;
  urn: string;
}

export function parseReference(data: ApiData, _assocs: ApiAssocs): Reference {
  return {
    id: data.id,
    provider: data.provider,
    urn: data.urn
  };
}
