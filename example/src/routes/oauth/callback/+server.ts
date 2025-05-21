import { error, redirect, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import jwt from 'jsonwebtoken';
import { exchangeAuthorizationCode, setAuthorizationCookies } from 'omerlo-webkit/reader/server';

export const GET: RequestHandler = async ({ url, cookies }) => {
  const redirectUri = url.origin + url.pathname;
  const state = getRequiredQueryParams(url, 'state');
  const code = getRequiredQueryParams(url, 'code');
  const { oauthProviderId, currentPath } = parseJwt(state);

  try {
    const token = await exchangeAuthorizationCode({ code, redirectUri, oauthProviderId });
    setAuthorizationCookies(cookies, token);
  } catch (_err) {
    error(401, 'Could not authenticate from the provider');
  }

  redirect(303, currentPath);
};

function getRequiredQueryParams(url: URL, paramsName: string): string {
  const value = url.searchParams.get(paramsName);

  if (!value) {
    error(400, `Missing ${paramsName}`);
  }

  return value;
}

interface State {
  oauthProviderId: string;
  currentPath: string;
}

function parseJwt(state: string): State {
  try {
    return jwt.verify(state, env.PRIVATE_JWT_SECRET) as State;
  } catch (_err) {
    error(400, 'Invalid state');
  }
}
