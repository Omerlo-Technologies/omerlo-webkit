import type { PageLoad } from './$types';

import { loadUserSession } from 'omerlo-webkit/reader/server';
import { type UserSession } from 'omerlo-webkit/reader';

export const load: PageLoad = async ({ fetch, cookies }) => {
  console.log('Request page.server.ts');
  const userSession: UserSession = await loadUserSession(fetch, cookies);

  return { userSession };
};
