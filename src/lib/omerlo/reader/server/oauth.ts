import { env } from '$env/dynamic/private';
import { ApiError } from '$reader/utils/api';
import { getApplicationToken } from './utils';

export async function verifyOauth(email: string, oauthUserId: string): Promise<void> {
  const url = getOmerloEndpoint();
  const accessToken = await getApplicationToken();

  const headers = new Headers({
    'x-omerlo-media-id': env.PRIVATE_OMERLO_MEDIA_ID,
    Authorization: `Bearer ${accessToken}`
  });

  url.pathname = '/api/media/v1/oauth/verify';
  url.searchParams.append('oauth_user_id', oauthUserId);
  url.searchParams.append('email', email);

  const resp = await fetch(url, { method: 'POST', headers });

  if (resp.ok) {
    return;
  }

  const payload = await resp.json();
  throw new ApiError(resp.status, payload.error, resp.statusText);
}

function getOmerloEndpoint() {
  return new URL(`${env.PRIVATE_OMERLO_PROTOCOL}://${env.PRIVATE_OMERLO_HOST}`);
}
