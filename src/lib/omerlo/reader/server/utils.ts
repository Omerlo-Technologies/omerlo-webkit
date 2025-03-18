import type { UserSession } from "../stores/user_session";
import { useReader } from "$omerlo";
import type { Cookies } from '@sveltejs/kit';
import { getAnonymousToken, refresh, type OmerloToken } from "./token";

export async function loadUserSession(f: typeof fetch, cookies: Cookies) {
  const userSession: UserSession = { verified: false, authenticated: false, user: null };

  if (isAuthenticated(cookies)) {
    userSession.authenticated = true;

    try {
      const userInfo = await useReader(f).userInfo().then((resp) => resp.data);
      userSession.verified = true;
      userSession.user = userInfo;
    } catch(_e) {
      userSession.verified = false;
    }
  }

  return userSession;
}

export function isAuthenticated(cookies: Cookies) {
  return cookies.get('logged_in') == 'true';
}

const accessTokenCookieName = 'access_token';
const refreshTokenCookieName = 'refresh_token';

export function setAuthorizationCookies(cookies: Cookies, token: OmerloToken) {
  cookies.set('logged_in', 'true', { path: '/', httpOnly: false });
  cookies.set(accessTokenCookieName, token.accessToken, { httpOnly: true, path: '/', maxAge: token.expiresIn - 60 });
  cookies.set(refreshTokenCookieName, token.refreshToken, { httpOnly: true, path: '/' });
}

export function clearAuthorizationCookies(cookies: Cookies) {
  cookies.delete(accessTokenCookieName, { path: '/' });
  cookies.delete(refreshTokenCookieName, { path: '/' });
  cookies.delete('logged_in', { path: '/', httpOnly: false });
}

export function clearAuthorizationUsingHeader(headers: Headers) {
  headers.append('Set-Cookie', `${accessTokenCookieName}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
  headers.append('Set-Cookie', `${refreshTokenCookieName}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
  headers.append('Set-Cookie', `logged_in=; Path=/; Secure; SameSite=Lax; Max-Age=0`);
  headers.append('x-logout', `true`);
}

export function getAccessTokenFromCookie(cookies: Cookies): string | null {
  return cookies.get(accessTokenCookieName) || null;
}

export function getRefreshTokenFromCookie(cookies: Cookies): string | null {
  return cookies.get(refreshTokenCookieName) || null;
}

interface ApplicationToken {
  accessToken: string,
  refreshToken: string,
  expiredAt: number,
  init: boolean,
}

const applicationToken: ApplicationToken = {
  accessToken: '',
  refreshToken: '',
  expiredAt: 0,
  init: false,
}

/**
  * Get the token used by the application.
  */
export async function getApplicationToken(): Promise<string> {
  if (!applicationToken.init) {
    await newApplicationToken();
  } else if (applicationToken.expiredAt < new Date().getTime()) {
    await refreshApplicationToken();
  }

  return applicationToken.accessToken;
}

async function refreshApplicationToken() {
  if (!applicationToken.refreshToken) {
    throw new Error('Could not refresh the application token because the refresh token is null');
  }

  const token = await refresh(applicationToken.refreshToken);

  applicationToken.accessToken = token.accessToken;
  applicationToken.refreshToken = token.refreshToken;
  const date = new Date();
  const timestamps = date.setSeconds(date.getSeconds() + token.expiresIn - 60);
  applicationToken.expiredAt = timestamps;
}

async function newApplicationToken() {
  const token = await getAnonymousToken('application');

  applicationToken.accessToken = token.accessToken;
  applicationToken.refreshToken = token.refreshToken;
  const date = new Date();
  const timestamps = date.setSeconds(date.getSeconds() + token.expiresIn - 60);
  applicationToken.expiredAt = timestamps;
}
