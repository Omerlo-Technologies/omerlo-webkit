import { error, type Handle, type ResolveOptions } from "@sveltejs/kit";
import { env } from '$env/dynamic/private';
import { ApiError } from "../utils/api";
import { clearAuthorizationCookies, clearAuthorizationUsingHeader, getAccessTokenFromCookie, getApplicationToken, getRefreshTokenFromCookie, setAuthorizationCookies } from "./utils";
import { refresh } from "./token";

// NOTE: inspired by https://sami.website/blog/sveltekit-api-reverse-proxy

const handleApiProxy: Handle = async ({ event, ...tail }) => {
  event.url.host = env.PRIVATE_OMERLO_HOST;
  event.url.protocol = env.PRIVATE_OMERLO_PROTOCOL
  event.request.headers.delete('cookie');
  event.request.headers.set('x-omerlo-media-id', env.PRIVATE_OMERLO_MEDIA_ID);

  let accessToken = event.locals.accessToken;

  if (!accessToken) {
    accessToken = await getApplicationToken();
  }

  event.request.headers.set('Authorization', `Bearer ${accessToken}`);

  return await fetch(event.url.toString(), {
    body: event.request.body,
    method: event.request.method,
    headers: event.request.headers,
    duplex: 'half'
  })
  .then(async (resp) => {
    const headers = new Headers();

    if (resp.status === 401 && event.locals.accessToken) {
      clearAuthorizationUsingHeader(headers);
      event.locals.accessToken = undefined;
      resp = await handleApiProxy({ event, ...tail })
    }

    const responseOpts = {
      headers: headers,
      status: resp.status,
      statusText: resp.statusText,
    };

    return new Response(resp.body, responseOpts)
  })
  .catch((err) => {
    console.log("Could not proxy API request: ", err);
    error(500, 'Something went wrong');
  });
};

export const proxyHook: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/api/media/v1')) {
    return await handleApiProxy({ event, resolve });
  }

  return resolve(event);
}

export const handleUserToken: Handle = async ({ event, resolve }) => {
  const accessToken = getAccessTokenFromCookie(event.cookies);
  const refreshToken = getRefreshTokenFromCookie(event.cookies);

  const opts: ResolveOptions = {
    filterSerializedResponseHeaders: (name) => name == 'x-logout',
  };

  if (accessToken) {
    event.locals.accessToken = accessToken;
    return resolve(event, opts);
  }

  if (!refreshToken) {
    return resolve(event, opts);
  }

  try {
    const token = await refresh(refreshToken);
    setAuthorizationCookies(event.cookies, token);
    event.locals.accessToken = token.accessToken;
  } catch (err) {
    if (err instanceof ApiError && err.status == 401) {
      event.setHeaders({'x-logout': 'true'});
      clearAuthorizationCookies(event.cookies);
    }
  }

  return resolve(event);
}
