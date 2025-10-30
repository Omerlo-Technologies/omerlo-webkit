import { parseMany, type ApiAssocs, type ApiData } from '$reader/utils/api';
import { request } from '$reader/utils/request';

export const accountsFetchers = (f: typeof fetch) => {
  return {
    userInfo: getUserInfo(f),
    userEntitlements: getUserEntitlements(f)
  };
};

//
// Get user's informations associated to the bearer token.
//
export function getUserInfo(f: typeof fetch) {
  return async () => {
    const opts = { parser: parseUserInfo };
    return request(f, '/session/account/me', opts);
  };
}

export interface UserInfo {
  name: string;
  email: string;
}

function parseUserInfo(data: ApiData, _assoc: ApiAssocs): UserInfo {
  return {
    name: data.name,
    email: data.email
  };
}

//
// Get user's entitlements associated to the bearer token (Platform).
//
export function getUserEntitlements(f: typeof fetch) {
  return async () => {
    const opts = { parser: parseMany(parseUserEntitlement) };
    return request(f, '/session/account/me/entitlements', opts);
  };
}

export interface UserEntitlement {
  id: string;
  feature_key: string;
}

function parseUserEntitlement(data: ApiData, _assoc: ApiAssocs): UserEntitlement {
  return {
    id: data.id,
    feature_key: data.feature_key
  };
}
