import type { PageLoad } from './$types';
import { useReader } from 'omerlo-webkit';

export const load: PageLoad = async ({ fetch }) => {
  const oauthProviders = await useReader(fetch).listOauthProviders();
  const mediaBlocks = await useReader(fetch).listMediaBlocks('events', { limit: 1 });
  const mediaBlock1 = await useReader(fetch).listMediaBlocks('people', { limit: 1 });
  const mediaBlock2 = await useReader(fetch).listMediaBlocks('organizations', { limit: 1 });
  const mediaBlock3 = await useReader(fetch).listMediaBlocks('projects', { limit: 1 });

  console.log('Media Blocks:', mediaBlocks);
  console.log('Media Block 1:', mediaBlock1);
  console.log('Media Block 2:', mediaBlock2);
  console.log('Media Block 3:', mediaBlock3);
  return { oauthProviders };
};
