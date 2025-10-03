import { error, type Handle, type RequestEvent, type ResolveOptions } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { ApiError } from '../utils/api';
import {
  clearAuthorizationCookies,
  getAccessTokenFromCookie,
  getApplicationToken,
  getRefreshTokenFromCookie,
  setAuthorizationCookies
} from './utils';
import { refresh } from './token';

const CACHE_MAX_AGE = env.PRIVATE_CACHE_MAX_AGE || 0;

// NOTE: inspired by https://sami.website/blog/sveltekit-api-reverse-proxy

const handleSessionApiProxy: Handle = async ({ event }) => {
  return requestApi(event);
};

const handleApiProxy: Handle = async ({ event }) => {
  event.locals.accessToken = await getApplicationToken();

  const resp = await requestApi(event);
  resp.headers.set('Cache-Control', `public, max-age=${CACHE_MAX_AGE}`);
  return resp;
};

async function requestApi(event: RequestEvent) {
  event.url.port = '';
  event.url.host = env.PRIVATE_OMERLO_HOST;
  event.url.protocol = env.PRIVATE_OMERLO_PROTOCOL;

  const accessToken = event.locals.accessToken;
  const body = event.request.body;
  const method = event.request.method;

  const headers = new Headers({
    'x-omerlo-media-id': env.PRIVATE_OMERLO_MEDIA_ID,
    Authorization: `Bearer ${accessToken}`
  });

  const contentType = event.request.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);

  return await fetch(event.url.toString(), { body, headers, method, duplex: 'half' })
    .then(async (resp) => {
      const headers = new Headers();

      const responseOpts = {
        headers: headers,
        status: resp.status,
        statusText: resp.statusText
      };

      return new Response(resp.body, responseOpts);
    })
    .catch((err) => {
      console.log('Could not proxy API request: ', err);
      error(500, 'Something went wrong');
    });
}

export const proxyHook: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/api/media/v1/session')) {
    event.url.pathname.replace('/api/media/v1/session', '/api/media/v1/');
    return handleSessionApiProxy({ event, resolve });
  }

  if (event.url.pathname.startsWith('/api/media/v1')) {
    return handleApiProxy({ event, resolve });
  }

  // TODO remove once every API will be done in Reader
  if (event.url.pathname.startsWith('/api/publisher/')) {
    const pathAfterPublisher = event.url.pathname.slice('/api/publisher/'.length);

    const resourceConfigs = {
      'media/': { idKey: env['PRIVATE_OMERLO_MEDIA_ID'], resourcePath: 'medias' },
      'organization/': {
        idKey: env['PRIVATE_OMERLO_ORGANIZATION_ID'],
        resourcePath: 'organizations'
      }
    };

    for (const [prefix, config] of Object.entries(resourceConfigs)) {
      if (pathAfterPublisher.startsWith(prefix)) {
        event.url.pathname = event.url.pathname.replace(
          `/api/publisher/${prefix}`,
          `/api/public/publisher/v2/${config.resourcePath}/${config.idKey}/`
        );

        return handleApiProxy({ event, resolve });
      }
    }

    event.url.pathname = event.url.pathname.replace('/api/publisher/', `/api/public/publisher/v2/`);
    return handleApiProxy({ event, resolve });
  }

  if (event.url.pathname.startsWith('/api/omerlo/')) {
    event.url.pathname = event.url.pathname.replace('/api/omerlo/', '/api/public/');
    return handleApiProxy({ event, resolve });
  }

  return resolve(event);
};

export const handleUserToken: Handle = async ({ event, resolve }) => {
  const accessToken = getAccessTokenFromCookie(event.cookies);
  const refreshToken = getRefreshTokenFromCookie(event.cookies);

  const opts: ResolveOptions = {
    filterSerializedResponseHeaders: (name) => name == 'x-logout'
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
      event.setHeaders({ 'x-logout': 'true' });
      clearAuthorizationCookies(event.cookies);
    }
  }

  return resolve(event);
};
