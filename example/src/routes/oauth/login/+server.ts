import { error, redirect, type RequestHandler } from "@sveltejs/kit";
import { env } from '$env/dynamic/private';
import jwt from 'jsonwebtoken';

export const GET: RequestHandler = ({ url }) => {
  const oauthUrl = url.searchParams.get('oauthUrl');
  const oauthProviderId = url.searchParams.get('oauthProviderId');

  if (!oauthUrl) error(400, 'Missing oauthUrl query parameter');
  if (!oauthProviderId) error(400, 'Missing oauthProviderId query parameter');

  const currentPath = url.searchParams.get('currentPath') || '/';
  const state = jwt.sign({ currentPath, oauthProviderId }, env.PRIVATE_JWT_SECRET, { expiresIn: '1h' })

  const redirectUrl = new URL(oauthUrl);
  redirectUrl.searchParams.set('state', state);
  redirectUrl.searchParams.set('redirect_uri', url.origin +'/oauth/callback');

  redirect(302, redirectUrl);
}
