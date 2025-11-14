import type { LayoutServerLoad } from './$types';

import { loadUserSession } from 'omerlo-webkit/reader/server';
import { type UserSession } from 'omerlo-webkit/reader';

export const load: LayoutServerLoad = async ({ fetch, cookies }) => {
  const userSession: UserSession = await loadUserSession(fetch, cookies);
  return { userSession };
};
