import type { ApiAssocs, ApiData } from '$reader/utils/api';
import { requestPublisher } from '../utils/request';

export const integrationFetchers = (f: typeof fetch) => {
  return {
    getReference: getReference(f)
  };
};

export function getReference(f: typeof fetch) {
  return async (key: string) => {
    const opts = { parser: parseReference };
    return requestPublisher(f, `/references/${key}`, opts);
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
