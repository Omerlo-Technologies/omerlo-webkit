import type { PageLoad } from './$types';
import { useReader } from 'omerlo-webkit';

export const load: PageLoad = async ({ fetch }) => {
  const oauthProviders = await useReader(fetch).listOauthProviders();
  return { oauthProviders };
};
