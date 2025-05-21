import type { ApiAssocs, ApiData } from '$reader/utils/api';
import { request } from '$reader/utils/request';

export const accountsFetchers = (f: typeof fetch) => {
  return {
    userInfo: getUserInfo(f),
    verifyAccount: verifyAccount(f),
    validateAccount: validateAccount(f)
  };
};

export interface ValidateAccountParams {
  email: string;
  callbackUrl: string;
}

//
// Validate an account using the bearer token.
//
export function validateAccount(f: typeof fetch) {
  return (params: ValidateAccountParams) => {
    const queryParams = { email: params.email, callback_url: params.callbackUrl };
    const opts = { queryParams, method: 'post' as const };
    request(f, '/account/validate', opts);
  };
}

export interface VerifyAccountParams {
  verification_token: string;
}

//
// Verify an account using the signed JWT token generate on account validation.
//
export function verifyAccount(f: typeof fetch) {
  return (params: VerifyAccountParams) => {
    const opts = { queryParams: params };
    request(f, '/account/verify', opts);
  };
}

//
// Get user's informations associated to the bearer token.
//
export function getUserInfo(f: typeof fetch) {
  return async () => {
    const opts = { parser: parseUserInfo };
    return request(f, '/account/me', opts);
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
