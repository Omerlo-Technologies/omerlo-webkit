import { request } from '$reader/utils/request';
import { parseMany, type ApiAssocs, type ApiData, type PagingParams } from '$reader/utils/api';

export const oauthFetchers = (f: typeof fetch) => {
  return {
    listOauthProviders: listOauthProviders(f)
  };
};

export function listOauthProviders(f: typeof fetch) {
  return (params?: Partial<PagingParams>) => {
    const opts = { queryParams: params, parser: parseMany(parseOauthProviderSummary) };
    return request(f, '/oauth-providers', opts);
  };
}

export function parseOauthProviderSummary(data: ApiData, _assocs: ApiAssocs): OauthProviderSummary {
  return {
    id: data.id,
    clientId: data.client_id,
    type: data.type,
    authenticateUrl: data.authenticate_url,
    insertedAt: data.inserted_at,
    updatedAt: data.updated_at
  };
}

export interface OauthProviderSummary {
    id: string,
    clientId: string,
    type: string,
    authenticateUrl: string,
    insertedAt: Date,
    updatedAt: Date
}
