import { env } from '$env/dynamic/private';
import { ApiError, type ApiData } from '$reader/utils/api';

export interface exchangeAuthorizationCodeParams {
  code: string,
  redirectUri: string,
  oauthProviderId: string
}

/**
  * Exchange an authorization code for an omerlo's token.
  */
export async function exchangeAuthorizationCode(params: exchangeAuthorizationCodeParams) {
  const url = getTokenEndpoint();

  url.pathname = '/api/media/v1/oauth/token';
  url.searchParams.append('client_id', env.PRIVATE_OMERLO_CLIENT_ID);
  url.searchParams.append('grant_type', 'authorization_code');
  url.searchParams.append('code', params.code);
  url.searchParams.append('redirect_uri', params.redirectUri);
  url.searchParams.append('oauth_provider_id', params.oauthProviderId);

  const resp = await fetch(url, {method: 'POST'})

  if (resp.ok) {
    return await resp.json().then(parseTokenResponse);
  }

  const payload = await resp.json()
  throw new ApiError(resp.status, payload.error, resp.statusText);
}

/**
  * Refresh the user's token.
  */
export async function refresh(refreshToken: string) {
  const url = getTokenEndpoint();
  url.pathname = '/api/media/v1/oauth/token';
  url.searchParams.append('grant_type', 'refresh_token');
  url.searchParams.append('refresh_token', refreshToken);

  const resp = await fetch(url, {method: 'POST'})

  if (resp.ok) {
    return await resp.json().then(parseTokenResponse);
  }

  const payload = await resp.json()
  throw new ApiError(resp.status, payload.error, resp.statusText);
}

/**
  * Authenticate anonymously a user to get an anonymous token.
  */
export async function getAnonymousToken(scope: string) {
  const url = getTokenEndpoint();
  url.pathname = '/api/media/v1/oauth/token';
  url.searchParams.append('grant_type', 'client_credentials');
  url.searchParams.append('scope', scope);
  url.searchParams.append('client_id', env.PRIVATE_OMERLO_CLIENT_ID);
  url.searchParams.append('client_secret', env.PRIVATE_OMERLO_CLIENT_SECRET);

  const resp = await fetch(url, {method: 'POST'})

  if (resp.ok) {
    return await resp.json().then(parseTokenResponse);
  }

  const payload = await resp.json()
  throw new ApiError(resp.status, payload.error, resp.statusText);
}

function getTokenEndpoint() {
  return new URL(`${env.PRIVATE_OMERLO_PROTOCOL}://${env.PRIVATE_OMERLO_HOST}`);
}

export interface OmerloToken {
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
  tokenType: string,
}

function parseTokenResponse(data: ApiData): OmerloToken {
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    tokenType: data.token_type,
  }
}
