import { env } from '$env/dynamic/private';
import { ApiError } from '$reader/utils/api';
import { getApplicationToken } from "./utils"

export interface EmailParams {
  context: 'platform' | 'media',
  to: string,
  subject: string,
  body: string
}

/**
  * Send an email.
  *
  * Return `true` if the email has been sent. It could take a couple of minutes to be received.
  */
export async function sendEmail(params: EmailParams) {
  const url = getOmerloEndpoint();
  const accessToken = await getApplicationToken();

  const headers = new Headers({
    'x-omerlo-media-id': env.PRIVATE_OMERLO_MEDIA_ID,
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'text/html'
  });

  url.pathname = '/api/media/v1/mail/send';
  url.searchParams.append('context', params.context);
  url.searchParams.append('to', params.to);
  url.searchParams.append('subject', params.subject);

  const resp = await fetch(url, { method: 'POST', headers, body: params.body });

  if (resp.ok) {
    return Promise.resolve(true);
  }

  const payload = await resp.json();
  throw new ApiError(resp.status, payload.error, resp.statusText);
}

function getOmerloEndpoint() {
  return new URL(`${env.PRIVATE_OMERLO_PROTOCOL}://${env.PRIVATE_OMERLO_HOST}`);
}

